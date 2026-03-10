import OpenAI from 'openai';

const client = new OpenAI({  // ✅ Changed 'openai' → 'client'
  apiKey: process.env.GROQ_API_KEY,        
  baseURL: 'https://api.groq.com/openai/v1' 
});

async function recommendAssignees(task, users) {
  try {
    const usersText = users.map((u, idx) => `${idx}: ${u.name} - skills: ${(u.skills || []).join(', ')} - availability:${u.availabilityScore || 1}`).join('\n');
    const prompt = `You are an assistant that suggests the best assignees for a task.\nTask title: ${task.title}\nRequired skills: ${(task.requiredSkills || []).join(', ')}\nUsers:\n${usersText}\n\nReturn a JSON array of up to 3 suggestions. Each suggestion: { "userIdIndex": <index>, "score": <0-1>, "reason": "<short reason>" }`;

    const resp = await client.chat.completions.create({  // ✅ Uses 'client'
      model: 'llama-3.1-8b-instant',  // ✅ Groq model (not gpt-4o-mini)
      messages: [{ role: 'user', content: prompt }],
      temperature: 0
    });

    const out = resp.choices[0].message.content || '';
    const match = out.match(/\[.*\]/s);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (err) {
        console.warn('[ai] parse error', err.message);
        return [];
      }
    } else {
      return [];
    }
  } catch (err) {
    console.warn('[ai] request failed', err.message);
    return [];
  }
}

async function extractSkillsFromResume(text) {
  if (!process.env.OPENAI_API_KEY) {
    console.error('[ai] Missing OPENAI_API_KEY in .env. Skills extraction will fail.');
    return [];
  }
  try {
    const prompt = `Extract a list of technical skills from the following resume text. Return as a JSON array of strings: ["skill1", "skill2"].\n\nResume text:\n${text}`;
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0
    });

    const out = resp.choices[0].message.content || '';
    const match = out.match(/\[.*\]/s);
    if (match) {
      const skills = JSON.parse(match[0]);
      console.log(`[ai] Successfully extracted ${skills.length} skills:`, skills);
      return skills;
    }
    return [];
  } catch (err) {
    console.error('[ai] extractSkills failed:', err.message);
    return [];
  }
}


async function recommendProjects(user, projects) {
  try {
    const projectsText = projects.map((p, idx) => `${idx}: ${p.name} - required skills: ${(p.requiredSkills || []).join(', ')} - description: ${p.description}`).join('\n');
    const prompt = `You are an assistant matching a developer to suitable projects.\nDeveloper: ${user.name}\nDeveloper Skills: ${(user.skills || []).join(', ')}\n\nProjects:\n${projectsText}\n\nReturn a JSON array of top 3 project matches. Each match: { "projectIdIndex": <index>, "score": <0-1>, "reason": "<short reason why this is a good match>" }`;

    const resp = await client.chat.completions.create({  // ✅ Uses 'client'
      model:'llama-3.1-8b-instant', // ✅ Groq model
      messages: [{ role: 'user', content: prompt }],
      temperature: 0
    });

    const out = resp.choices[0].message.content || '';
    const match = out.match(/\[.*\]/s);
    if (match) {
      return JSON.parse(match[0]);
    }
    return [];
  } catch (err) {
    console.warn('[ai] recommendProjects failed', err.message);
    return [];
  }
}

export { recommendAssignees, extractSkillsFromResume, recommendProjects };
