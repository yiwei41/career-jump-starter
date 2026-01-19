
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, RoleEvaluation, SkillMatch } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const evaluateRoles = async (profile: UserProfile, interestRole: string): Promise<RoleEvaluation[]> => {
  const ai = getAI();
  const prompt = `
    You are an expert AI Tech Recruiter. Analyze this graduate profile and suggest suitable career roles.
    
    NAME: ${profile.name}
    EDUCATION: ${profile.education}
    PROJECTS: ${profile.projects.map(p => `
      - Title: ${p.title}
      - Description: ${p.description}
      - Files shared: ${p.files.map(f => f.name).join(', ')}
    `).join('\n')}
    
    USER INTERESTED IN: ${interestRole || 'Any suitable role'}

    Provide 5 roles that match this profile.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            roleType: { type: Type.STRING },
            relevance: { type: Type.NUMBER, description: "Match percentage 0-100" },
            why: { type: Type.STRING }
          },
          required: ["roleType", "relevance", "why"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const matchSkills = async (profile: UserProfile, role: string): Promise<SkillMatch[]> => {
  const ai = getAI();
  const prompt = `
    Compare the graduate profile against the requirements of a '${role}' role.
    Identify key technical and soft skills.
    
    PROFILE:
    Education: ${profile.education}
    Experience: ${profile.projects.map(p => p.title + ': ' + p.description).join('; ')}
    
    Provide an analysis of skills needed for '${role}'.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            skill: { type: Type.STRING },
            importance: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            status: { type: Type.STRING, enum: ['Proficient', 'Learning', 'Gap'] },
            why: { type: Type.STRING }
          },
          required: ["skill", "importance", "status", "why"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const generateResume = async (profile: UserProfile, role: string): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Act as a professional resume writer. Generate a high-quality, professional Markdown resume for a new graduate.
    
    TARGET ROLE: ${role}
    GRADUATE NAME: ${profile.name}
    CONTACT: ${profile.email}
    EDUCATION: ${profile.education}
    EXPERIENCE:
    ${profile.projects.map(p => `
      ### ${p.title}
      ${p.description}
      (Involved files: ${p.files.map(f => f.name).join(', ')})
    `).join('\n\n')}

    Format the resume with professional sections: Summary, Skills, Experience, Education.
    Tailor the content to highlight relevance to the '${role}' role.
    Use Markdown.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt
  });

  return response.text || "Failed to generate resume.";
};
