import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const serializeBigInt = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
};

// Get all CMS entries
export const getUsers = async (req, res) => {
  const usersList = await prisma.users.findMany();
  res.json(serializeBigInt(usersList));
};

// Get CMS entry by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { id: BigInt(id) },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(serializeBigInt(user));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create CMS entry
export const createUser = async (req, res) => {
  const { password, ...rest } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const user = await prisma.users.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });

    res.status(201).json(serializeBigInt(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Update CMS entry
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = await prisma.users.update({
    where: { id: BigInt(id) },
    data,
  });
  res.json(serializeBigInt(user));
};

// Delete CMS entry
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await prisma.users.delete({
    where: { id: BigInt(id) },
  });
  res.status(204).send();
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: serializeBigInt(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get users with roles
export const getUsersWithRoles = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        address: true,
        role: true, // Include the role
        created_at: true,
        updated_at: true,
      },
    });
    res.json(serializeBigInt(users));
  } catch (error) {
    console.error('Error fetching users with roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};