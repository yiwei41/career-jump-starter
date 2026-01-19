
import React from 'react';

export const STEPS = [
  { id: 'profile', label: 'Create Profile', icon: 'fa-user' },
  { id: 'evaluation', label: 'Role Evaluation', icon: 'fa-search' },
  { id: 'skills', label: 'Skills Match', icon: 'fa-check-circle' },
  { id: 'resume', label: 'Generate Resume', icon: 'fa-file-alt' }
];

export const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  return (
    <div className="flex justify-between items-center mb-10 overflow-x-auto pb-4">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center flex-1 min-w-[100px]">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            index <= currentStep ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
          }`}>
            <i className={`fas ${step.icon}`}></i>
          </div>
          <span className={`text-xs mt-2 font-medium text-center ${
            index <= currentStep ? 'text-blue-600' : 'text-slate-400'
          }`}>
            {step.label}
          </span>
          {index < STEPS.length - 1 && (
            <div className={`hidden md:block absolute h-0.5 bg-slate-200 -z-10`} style={{
              width: '15%',
              left: `${(index * 25) + 12.5}%`,
              top: '20px'
            }}></div>
          )}
        </div>
      ))}
    </div>
  );
};
