import React, { useState } from 'react';
import { ResumeData, Experience, Education, Project } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { generateSummary, getExperienceSuggestion } from '../services/geminiService';

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

type Section = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects';

const SectionButton = ({ activeSection, section, setSection, children }: { activeSection: Section, section: Section, setSection: (s: Section) => void, children: React.ReactNode }) => (
    <button
        onClick={() => setSection(section)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === section ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
        {children}
    </button>
);


export const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, setResumeData }) => {
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  const handleChange = <T,>(
    section: keyof ResumeData,
    index: number | null,
    field: keyof T,
    value: string
  ) => {
    setResumeData(prev => {
      const newData = { ...prev };
      if (index !== null && Array.isArray(newData[section])) {
        const newArray = [...(newData[section] as T[])];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...newData, [section]: newArray };
      } else if (index === null && typeof newData[section] === 'object' && !Array.isArray(newData[section])) {
        return { ...newData, [section]: { ...(newData[section] as object), [field]: value } };
      } else {
        return { ...newData, [section]: value };
      }
    });
  };
  
  const addToArray = <T,>(section: keyof ResumeData, newItem: T) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...(prev[section] as T[]), newItem]
    }));
  };

  const removeFromArray = (section: keyof ResumeData, index: number) => {
    setResumeData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i) => i !== index)
    }));
  };

  const handleGenerateSummary = async () => {
    setLoadingStates(prev => ({ ...prev, summary: true }));
    const summary = await generateSummary(resumeData);
    // FIX: Use setResumeData directly for primitive fields to avoid TypeScript errors with the generic handleChange function.
    setResumeData(prev => ({ ...prev, summary }));
    setLoadingStates(prev => ({ ...prev, summary: false }));
  };

  const handleGetSuggestion = async (exp: Experience, index: number) => {
    setLoadingStates(prev => ({ ...prev, [`exp-${exp.id}`]: true }));
    const suggestion = await getExperienceSuggestion(exp);
    handleChange<Experience>('experience', index, 'description', suggestion);
    setLoadingStates(prev => ({ ...prev, [`exp-${exp.id}`]: false }));
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setResumeData(prev => ({...prev, skills }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-wrap gap-2 mb-6">
        <SectionButton activeSection={activeSection} section="personal" setSection={setActiveSection}>Personal Info</SectionButton>
        <SectionButton activeSection={activeSection} section="summary" setSection={setActiveSection}>Summary</SectionButton>
        <SectionButton activeSection={activeSection} section="experience" setSection={setActiveSection}>Experience</SectionButton>
        <SectionButton activeSection={activeSection} section="education" setSection={setActiveSection}>Education</SectionButton>
        <SectionButton activeSection={activeSection} section="skills" setSection={setActiveSection}>Skills</SectionButton>
        <SectionButton activeSection={activeSection} section="projects" setSection={setActiveSection}>Projects</SectionButton>
      </div>

      <div className="space-y-6">
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
            <input type="text" placeholder="Full Name" value={resumeData.personalInfo.fullName} onChange={e => handleChange('personalInfo', null, 'fullName', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
            <input type="email" placeholder="Email" value={resumeData.personalInfo.email} onChange={e => handleChange('personalInfo', null, 'email', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
            <input type="tel" placeholder="Phone Number" value={resumeData.personalInfo.phoneNumber} onChange={e => handleChange('personalInfo', null, 'phoneNumber', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
            <input type="text" placeholder="Address" value={resumeData.personalInfo.address} onChange={e => handleChange('personalInfo', null, 'address', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
            <input type="text" placeholder="Website/Portfolio" value={resumeData.personalInfo.website} onChange={e => handleChange('personalInfo', null, 'website', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
          </div>
        )}
        {activeSection === 'summary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Professional Summary</h3>
                <button onClick={handleGenerateSummary} disabled={loadingStates.summary} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors">
                    <SparklesIcon /> {loadingStates.summary ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
            {/* FIX: Use setResumeData directly for primitive fields to avoid TypeScript errors with the generic handleChange function. */}
            <textarea placeholder="Professional Summary" value={resumeData.summary} onChange={e => setResumeData(prev => ({ ...prev, summary: e.target.value }))} rows={5} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"></textarea>
          </div>
        )}
        {activeSection === 'experience' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Work Experience</h3>
                <button onClick={() => addToArray<Experience>('experience', { id: crypto.randomUUID(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' })} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    <PlusIcon /> Add Experience
                </button>
             </div>
             {resumeData.experience.map((exp, index) => (
               <div key={exp.id} className="p-4 border border-gray-200 rounded-md space-y-4">
                 <div className="flex justify-end">
                    <button onClick={() => removeFromArray('experience', index)} className="text-red-500 hover:text-red-700"> <TrashIcon /> </button>
                 </div>
                 <input type="text" placeholder="Job Title" value={exp.jobTitle} onChange={e => handleChange<Experience>('experience', index, 'jobTitle', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
                 <input type="text" placeholder="Company" value={exp.company} onChange={e => handleChange<Experience>('experience', index, 'company', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
                 <input type="text" placeholder="Location" value={exp.location} onChange={e => handleChange<Experience>('experience', index, 'location', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="date" placeholder="Start Date" value={exp.startDate} onChange={e => handleChange<Experience>('experience', index, 'startDate', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
                    <input type="date" placeholder="End Date" value={exp.endDate} onChange={e => handleChange<Experience>('experience', index, 'endDate', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
                 </div>
                 <div className="relative">
                    <textarea placeholder="Description" value={exp.description} onChange={e => handleChange<Experience>('experience', index, 'description', e.target.value)} rows={6} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"></textarea>
                     <button onClick={() => handleGetSuggestion(exp, index)} disabled={loadingStates[`exp-${exp.id}`]} className="absolute bottom-2 right-2 flex items-center gap-2 px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors">
                         <SparklesIcon className="w-4 h-4" /> {loadingStates[`exp-${exp.id}`] ? 'Improving...' : 'Improve with AI'}
                    </button>
                 </div>
               </div>
             ))}
           </div>
        )}
        {activeSection === 'education' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Education</h3>
                    <button onClick={() => addToArray<Education>('education', { id: crypto.randomUUID(), degree: '', school: '', location: '', graduationDate: '' })} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        <PlusIcon /> Add Education
                    </button>
                </div>
                {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 border border-gray-200 rounded-md space-y-4">
                        <div className="flex justify-end">
                            <button onClick={() => removeFromArray('education', index)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                        </div>
                        <input type="text" placeholder="Degree" value={edu.degree} onChange={e => handleChange<Education>('education', index, 'degree', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
                        <input type="text" placeholder="School" value={edu.school} onChange={e => handleChange<Education>('education', index, 'school', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
                        <input type="text" placeholder="Location" value={edu.location} onChange={e => handleChange<Education>('education', index, 'location', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
                        <input type="date" placeholder="Graduation Date" value={edu.graduationDate} onChange={e => handleChange<Education>('education', index, 'graduationDate', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
                    </div>
                ))}
            </div>
        )}
        {activeSection === 'skills' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
            <p className="text-sm text-gray-500">Enter skills separated by commas.</p>
            <input type="text" placeholder="e.g., React, TypeScript, Leadership" value={resumeData.skills.join(', ')} onChange={handleSkillsChange} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
          </div>
        )}
        {activeSection === 'projects' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Projects</h3>
                    <button onClick={() => addToArray<Project>('projects', { id: crypto.randomUUID(), name: '', description: '', link: '' })} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        <PlusIcon /> Add Project
                    </button>
                </div>
                {resumeData.projects.map((proj, index) => (
                    <div key={proj.id} className="p-4 border border-gray-200 rounded-md space-y-4">
                        <div className="flex justify-end">
                           <button onClick={() => removeFromArray('projects', index)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                        </div>
                        <input type="text" placeholder="Project Name" value={proj.name} onChange={e => handleChange<Project>('projects', index, 'name', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
                        <input type="text" placeholder="Link" value={proj.link} onChange={e => handleChange<Project>('projects', index, 'link', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"/>
                        <textarea placeholder="Description" value={proj.description} onChange={e => handleChange<Project>('projects', index, 'description', e.target.value)} rows={3} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"></textarea>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};