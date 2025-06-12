'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { io } from 'socket.io-client';

interface Project {
  id: string;
  name: string;
  description: string | null;
  pdf_attachment: string | null;
  estimated_budget: string | null;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at: string;
}

export default function Projects() {
  const { toast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'created_at' | 'updated_at' | 'status'>>({
    name: '',
    description: '',
    pdf_attachment: '',
    estimated_budget: '',
  });
  const [projectStatus, setProjectStatus] = useState<Project['status']>('PENDING');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchProjects();

    const socket = io(SOCKET_URL);

    socket.on('project:created', (newProject) => {
      console.log('Project created in real-time:', newProject);
      setProjects((prevProjects) => [...prevProjects, newProject]);
    });

    socket.on('project:updated', (updatedProject) => {
      console.log('Project updated in real-time:', updatedProject);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
    });

    socket.on('project:deleted', (deletedProjectId) => {
      console.log('Project deleted in real-time:', deletedProjectId);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== deletedProjectId)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [toast, API_URL, SOCKET_URL, filterStatus]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const url = filterStatus !== 'All' ? `${API_URL}/projects?status=${filterStatus}` : `${API_URL}/projects`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProjectClick = () => {
    setCurrentProject(null);
    setFormData({ name: '', description: '', pdf_attachment: '', estimated_budget: '' });
    setProjectStatus('PENDING');
    setIsModalOpen(true);
  };

  const handleEditProjectClick = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      pdf_attachment: project.pdf_attachment || '',
      estimated_budget: project.estimated_budget || '',
    });
    setProjectStatus(project.status);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.statusText}`);
      }

      toast({
        title: 'Success',
        description: 'Project deleted successfully.',
        duration: 3000,
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project.',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Setting isLoading to true');
    setIsLoading(true);

    try {
      const method = currentProject ? 'PUT' : 'POST';
      const url = currentProject ? `${API_URL}/projects/${currentProject.id}` : `${API_URL}/projects`;

      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('description', formData.description || '');
      dataToSend.append('estimated_budget', formData.estimated_budget || '');
      dataToSend.append('status', projectStatus);
      if (pdfFile) {
        dataToSend.append('pdf_attachment', pdfFile);
      } else if (currentProject && formData.pdf_attachment) {
        dataToSend.append('pdf_attachment', formData.pdf_attachment);
      } else {
        dataToSend.append('pdf_attachment', '');
      }

      const response = await fetch(url, {
        method,
        body: dataToSend,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${currentProject ? 'update' : 'create'} project: ${response.statusText}`);
      }

      toast({
        title: 'Success',
        description: `Project ${currentProject ? 'updated' : 'created'} successfully.`, 
        duration: 3000,
      });
      setIsModalOpen(false);
      setPdfFile(null);
      fetchProjects();
    } catch (error) {
      console.error(`Error ${currentProject ? 'updating' : 'creating'} project:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${currentProject ? 'update' : 'create'} project.`, 
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="p-6 my-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="p-6 my-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Projects Dashboard</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search projects by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="filterStatus" className="sr-only">Filter by Status</Label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <Button onClick={handleAddProjectClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
        </div>
      </div>
      <div className="w-full my-5">
        {filteredProjects.length === 0 ? (
          <p>No projects found matching your search.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Project Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Project Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Project PDF
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Estimated Budget
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.pdf_attachment ? (
                        <a
                          href={`${API_URL.replace('/api', '')}${project.pdf_attachment}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View PDF
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.estimated_budget}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {(project.status || 'UNKNOWN').toLowerCase().replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProjectClick(project)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            <DialogDescription>
              {currentProject ? 'Edit the details of the project.' : 'Add a new project to your dashboard.'}
            </DialogDescription>
          </DialogHeader>
          <form id="project-form" onSubmit={handleFormSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Project Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Project Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pdf_attachment" className="text-right">
                Project PDF
              </Label>
              <Input
                id="pdf_attachment"
                name="pdf_attachment"
                type="file"
                onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
                className="col-span-3"
              />
            </div>
            {currentProject?.pdf_attachment && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Current PDF</Label>
                <div className="col-span-3 flex items-center">
                  <a
                    href={`${API_URL.replace('/api', '')}${currentProject.pdf_attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900 truncate"
                  >
                    {currentProject.pdf_attachment.split('/').pop()}
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFormData(prev => ({ ...prev, pdf_attachment: '' }))}
                    className="ml-2 text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estimated_budget" className="text-right">
                Estimated Budget
              </Label>
              <Input
                id="estimated_budget"
                name="estimated_budget"
                value={formData.estimated_budget || ''}
                onChange={handleFormChange}
                className="col-span-3"
                type="text"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <select
                id="status"
                name="status"
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value as Project['status'])}
                className="col-span-3 border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </form>
          <DialogFooter>
            <Button type="submit" form="project-form" disabled={isLoading}> 
              {isLoading ? 'Saving...' : currentProject ? 'Save Changes' : 'Add Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 