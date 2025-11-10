import React, { useState } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { ResumeData } from './types';
import { DEFAULT_RESUME_DATA } from './constants';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
             <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Resume Builder</h1>
          </div>
          <p className="text-sm text-slate-500">Powered by Gemini</p>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
          <div className="sticky top-24">
            <ResumePreview resumeData={resumeData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;