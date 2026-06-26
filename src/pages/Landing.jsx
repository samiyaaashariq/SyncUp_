import { useState } from "react";

export default function LandingPage() {
  const goLogin = () => (window.location.href = "/login");
  const goSignup = () => (window.location.href = "/signup");

  return (
    <div className="bg-[#050505] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#67e8f9] via-[#c084fc] to-[#ec4899] flex items-center justify-center text-black font-bold text-xl shadow-lg">S</div>
            <span className="text-3xl font-bold tracking-tighter">SyncUp</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-[#67e8f9] transition">Features</a>
            <a href="#projects" className="hover:text-[#67e8f9] transition">Projects</a>
            <a href="#how" className="hover:text-[#67e8f9] transition">How it Works</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={goLogin} className="px-6 py-2.5 hover:text-[#a78bfa] transition">Log in</button>
            <button 
              onClick={goSignup} 
              className="px-8 py-2.5 bg-gradient-to-r from-[#67e8f9] to-[#ec4899] text-black font-semibold rounded-full hover:scale-105 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen pt-20 flex items-center justify-center relative" 
               style={{ background: "radial-gradient(circle at 50% 30%, rgba(103,232,249,0.15) 0%, rgba(192,132,252,0.1) 50%, transparent 80%)" }}>
        <div className="max-w-5xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 mb-8 text-sm">
            <span className="text-lime-400">●</span> NOW OPEN FOR BUILDERS & STUDENTS
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none mb-8">
            BUILD<br />
            <span className="bg-gradient-to-r from-[#67e8f9] via-[#c084fc] to-[#ec4899] bg-clip-text text-transparent">BETTER TOGETHER</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12">
            Discover real projects. Find perfect teammates. Ship portfolio-worthy products with the best student & builder community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={goSignup}
              className="px-12 py-6 text-lg font-semibold rounded-3xl bg-gradient-to-r from-[#67e8f9] to-[#ec4899] text-black hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Get Started Free
            </button>
            <button 
              onClick={goLogin}
              className="px-12 py-6 text-lg font-semibold rounded-3xl border border-white/30 hover:border-white/60 transition-all"
            >
              I already have an account
            </button>
          </div>
        </div>
      </section>

      {/* Live Projects / Featured */}
      <section id="projects" className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Live Projects Looking for Teammates</h2>
          <p className="text-center text-white/60 mb-12">Real ideas. Real builders. Join now.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "EcoTrack - Smart Waste Management", tags: ["React", "AI", "IoT"], spots: "2 Developers" },
              { title: "CampusConnect - College Event Platform", tags: ["Flutter", "Firebase"], spots: "1 Designer + 1 Dev" },
              { title: "SkillSwap - Mentorship Marketplace", tags: ["Next.js", "Stripe"], spots: "Full Stack Dev" },
            ].map((project, i) => (
              <div key={i} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 hover:border-[#c084fc] transition group">
                <div className="h-2 w-12 bg-gradient-to-r from-[#67e8f9] to-[#ec4899] rounded mb-6" />
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-[#c084fc] transition">{project.title}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 bg-white/10 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="text-white/60 mb-6">{project.spots} needed</p>
                <button 
                  onClick={goSignup}
                  className="w-full py-3 rounded-2xl border border-white/30 hover:bg-white/5 transition"
                >
                  Join Project →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Everything you need to build together</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { emoji: "🔍", title: "Discover Real Projects", desc: "Browse verified startup ideas, hackathons, and open challenges." },
              { emoji: "🧠", title: "Smart AI Matching", desc: "Get recommended teammates based on skills, availability & goals." },
              { emoji: "💬", title: "Real-time Collaboration", desc: "Chat, shared tasks, file sharing & project boards in one place." },
              { emoji: "🏅", title: "Portfolio Builder", desc: "Every completed project becomes a verified showcase." },
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-3xl border border-white/10 hover:border-[#c084fc] bg-zinc-950 transition">
                <div className="text-5xl mb-6">{f.emoji}</div>
                <h3 className="text-2xl font-semibold mb-4">{f.title}</h3>
                <p className="text-white/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">How SyncUp Works</h2>
          <p className="text-white/70 mb-16">From idea to shipped product in weeks</p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              ["01", "Discover", "Browse exciting projects"],
              ["02", "Match", "Get paired with teammates"],
              ["03", "Build", "Collaborate in real-time"],
              ["04", "Ship", "Showcase & grow your portfolio"],
            ].map(([num, title, desc]) => (
              <div key={num} className="text-left">
                <div className="text-5xl font-mono text-white/20 mb-4">{num}</div>
                <h3 className="font-semibold text-xl mb-2">{title}</h3>
                <p className="text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center border-t border-white/10">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-6">Ready to start your next big project?</h2>
          <p className="text-xl text-white/70 mb-10">Join thousands of students and builders already shipping on SyncUp.</p>
          <button 
            onClick={goSignup}
            className="px-16 py-7 text-2xl font-semibold rounded-3xl bg-gradient-to-r from-[#67e8f9] via-[#c084fc] to-[#ec4899] text-black hover:scale-105 transition-all"
          >
            Get Started Now →
          </button>
        </div>
      </section>
    </div>
  );
}
