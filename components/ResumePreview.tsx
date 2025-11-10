
import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const ResumeSection: React.FC<{ title: string; children: React.ReactNode; show: boolean }> = ({ title, children, show }) => {
    if (!show) return null;
    return (
        <section className="mb-6">
            <h2 className="text-lg font-bold text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3 uppercase tracking-wider">
                {title}
            </h2>
            {children}
        </section>
    );
};

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg aspect-[8.5/11] max-w-2xl mx-auto overflow-y-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{personalInfo.fullName}</h1>
        <p className="text-sm text-gray-500 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phoneNumber && <span className="mx-2">|</span>}
          {personalInfo.phoneNumber && <span>{personalInfo.phoneNumber}</span>}
          {personalInfo.address && <span className="mx-2">|</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span className="mx-2">|</span>}
          {personalInfo.website && <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{personalInfo.website}</a>}
        </p>
      </header>

      <ResumeSection title="Summary" show={!!summary}>
        <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
      </ResumeSection>

      <ResumeSection title="Experience" show={experience.length > 0}>
        <div className="space-y-4">
          {experience.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-gray-800">{exp.jobTitle}</h3>
                <span className="text-xs font-medium text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-medium text-indigo-600">{exp.company}</p>
                <p className="text-xs text-gray-500">{exp.location}</p>
              </div>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-600 space-y-1">
                {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                  <li key={i}>{line.replace(/^-/, '').trim()}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ResumeSection>
      
      <ResumeSection title="Education" show={education.length > 0}>
        <div className="space-y-2">
          {education.map(edu => (
            <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                    <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-sm text-indigo-600">{edu.school}, <span className="text-gray-500">{edu.location}</span></p>
                </div>
              <span className="text-xs font-medium text-gray-500">{formatDate(edu.graduationDate)}</span>
            </div>
          ))}
        </div>
      </ResumeSection>

      <ResumeSection title="Projects" show={projects.length > 0}>
        <div className="space-y-4">
          {projects.map(proj => (
            <div key={proj.id}>
              <div className="flex items-baseline gap-2">
                 <h3 className="font-semibold text-gray-800">{proj.name}</h3>
                 {proj.link && <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">[{proj.link}]</a>}
              </div>
              <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
            </div>
          ))}
        </div>
      </ResumeSection>
      
      <ResumeSection title="Skills" show={skills.length > 0}>
        <div className="flex flex-wrap gap-2">
            {skills.filter(s => s).map((skill, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
            ))}
        </div>
      </ResumeSection>

    </div>
  );
};
