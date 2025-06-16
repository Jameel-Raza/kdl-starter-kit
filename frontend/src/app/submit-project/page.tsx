'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function SubmitProject() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    estimated_budget: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('estimated_budget', formData.estimated_budget);
    if (pdfFile) {
      dataToSend.append('pdf_attachment', pdfFile);
    }

    try {
      // This API endpoint will need to be created in the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userProjects/submit-project`, {
        method: 'POST',
        body: dataToSend,
      });

      if (!response.ok) {
        throw new Error(`Failed to submit project: ${response.statusText}`);
      }

      toast({
        title: 'Success',
        description: 'Project submitted successfully!',
        duration: 5000,
      });
      // Clear form
      setFormData({ name: '', description: '', estimated_budget: '' });
      setPdfFile(null);
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit project.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 my-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Submit Your Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Project Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
          />
        </div>
        <div>
          <Label htmlFor="pdf_attachment">Project PDF (Optional)</Label>
          <Input
            id="pdf_attachment"
            name="pdf_attachment"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <Label htmlFor="estimated_budget">Estimated Budget</Label>
          <Input
            id="estimated_budget"
            name="estimated_budget"
            value={formData.estimated_budget}
            onChange={handleInputChange}
            type="text"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Project'}
        </Button>
      </form>
    </div>
  );
}