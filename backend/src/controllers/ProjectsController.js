import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const serializeBigInt = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
};

// Get all clients
export const getProjectsList = async (req, res) => {
  const projectsList = await prisma.projects.findMany();
  res.json(serializeBigInt(projectsList));
};

// Get project by ID
export const getProjectsById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.projects.findUnique({
      where: { id: BigInt(id) },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(serializeBigInt(project));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create client entry
export const createProject = async (req, res) => {
  const { name, description, pdf_attachment, estimated_budget } = req.body;
  const project = await prisma.projects.create({ data: { name, description, pdf_attachment, estimated_budget } });
  const io = req.app.get('socketio');
  io.emit('project:created', serializeBigInt(project));
  res.status(201).json(serializeBigInt(project));
};

// Update project entry
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, pdf_attachment, estimated_budget } = req.body;
  const project = await prisma.projects.update({
    where: { id: BigInt(id) },
    data: { name, description, pdf_attachment, estimated_budget },
  });
  const io = req.app.get('socketio');
  io.emit('project:updated', serializeBigInt(project));
  res.json(serializeBigInt(project));
};

// Delete project entry
export const deleteProject = async (req, res) => {
  const { id } = req.params;
  await prisma.projects.delete({
    where: { id: BigInt(id) },
  });
  const io = req.app.get('socketio');
  io.emit('project:deleted', id);
  res.status(204).send();
};