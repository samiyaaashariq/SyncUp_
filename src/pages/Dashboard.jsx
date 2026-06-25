import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("recent");

  // Dummy Data
  const projects = [
    {
      id: 1,
      name: "Northern Airlines Booking System",
      description: "Real-time flight booking platform with AI seat recommendations.",
      techStack: ["React", "Firebase", "Node.js", "Tailwind"],
      requiredRoles: ["Frontend Dev", "Backend Dev", "UI/UX"],
      teamSize: 4,
      creator: "Samiya Shariq",
      tags: ["Web Dev", "AI", "Startup"],
      status: "Active",
      applicants: 12,
      progress: 68
    }
  ];

  const teammates = [
    { id: 1, name: "Priya Sharma", skills: ["React", "UI/UX"], interests: ["AI", "Startups"], college: "IIT Delhi", match: 92 },
    { id: 2, name: "Arjun Patel", skills: ["Node.js", "Firebase"], interests: ["Web Dev", "Hackathons"], college: "NIT Trichy", match: 85 }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
      {/* Left Sidebar */}
      <div className="w-72 bg-[#111] border-r border-[#222] p-6 flex-shrink-0">
        <div className="text-3xl font-bold text-[#ff00aa] mb-10">SyncUp</div>
        <div className="space-y-1">
          <div onClick={() => navigate("/dashboard")} className="px-4 py-3 bg-[#ff00aa] text-black rounded-lg font-semibold cursor-pointer">Dashboard</div>
          <div onClick={() => navigate("/explore")} className="px-4 py-3 hover:bg-[#222] rounded-lg cursor-pointer">Explore Projects</div>
          <div onClick={() => navigate("/my-projects")} className="px-4 py-3 hover:bg-[#222] rounded-lg cursor-pointer">My Projects</div>
          <div onClick={() => navigate("/team-finder")} className="px-4 py-3 hover:bg-[#222] rounded-lg cursor-pointer">Team Finder</div>
          <div onClick={() => navigate("/ai-copilot")} className="px-4 py-3 hover:bg-[#222] rounded-lg cursor-pointer">AI Co-Founder</div>
          <div onClick={() => navigate("/chat")} className="px-4 py-3 hover:bg-[#222] rounded-lg cursor-pointer">Team Chat</div>
          <div onClick={() => navigate("/notifications")} className="px-4 py-3 hover:bg-[#222] rounded-lg cursor-pointer">Notifications</div>
          <div onClick={() => navigate("/profile")} className="px-4 py-3 hover:bg-[#222] rounded-lg cursor-pointer">Profile</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Welcome back, Samiya</h1>
            <p className="text-gray-400">Let’s build something amazing today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/ai-copilot")} className="px-6 py-3 bg-[#ff00aa] text-black rounded-full font-semibold">+ Create Project with AI</button>
            <div className="w-10 h-10 bg-[#ff00aa] rounded-full cursor-pointer"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">Total Projects<br /><span className="text-4xl font-bold">47</span></div>
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">Active Teams<br /><span className="text-4xl font-bold">12</span></div>
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">Pending Requests<br /><span className="text-4xl font-bold">8</span></div>
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">Connections<br /><span className="text-4xl font-bold">134</span></div>
        </div>

        {/* Projects Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Projects</h2>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="bg-[#111] border border-[#333] px-4 py-2 rounded-lg">
              <option value="recent">Sort: Recent</option>
              <option value="popular">Sort: Popular</option>
              <option value="matching">Sort: Best Match</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-[#111] p-6 rounded-2xl border border-[#333] hover:border-[#ff00aa] transition-all">
                <h3 className="font-semibold text-xl mb-2">{project.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, i) => <span key={i} className="text-xs bg-[#222] px-3 py-1 rounded-full">{tech}</span>)}
                </div>
                <div className="text-sm text-gray-400 mb-4">Required: {project.requiredRoles.join(", ")}</div>
                <div className="flex justify-between text-sm mb-4">
                  <div>Team: {project.teamSize}</div>
                  <div>Applicants: {project.applicants}</div>
                </div>
                <button onClick={() => navigate(`/project/${project.id}`)} className="w-full py-2 bg-[#ff00aa] text-black rounded-lg font-semibold">View Project</button>
              </div>
            ))}
          </div>
        </div>

        {/* Team Finder */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Team Finder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teammates.map(person => (
              <div key={person.id} className="bg-[#111] p-6 rounded-2xl border border-[#333]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#ff00aa] rounded-full"></div>
                  <div>
                    <div className="font-semibold">{person.name}</div>
                    <div className="text-sm text-gray-400">{person.college}</div>
                  </div>
                  <div className="ml-auto text-[#4ade80] font-bold">{person.match}% Match</div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {person.skills.map((s, i) => <span key={i} className="text-xs bg-[#222] px-3 py-1 rounded-full">{s}</span>)}
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-[#ff00aa] text-black rounded-lg font-semibold">Connect</button>
                  <button onClick={() => navigate("/chat")} className="flex-1 py-2 border border-[#ff00aa] text-[#ff00aa] rounded-lg">Message</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
