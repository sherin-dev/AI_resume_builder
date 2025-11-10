
import React, { useState } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { ResumeData } from './types';
import { DEFAULT_RESUME_DATA } from './constants';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">AI Resume Builder</h1>
          <p className="text-sm text-gray-500">Powered by Gemini</p>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
          <div className="sticky top-8">
            <ResumePreview resumeData={resumeData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
