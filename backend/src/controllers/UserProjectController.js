import { PrismaClient } from '../generated/prisma/index.js';
import multer from 'multer';
import path from 'path';
import { io } from '../index.js';

// Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/'); // Directory to store uploaded PDFs
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

export const submitProject = async (req, res) => {
    const prisma = new PrismaClient();
    console.log('Prisma client instantiated in submitProject:', prisma);
    console.log('Prisma.projects in submitProject:', prisma.projects);
    try {
        const { name, description, estimated_budget } = req.body;
        const pdf_attachment = req.file ? `/uploads/${req.file.filename}` : null;

        const newProject = await prisma.projects.create({
            data: {
                name,
                description,
                estimated_budget: estimated_budget,
                pdf_attachment,
            },
        });

        // Convert BigInt ID to string before emitting via Socket.IO
        const projectToSend = { ...newProject, id: newProject.id.toString() };

        io.emit('project:created', projectToSend);
        // Convert BigInt ID to string before sending JSON response
        const responseProject = { ...newProject, id: newProject.id.toString() };
        res.status(201).json(responseProject);
    } catch (error) {
        console.error('Error submitting project:', error);
        res.status(500).json({ error: 'Failed to submit project' });
    }
}; 