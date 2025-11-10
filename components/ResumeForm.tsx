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

const SectionTab = ({ activeSection, section, setSection, children }: { activeSection: Section, section: Section, setSection: (s: Section) => void, children: React.ReactNode }) => (
    <button
        onClick={() => setSection(section)}
        className={`px-3 py-2 text-sm font-medium rounded-t-md transition-colors border-b-2 ${activeSection === section ? 'border-slate-700 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
    >
        {children}
    </button>
);

const FormInput = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input {...props} className="w-full p-2 bg-slate-100 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-400 focus:bg-white outline-none transition-all" />
    </div>
);

const FormTextarea = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <textarea {...props} className="w-full p-2 bg-slate-100 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-400 focus:bg-white outline-none transition-all" />
    </div>
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
    <div className="bg-white p-6 rounded-xl shadow-lg shadow-slate-200/50">
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200">
        <SectionTab activeSection={activeSection} section="personal" setSection={setActiveSection}>Personal Info</SectionTab>
        <SectionTab activeSection={activeSection} section="summary" setSection={setActiveSection}>Summary</SectionTab>
        <SectionTab activeSection={activeSection} section="experience" setSection={setActiveSection}>Experience</SectionTab>
        <SectionTab activeSection={activeSection} section="education" setSection={setActiveSection}>Education</SectionTab>
        <SectionTab activeSection={activeSection} section="skills" setSection={setActiveSection}>Skills</SectionTab>
        <SectionTab activeSection={activeSection} section="projects" setSection={setActiveSection}>Projects</SectionTab>
      </div>

      <div className="space-y-6">
        {activeSection === 'personal' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-800">Personal Information</h3>
            <FormInput type="text" label="Full Name" placeholder="Full Name" value={resumeData.personalInfo.fullName} onChange={e => handleChange('personalInfo', null, 'fullName', e.target.value)} />
            <FormInput type="email" label="Email" placeholder="Email" value={resumeData.personalInfo.email} onChange={e => handleChange('personalInfo', null, 'email', e.target.value)} />
            <FormInput type="tel" label="Phone Number" placeholder="Phone Number" value={resumeData.personalInfo.phoneNumber} onChange={e => handleChange('personalInfo', null, 'phoneNumber', e.target.value)} />
            <FormInput type="text" label="Address" placeholder="Address" value={resumeData.personalInfo.address} onChange={e => handleChange('personalInfo', null, 'address', e.target.value)} />
            <FormInput type="text" label="Website/Portfolio" placeholder="Website/Portfolio" value={resumeData.personalInfo.website} onChange={e => handleChange('personalInfo', null, 'website', e.target.value)} />
          </div>
        )}
        {activeSection === 'summary' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-800">Professional Summary</h3>
                <button onClick={handleGenerateSummary} disabled={loadingStates.summary} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-slate-800 text-white rounded-md hover:bg-slate-900 disabled:bg-slate-400 transition-colors">
                    <SparklesIcon /> {loadingStates.summary ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
            <FormTextarea label="Your Summary" placeholder="Professional Summary" value={resumeData.summary} onChange={e => setResumeData(prev => ({ ...prev, summary: e.target.value }))} rows={5} />
          </div>
        )}
        {activeSection === 'experience' && (
           <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-800">Work Experience</h3>
                <button onClick={() => addToArray<Experience>('experience', { id: crypto.randomUUID(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' })} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors">
                    <PlusIcon /> Add
                </button>
             </div>
             {resumeData.experience.map((exp, index) => (
               <div key={exp.id} className="p-4 bg-slate-50/70 rounded-md space-y-4 border border-slate-200">
                 <div className="flex justify-between items-start">
                    <p className="font-semibold text-slate-700">{exp.jobTitle || "New Experience"}</p>
                    <button onClick={() => removeFromArray('experience', index)} className="text-slate-400 hover:text-red-500 transition-colors"> <TrashIcon /> </button>
                 </div>
                 <FormInput type="text" label="Job Title" placeholder="Job Title" value={exp.jobTitle} onChange={e => handleChange<Experience>('experience', index, 'jobTitle', e.target.value)} />
                 <FormInput type="text" label="Company" placeholder="Company" value={exp.company} onChange={e => handleChange<Experience>('experience', index, 'company', e.target.value)} />
                 <FormInput type="text" label="Location" placeholder="Location" value={exp.location} onChange={e => handleChange<Experience>('experience', index, 'location', e.target.value)} />
                 <div className="grid grid-cols-2 gap-4">
                    <FormInput type="date" label="Start Date" placeholder="Start Date" value={exp.startDate} onChange={e => handleChange<Experience>('experience', index, 'startDate', e.target.value)} />
                    <FormInput type="date" label="End Date" placeholder="End Date" value={exp.endDate} onChange={e => handleChange<Experience>('experience', index, 'endDate', e.target.value)} />
                 </div>
                 <div className="relative">
                    <FormTextarea label="Description" placeholder="Description" value={exp.description} onChange={e => handleChange<Experience>('experience', index, 'description', e.target.value)} rows={6} />
                     <button onClick={() => handleGetSuggestion(exp, index)} disabled={loadingStates[`exp-${exp.id}`]} className="absolute bottom-2.5 right-2 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-700 text-white rounded-md hover:bg-slate-800 disabled:bg-slate-400 transition-all transform hover:scale-105">
                         <SparklesIcon className="w-4 h-4" /> {loadingStates[`exp-${exp.id}`] ? 'Improving...' : 'Improve'}
                    </button>
                 </div>
               </div>
             ))}
           </div>
        )}
        {activeSection === 'education' && (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-slate-800">Education</h3>
                    <button onClick={() => addToArray<Education>('education', { id: crypto.randomUUID(), degree: '', school: '', location: '', graduationDate: '' })} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors">
                        <PlusIcon /> Add
                    </button>
                </div>
                {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 bg-slate-50/70 rounded-md space-y-4 border border-slate-200">
                         <div className="flex justify-between items-start">
                            <p className="font-semibold text-slate-700">{edu.degree || "New Education"}</p>
                            <button onClick={() => removeFromArray('education', index)} className="text-slate-400 hover:text-red-500 transition-colors"><TrashIcon /></button>
                        </div>
                        <FormInput type="text" label="Degree" placeholder="Degree" value={edu.degree} onChange={e => handleChange<Education>('education', index, 'degree', e.target.value)} />
                        <FormInput type="text" label="School" placeholder="School" value={edu.school} onChange={e => handleChange<Education>('education', index, 'school', e.target.value)} />
                        <FormInput type="text" label="Location" placeholder="Location" value={edu.location} onChange={e => handleChange<Education>('education', index, 'location', e.target.value)} />
                        <FormInput type="date" label="Graduation Date" placeholder="Graduation Date" value={edu.graduationDate} onChange={e => handleChange<Education>('education', index, 'graduationDate', e.target.value)} />
                    </div>
                ))}
            </div>
        )}
        {activeSection === 'skills' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-800">Skills</h3>
            <p className="text-sm text-slate-500">Enter skills separated by commas.</p>
            <FormInput type="text" label="Skills" placeholder="e.g., React, TypeScript, Leadership" value={resumeData.skills.join(', ')} onChange={handleSkillsChange} />
          </div>
        )}
        {activeSection === 'projects' && (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-slate-800">Projects</h3>
                     <button onClick={() => addToArray<Project>('projects', { id: crypto.randomUUID(), name: '', description: '', link: '' })} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors">
                        <PlusIcon /> Add
                    </button>
                </div>
                {resumeData.projects.map((proj, index) => (
                    <div key={proj.id} className="p-4 bg-slate-50/70 rounded-md space-y-4 border border-slate-200">
                        <div className="flex justify-between items-start">
                           <p className="font-semibold text-slate-700">{proj.name || "New Project"}</p>
                           <button onClick={() => removeFromArray('projects', index)} className="text-slate-400 hover:text-red-500 transition-colors"><TrashIcon /></button>
                        </div>
                        <FormInput type="text" label="Project Name" placeholder="Project Name" value={proj.name} onChange={e => handleChange<Project>('projects', index, 'name', e.target.value)} />
                        <FormInput type="text" label="Link" placeholder="Link" value={proj.link} onChange={e => handleChange<Project>('projects', index, 'link', e.target.value)} />
                        <FormTextarea label="Description" placeholder="Description" value={proj.description} onChange={e => handleChange<Project>('projects', index, 'description', e.target.value)} rows={3} />
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};