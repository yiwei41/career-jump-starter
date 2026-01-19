
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, Project, FileData, UserProfile } from '../types';
import { StepIndicator } from '../constants';

interface ProfilePageProps {
  state: AppState;
  onUpdate: (profile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ state, onUpdate }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(state.profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      files: []
    };
    setProfile(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const handleFileUpload = async (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: FileData[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      const filePromise = new Promise<FileData>((resolve) => {
        reader.onload = (e) => {
          resolve({
            name: file.name,
            type: file.type,
            data: (e.target?.result as string).split(',')[1] // base64 without prefix
          });
        };
      });
      reader.readAsDataURL(file);
      newFiles.push(await filePromise);
    }

    setProfile(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, files: [...p.files, ...newFiles] } : p)
    }));
  };

  const removeFile = (projectId: string, fileName: string) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, files: p.files.filter(f => f.name !== fileName) } : p)
    }));
  };

  const handleNext = () => {
    onUpdate(profile);
    navigate('/evaluation');
  };

  const isFormValid = profile.name && profile.email && profile.education && profile.projects.length > 0;

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <StepIndicator currentStep={0} />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-id-card"></i> Basic Profile
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Education Background</label>
            <textarea
              name="education"
              value={profile.education}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              placeholder="E.g., BS in Computer Science, MIT, Class of 2024. Relevant coursework: ML, Data Structures, etc."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-briefcase"></i> Project Experience
          </h2>
          <button 
            onClick={addProject}
            className="bg-white text-emerald-700 px-3 py-1 rounded-lg text-sm font-bold hover:bg-emerald-50 transition-colors"
          >
            + Add Project
          </button>
        </div>
        <div className="p-6 space-y-8">
          {profile.projects.length === 0 && (
            <p className="text-center text-slate-400 py-4 italic">No projects added yet. Add your academic or personal projects.</p>
          )}
          {profile.projects.map((project, idx) => (
            <div key={project.id} className="border-l-4 border-emerald-500 pl-4 space-y-4 pb-6 last:pb-0">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Project #{idx + 1}</h3>
              </div>
              <div>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => updateProject(project.id, { title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-medium mb-3"
                  placeholder="Project Title (e.g., E-commerce App, Data Analysis Pipeline)"
                />
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  rows={3}
                  placeholder="Describe your role, technologies used, and key accomplishments..."
                />
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
                <p className="text-sm font-semibold text-slate-600 mb-2">Upload Artifacts (Reports, Slides, Code Samples)</p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(project.id, e)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {project.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.files.map(file => (
                      <div key={file.name} className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 text-xs">
                        <span className="truncate max-w-[150px]">{file.name}</span>
                        <button 
                          onClick={() => removeFile(project.id, file.name)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all ${
            isFormValid 
            ? 'bg-blue-600 text-white hover:bg-blue-700 translate-y-0 active:translate-y-1' 
            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          Roles Evaluation <i className="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
