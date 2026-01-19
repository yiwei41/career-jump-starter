
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, RoleEvaluation } from '../types';
import { StepIndicator } from '../constants';
import { evaluateRoles } from '../services/geminiService';

interface EvaluationPageProps {
  state: AppState;
  onUpdateInterest: (role: string) => void;
  onUpdateEval: (evals: RoleEvaluation[]) => void;
  onSelectRole: (role: RoleEvaluation) => void;
}

const EvaluationPage: React.FC<EvaluationPageProps> = ({ state, onUpdateInterest, onUpdateEval, onSelectRole }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [interestRole, setInterestRole] = useState(state.interestRole);
  const [selectedRoleType, setSelectedRoleType] = useState<string | null>(state.selectedRole?.roleType || null);

  const startEvaluation = async () => {
    setLoading(true);
    onUpdateInterest(interestRole);
    try {
      const results = await evaluateRoles(state.profile, interestRole);
      onUpdateEval(results);
    } catch (error) {
      console.error("Evaluation failed", error);
      alert("Failed to evaluate roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (role: RoleEvaluation) => {
    setSelectedRoleType(role.roleType);
    onSelectRole(role);
  };

  const handleNext = () => {
    if (!state.selectedRole) {
      alert("Please select a role from the table first.");
      return;
    }
    navigate('/skills');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <StepIndicator currentStep={1} />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i className="fas fa-robot text-blue-600"></i> AI Recruiter Analysis
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-semibold text-slate-600 mb-1">Role you're interested in (Optional)</label>
            <input
              type="text"
              value={interestRole}
              onChange={(e) => setInterestRole(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Frontend Engineer, Product Manager..."
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={startEvaluation}
              disabled={loading}
              className="w-full md:w-auto bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-400 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i> Start Evaluation
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {state.evaluations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm font-semibold border-b border-slate-200">
                  <th className="px-6 py-4">Select</th>
                  <th className="px-6 py-4">Role Type</th>
                  <th className="px-6 py-4">Relevance</th>
                  <th className="px-6 py-4">AI Recruiter Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.evaluations.map((role) => (
                  <tr 
                    key={role.roleType} 
                    className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedRoleType === role.roleType ? 'bg-blue-50' : ''}`}
                    onClick={() => handleSelect(role)}
                  >
                    <td className="px-6 py-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRoleType === role.roleType ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                        {selectedRoleType === role.roleType && <i className="fas fa-check text-white text-[10px]"></i>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{role.roleType}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-grow bg-slate-200 h-2 w-16 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full" style={{ width: `${role.relevance}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{role.relevance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 italic">"{role.why}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-all"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back
        </button>
        <button
          onClick={handleNext}
          disabled={!state.selectedRole}
          className={`px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all ${
            state.selectedRole
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          Skills Match <i className="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  );
};

export default EvaluationPage;
