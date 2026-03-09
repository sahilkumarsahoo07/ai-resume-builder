import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Resume from './models/Resume.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const dummyUser = {
    _id: '123456789012345678901234', // Matches mock user in authMiddleware.js
    googleId: '123456789',
    email: 'testuser@example.com',
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/150'
};

const dummyResumes = [
    {
        title: 'Software Engineer Resume',
        template: 'Modern',
        personalInfo: {
            name: 'John Doe',
            email: 'testuser@example.com',
            phone: '+1 234 567 890',
            location: 'New York, USA',
            linkedin: 'linkedin.com/in/johndoe',
            portfolio: 'johndoe.dev'
        },
        summary: 'Experienced Software Engineer with a passion for building scalable web applications and AI-driven solutions.',
        experience: [
            {
                id: uuidv4(),
                company: 'Tech Corp',
                role: 'Senior Developer',
                duration: '2021 - Present',
                description: 'Led the development of a microservices architecture using Node.js and React.'
            },
            {
                id: uuidv4(),
                company: 'Web Solutions',
                role: 'Full Stack Developer',
                duration: '2018 - 2021',
                description: 'Developed and maintained various client websites and internal tools.'
            }
        ],
        education: [
            {
                id: uuidv4(),
                institution: 'State University',
                degree: 'B.S. in Computer Science',
                year: '2018'
            }
        ],
        projects: [
            {
                id: uuidv4(),
                name: 'AI Resume Builder',
                description: 'A platform that uses AI to help users build professional resumes.',
                techStack: 'React, Node.js, MongoDB, OpenRouter API'
            }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'AWS']
    },
    {
        title: 'Frontend Developer Portfolio',
        template: 'Professional',
        personalInfo: {
            name: 'John Doe',
            email: 'testuser@example.com',
            phone: '+1 234 567 890',
            location: 'New York, USA',
            linkedin: 'linkedin.com/in/johndoe',
            portfolio: 'johndoe.dev'
        },
        summary: 'Creative Frontend Developer specializing in building responsive and interactive user interfaces.',
        experience: [
            {
                id: uuidv4(),
                company: 'Design Studio',
                role: 'UI/UX Developer',
                duration: '2020 - 2022',
                description: 'Worked closely with designers to implement pixel-perfect web interfaces.'
            }
        ],
        education: [
            {
                id: uuidv4(),
                institution: 'State University',
                degree: 'B.S. in Computer Science',
                year: '2018'
            }
        ],
        projects: [
            {
                id: uuidv4(),
                name: 'Portfolio Website',
                description: 'A personal portfolio showcasing design and development projects.',
                techStack: 'Next.js, Tailwind CSS, Framer Motion'
            }
        ],
        skills: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Framer Motion', 'Figma']
    }
];

const seedDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }
        console.log('Connecting to MongoDB at:', mongoURI.replace(/:([^@]+)@/, ':****@'));
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to MongoDB successfully');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Resume.deleteMany({});

        // Create User
        console.log('Creating dummy user...');
        const user = await User.create(dummyUser);
        console.log(`User created: ${user._id}`);

        // Create Resumes
        console.log('Creating dummy resumes...');
        const resumesToInsert = dummyResumes.map(resume => ({
            ...resume,
            userId: user._id
        }));

        await Resume.insertMany(resumesToInsert);
        console.log(`${resumesToInsert.length} resumes created successfully`);

        console.log('Database seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err.message);
        process.exit(1);
    }
};

seedDB();
