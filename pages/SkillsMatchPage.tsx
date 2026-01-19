
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, SkillMatch } from '../types';
import { StepIndicator } from '../constants';
import { matchSkills } from '../services/geminiService';

interface SkillsMatchPageProps {
  state: AppState;
  onUpdateSkills: (skills: SkillMatch[]) => void;
}

const SkillsMatchPage: React.FC<SkillsMatchPageProps> = ({ state, onUpdateSkills }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const startMatch = async () => {
    if (!state.selectedRole) return;
    setLoading(true);
    try {
      const results = await matchSkills(state.profile, state.selectedRole.roleType);
      onUpdateSkills(results);
    } catch (error) {
      console.error("Skills match failed", error);
      alert("Failed to analyze skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Proficient': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Learning': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Gap': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'High': return <i className="fas fa-exclamation-circle text-rose-500"></i>;
      case 'Medium': return <i className="fas fa-circle text-amber-500"></i>;
      case 'Low': return <i className="fas fa-info-circle text-blue-500"></i>;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <StepIndicator currentStep={2} />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8 text-center">
        <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
          <i className="fas fa-bullseye text-3xl text-blue-600"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Selected Role: {state.selectedRole?.roleType}</h2>
        <p className="text-slate-500 mb-6 max-w-lg mx-auto">We'll compare your profile against the key competencies required for this specific role to see where you excel and where you can grow.</p>
        
        <button
          onClick={startMatch}
          disabled={loading}
          className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-3 mx-auto"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Analyzing Skills...
            </>
          ) : (
            <>
              <i className="fas fa-tasks"></i> Start Skills Match
            </>
          )}
        </button>
      </div>

      {state.skillMatches.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm font-semibold border-b border-slate-200">
                  <th className="px-6 py-4">Skill</th>
                  <th className="px-6 py-4">Importance</th>
                  <th className="px-6 py-4">Your Status</th>
                  <th className="px-6 py-4">AI Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.skillMatches.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{item.skill}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getImportanceIcon(item.importance)}
                        <span className="text-sm">{item.importance}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate('/evaluation')}
          className="px-6 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-all"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back
        </button>
        <button
          onClick={() => navigate('/resume')}
          disabled={state.skillMatches.length === 0}
          className={`px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all ${
            state.skillMatches.length > 0
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          Generate Resume <i className="fas fa-file-invoice ml-2"></i>
        </button>
      </div>
    </div>
  );
};

export default SkillsMatchPage;
