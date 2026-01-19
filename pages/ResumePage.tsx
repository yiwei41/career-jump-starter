
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../types';
import { StepIndicator } from '../constants';
import { generateResume } from '../services/geminiService';

interface ResumePageProps {
  state: AppState;
  onUpdateResume: (resume: string) => void;
}

const ResumePage: React.FC<ResumePageProps> = ({ state, onUpdateResume }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!state.resume);

  useEffect(() => {
    if (!state.resume && state.selectedRole) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    if (!state.selectedRole) return;
    setLoading(true);
    try {
      const result = await generateResume(state.profile, state.selectedRole.roleType);
      onUpdateResume(result);
    } catch (error) {
      console.error("Resume generation failed", error);
      alert("Failed to generate resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Simple Markdown renderer helper
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-4 mt-6">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3 mt-5 uppercase tracking-wide">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-slate-700 mb-1 mt-4">{line.replace('### ', '')}</h3>;
      if (line.startsWith('- ')) return <li key={i} className="ml-6 mb-1 text-slate-700 list-disc">{line.replace('- ', '')}</li>;
      if (line.trim() === '') return <div key={i} className="h-2"></div>;
      return <p key={i} className="text-slate-700 leading-relaxed mb-1">{line}</p>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-20">
      <div className="print:hidden">
        <StepIndicator currentStep={3} />
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-8 print:shadow-none print:border-none">
        <div className="bg-slate-800 p-4 text-white flex justify-between items-center print:hidden">
          <h2 className="font-bold flex items-center gap-2">
            <i className="fas fa-file-alt text-blue-400"></i> Your Tailored Resume
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={handleGenerate}
              className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm font-medium transition-colors"
              disabled={loading}
            >
              <i className="fas fa-sync-alt mr-1"></i> Regenerate
            </button>
            <button 
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm font-medium transition-colors"
              disabled={loading}
            >
              <i className="fas fa-print mr-1"></i> Print / PDF
            </button>
          </div>
        </div>

        <div className="p-10 bg-white min-h-[800px] shadow-inner print:p-0 print:shadow-none">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[600px] text-slate-400">
              <i className="fas fa-circle-notch fa-spin text-4xl mb-4 text-blue-500"></i>
              <p className="text-lg font-medium animate-pulse">AI is crafting your professional resume...</p>
              <p className="text-sm mt-2">Tailoring content for {state.selectedRole?.roleType}</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none resume-content">
              {renderMarkdown(state.resume)}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-start print:hidden">
        <button
          onClick={() => navigate('/skills')}
          className="px-6 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-all"
        >
          <i className="fas fa-arrow-left mr-2"></i> Edit Skills Match
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white; }
          header, footer, .print-hidden { display: none !important; }
          .resume-content { font-size: 12pt; line-height: 1.5; color: black !important; }
          .resume-content h1 { font-size: 24pt; margin-bottom: 10pt; }
          .resume-content h2 { font-size: 16pt; margin-top: 15pt; border-bottom: 1pt solid #ccc; }
          .resume-content p, .resume-content li { font-size: 11pt; color: black !important; }
        }
      `}} />
    </div>
  );
};

export default ResumePage;
