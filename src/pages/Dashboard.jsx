import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardV2() {
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [projects] = useState([
    {
      id: 1,
      name: "Northern Airlines Booking System",
      description:
        "Real-time flight booking platform with AI recommendations.",
      tech: ["React", "Firebase", "AI"],
      teamSize: 5,
      applicants: 12,
      status: "Active",
      creator: "Samiya",
      tags: ["AI", "Startup", "Web"],
    },
    {
      id: 2,
      name: "CampusVerse",
      description:
        "Student networking and collaboration ecosystem.",
      tech: ["React", "Node", "MongoDB"],
      teamSize: 7,
      applicants: 21,
      status: "Recruiting",
      creator: "Ayesha",
      tags: ["Community", "Social", "Startup"],
    },
  ]);

  const recommendedProjects = [
    "AI Resume Analyzer",
    "Hackathon Finder",
    "AR/VR Learning Hub",
    "Startup Co-Founder Matcher",
  ];

  const teammates = [
    {
      name: "Sarah Khan",
      role: "UI/UX Designer",
      skills: "Figma • React • Branding",
      match: "89%",
    },
    {
      name: "Ali Ahmed",
      role: "Frontend Developer",
      skills: "React • Firebase • Tailwind",
      match: "94%",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* SIDEBAR */}

      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 hidden md:block">
        <h1 className="text-3xl font-bold text-indigo-400 mb-10">
          SyncUp
        </h1>

        <div className="space-y-3">

          <button
            className="w-full text-left p-3 rounded-lg hover:bg-slate-800"
          >
            Dashboard
          </button>

          <button
            className="w-full text-left p-3 rounded-lg hover:bg-slate-800"
          >
            Explore Projects
          </button>

          <button
            className="w-full text-left p-3 rounded-lg hover:bg-slate-800"
          >
            Team Finder
          </button>

          <button
            onClick={() => navigate("/chat")}
            className="w-full text-left p-3 rounded-lg hover:bg-slate-800"
          >
            Messages
          </button>

          <button
            onClick={() => navigate("/notifications")}
            className="w-full text-left p-3 rounded-lg hover:bg-slate-800"
          >
            Notifications
          </button>

          <button
            onClick={() => navigate("/ai-copilot")}
            className="w-full text-left p-3 rounded-lg hover:bg-slate-800"
          >
            AI Copilot
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="w-full text-left p-3 rounded-lg hover:bg-slate-800"
          >
            Profile
          </button>

        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-8">

        {/* NAVBAR */}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              Welcome back, Samiya 👋
            </h1>

            <p className="text-slate-400 mt-2">
              Build startups. Find teammates. Ship products.
            </p>
          </div>

          <div className="flex gap-3">

            <input
              placeholder="Search projects..."
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
            />

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl font-semibold"
            >
              + Create Project
            </button>

          </div>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">

          <div className="bg-slate-900 p-6 rounded-2xl">
            <h3 className="text-slate-400">Projects</h3>
            <p className="text-3xl font-bold mt-2">8</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <h3 className="text-slate-400">Applications</h3>
            <p className="text-3xl font-bold mt-2">24</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <h3 className="text-slate-400">Teams</h3>
            <p className="text-3xl font-bold mt-2">6</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <h3 className="text-slate-400">Communities</h3>
            <p className="text-3xl font-bold mt-2">14</p>
          </div>

        </div>
        {/* RECOMMENDED PROJECTS */}

        <div className="mb-12">

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">
              🔥 Recommended For You
            </h2>

            <button className="text-indigo-400 hover:text-indigo-300">
              View All
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">

            {recommendedProjects.map((project, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500 transition"
              >
                <h3 className="font-semibold text-lg">
                  {project}
                </h3>

                <p className="text-slate-400 mt-2 text-sm">
                  Recommended based on your interests and activity.
                </p>

                <button className="mt-4 text-indigo-400">
                  Explore →
                </button>
              </div>
            ))}

          </div>

        </div>

        {/* PROJECTS SECTION */}

        <div className="mb-12">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              🚀 Startup Projects
            </h2>

            <button className="text-indigo-400 hover:text-indigo-300">
              Browse More
            </button>

          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {projects.map((project) => (

              <div
                key={project.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500 transition"
              >

                {/* Header */}

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h3 className="text-xl font-bold">
                      {project.name}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      Created by {project.creator}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      project.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {project.status}
                  </span>

                </div>

                {/* Description */}

                <p className="text-slate-300 mb-5">
                  {project.description}
                </p>

                {/* Tech Stack */}

                <div className="mb-4">

                  <h4 className="text-sm text-slate-500 mb-2">
                    Tech Stack
                  </h4>

                  <div className="flex flex-wrap gap-2">

                    {project.tech.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-slate-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}

                  </div>

                </div>

                {/* Interest Tags */}

                <div className="mb-5">

                  <h4 className="text-sm text-slate-500 mb-2">
                    Categories
                  </h4>

                  <div className="flex flex-wrap gap-2">

                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}

                  </div>

                </div>

                {/* Project Metrics */}

                <div className="grid grid-cols-3 gap-4 mb-6">

                  <div className="bg-slate-800 rounded-xl p-3 text-center">

                    <p className="text-slate-400 text-xs">
                      Team Size
                    </p>

                    <p className="font-bold text-lg">
                      👥 {project.teamSize}
                    </p>

                  </div>

                  <div className="bg-slate-800 rounded-xl p-3 text-center">

                    <p className="text-slate-400 text-xs">
                      Applicants
                    </p>

                    <p className="font-bold text-lg">
                      📩 {project.applicants}
                    </p>

                  </div>

                  <div className="bg-slate-800 rounded-xl p-3 text-center">

                    <p className="text-slate-400 text-xs">
                      Progress
                    </p>

                    <p className="font-bold text-lg">
                      🚀 75%
                    </p>

                  </div>

                </div>

                {/* Buttons */}

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl font-medium"
                  >
                    View Project
                  </button>

                  <button
                    onClick={() => navigate(`/manage/${project.id}`)}
                    className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
                  >
                    Manage
                  </button>

                  <button
                    onClick={() => navigate(`/members/${project.id}`)}
                    className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
                  >
                    Members
                  </button>

                  <button
                    className="border border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white px-4 py-2 rounded-xl"
                  >
                    Apply
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>
        {/* TEAM FINDER */}

        <div className="mb-12">

          <h2 className="text-2xl font-bold mb-6">
            🤝 Team Finder
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {teammates.map((person, index) => (

              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="text-xl font-semibold">
                      {person.name}
                    </h3>

                    <p className="text-indigo-400">
                      {person.role}
                    </p>

                  </div>

                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    {person.match} Match
                  </div>

                </div>

                <p className="text-slate-400 mt-4">
                  {person.skills}
                </p>

                <div className="flex gap-3 mt-5">

                  <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl">
                    Connect
                  </button>

                  <button
                    onClick={() => navigate("/chat")}
                    className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
                  >
                    Message
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* COMMUNITIES + ACTIVITY */}

        <div className="grid lg:grid-cols-2 gap-8 mb-12">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-5">
              🌍 Communities
            </h2>

            <div className="flex flex-wrap gap-3">

              {[
                "AI",
                "Web Dev",
                "Cybersecurity",
                "Startups",
                "AR/VR",
                "Machine Learning",
                "Design",
                "Robotics",
              ].map((community, index) => (

                <button
                  key={index}
                  className="bg-slate-800 hover:bg-indigo-600 px-4 py-2 rounded-full"
                >
                  {community}
                </button>

              ))}

            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-5">
              📈 Activity Feed
            </h2>

            <div className="space-y-4">

              <div className="bg-slate-800 p-4 rounded-xl">
                Sarah joined CampusVerse.
              </div>

              <div className="bg-slate-800 p-4 rounded-xl">
                New applicant for Northern Airlines Booking System.
              </div>

              <div className="bg-slate-800 p-4 rounded-xl">
                Hackathon registration opens tomorrow.
              </div>

            </div>

          </div>

        </div>

        {/* QUICK ACCESS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div
            onClick={() => navigate("/ai-copilot")}
            className="cursor-pointer bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500"
          >
            <h3 className="text-xl font-bold text-indigo-400">
              🚀 AI Co-Founder
            </h3>

            <p className="text-slate-400 mt-2">
              Generate startup ideas, roadmaps, and team plans.
            </p>
          </div>

          <div
            onClick={() => navigate("/notifications")}
            className="cursor-pointer bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500"
          >
            <h3 className="text-xl font-bold text-yellow-400">
              🔔 Notifications
            </h3>

            <p className="text-slate-400 mt-2">
              View project invitations and updates.
            </p>
          </div>

          <div
            onClick={() => navigate("/chat")}
            className="cursor-pointer bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500"
          >
            <h3 className="text-xl font-bold text-cyan-400">
              💬 Team Chat
            </h3>

            <p className="text-slate-400 mt-2">
              Collaborate with teammates in real-time.
            </p>
          </div>

        </div>

      </div>

      {/* CREATE PROJECT MODAL */}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-md">

            <h2 className="text-2xl font-bold mb-5">
              Create New Project
            </h2>

            <input
              type="text"
              placeholder="Project Name"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mb-4"
            />

            <textarea
              placeholder="Project Description"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mb-4 h-28"
            />

            <div className="flex gap-3">

              <button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold"
              >
                Create
              </button>

              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
