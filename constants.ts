
import { ResumeData } from './types';

export const DEFAULT_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: "Your Name",
    email: "your.email@example.com",
    phoneNumber: "(123) 456-7890",
    address: "Your City, ST",
    website: "yourportfolio.com",
  },
  summary: "A brief professional summary about you. Click the magic wand to generate one with AI based on your experience and skills!",
  experience: [
    {
      id: crypto.randomUUID(),
      jobTitle: "Software Engineer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "2020-01-01",
      endDate: "2023-12-31",
      description: "- Developed and maintained web applications using React and Node.js.\n- Collaborated with cross-functional teams to deliver high-quality software.\n- Improved application performance by 20% through code optimization."
    }
  ],
  education: [
    {
      id: crypto.randomUUID(),
      degree: "B.S. in Computer Science",
      school: "University of Technology",
      location: "Techville, USA",
      graduationDate: "2020-05-01",
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Gemini API", "Problem Solving"],
  projects: [
    {
      id: crypto.randomUUID(),
      name: "Personal Portfolio",
      description: "A responsive website to showcase my projects and skills.",
      link: "yourportfolio.com"
    }
  ],
};
