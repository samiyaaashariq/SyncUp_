export const generateProjectIdea = (skills = "") => {
  const ideas = [
    "AI-powered study planner for students",
    "Developer collaboration platform like GitHub + Discord",
    "Smart resume builder with real-time feedback",
    "College event management system",
    "Freelance project matching platform",
  ];

  return ideas[Math.floor(Math.random() * ideas.length)];
};

export const suggestRole = (skills = "") => {
  const s = skills.toLowerCase();

  if (s.includes("react")) return "Frontend Developer";
  if (s.includes("node")) return "Backend Developer";
  if (s.includes("ui")) return "UI/UX Designer";
  if (s.includes("ai")) return "AI/ML Engineer";

  return "Full Stack Developer";
};
