import { useState } from "react";

export default function LandingPage() {
  const goLogin = () => window.location.href = "/login";
  const goSignup = () => window.location.href = "/signup";

  return (
    <div className="bg-[#050505] text-white min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#67e8f9] to-[#ec4899] flex items-center justify-center text-black font-bold text-2xl">S</div>
            <span className="text-3xl font-bold tracking-tighter">SyncUp</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-[#67e8f9]">Features</a>
            <a href="#how" className="hover:text-[#67e8f9]">How it Works</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={goLogin} className="px-6 py-2 hover:text-[#67e8f9]">Log in</button>
            <button onClick={goSignup} className="px-8 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-[#67e8f9]">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6 text-center">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8">
            BUILD<br />
            <span className="bg-gradient-to-r from-[#67e8f9] via-[#c084fc] to-[#ec4899] bg-clip-text text-transparent">TOGETHER</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            The student collaboration platform to discover real projects, find teammates, and ship portfolio-worthy work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={goSignup} className="px-12 py-5 text-lg font-semibold rounded-2xl bg-gradient-to-r from-[#67e8f9] to-[#ec4899] text-black">Get Started Free</button>
            <button onClick={goLogin} className="px-12 py-5 text-lg font-semibold rounded-2xl border border-white/40 hover:border-white">Log in</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why builders love SyncUp</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { emoji: "🚀", title: "Discover Real Projects", desc: "Browse live startup and hackathon ideas." },
              { emoji: "🤝", title: "Smart Matching", desc: "AI-powered teammate suggestions." },
              { emoji: "💬", title: "Seamless Collaboration", desc: "Chat, tasks, and file sharing in one place." },
              { emoji: "🏆", title: "Build Portfolio", desc: "Every project becomes a verified achievement." },
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-3xl border border-white/10 hover:border-[#c084fc] bg-zinc-900">
                <div className="text-5xl mb-6">{item.emoji}</div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">How SyncUp Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              ["01", "Discover", "Explore real projects"],
              ["02", "Match", "Find perfect teammates"],
              ["03", "Build", "Collaborate in real-time"],
              ["04", "Ship", "Showcase your work"],
            ].map(([num, title, desc]) => (
              <div key={num} className="p-8 rounded-3xl border border-white/10 bg-zinc-900">
                <div className="text-5xl font-mono text-gray-600 mb-4">{num}</div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
