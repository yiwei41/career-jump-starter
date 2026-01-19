
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AppState, UserProfile } from './types';
import ProfilePage from './pages/ProfilePage';
import EvaluationPage from './pages/EvaluationPage';
import SkillsMatchPage from './pages/SkillsMatchPage';
import ResumePage from './pages/ResumePage';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    profile: {
      name: '',
      email: '',
      education: '',
      projects: []
    },
    evaluations: [],
    selectedRole: null,
    skillMatches: [],
    resume: '',
    interestRole: ''
  });

  const updateProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  };

  const updateInterestRole = (role: string) => {
    setState(prev => ({ ...prev, interestRole: role }));
  };

  const updateEvaluations = (evaluations: any[]) => {
    setState(prev => ({ ...prev, evaluations }));
  };

  const selectRole = (role: any) => {
    setState(prev => ({ ...prev, selectedRole: role }));
  };

  const updateSkills = (skills: any[]) => {
    setState(prev => ({ ...prev, skillMatches: skills }));
  };

  const updateResume = (resume: string) => {
    setState(prev => ({ ...prev, resume }));
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
              <i className="fas fa-rocket"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Career Jump Starter</h1>
          </div>
        </header>

        <main className="flex-grow max-w-5xl mx-auto w-full p-6">
          <Routes>
            <Route 
              path="/" 
              element={<ProfilePage state={state} onUpdate={updateProfile} />} 
            />
            <Route 
              path="/evaluation" 
              element={<EvaluationPage state={state} onUpdateInterest={updateInterestRole} onUpdateEval={updateEvaluations} onSelectRole={selectRole} />} 
            />
            <Route 
              path="/skills" 
              element={<SkillsMatchPage state={state} onUpdateSkills={updateSkills} />} 
            />
            <Route 
              path="/resume" 
              element={<ResumePage state={state} onUpdateResume={updateResume} />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Career Jump Starter - Empowering New Graduates
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
