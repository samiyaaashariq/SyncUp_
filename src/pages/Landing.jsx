import { useState } from "react";

export default function LandingPage() {
  const goLogin = () => (window.location.href = "/login");
  const goSignup = () => (window.location.href = "/signup");

  return (
    <div className="bg-[#050505] text-white min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#67e8f9] to-[#ec4899] flex items-center justify-center text-black font-bold">S</div>
            <span className="text-2xl font-bold tracking-tight">SyncUp</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-[#67e8f9] transition">Features</a>
            <a href="#how" className="hover:text-[#67e8f9] transition">How it Works</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={goLogin} className="px-6 py-2 hover:text-[#67e8f9] transition">Log in</button>
            <button 
              onClick={goSignup} 
              className="px-8 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-[#67e8f9] transition"
            >
              Start Building
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Build<br />
            <span className="bg-gradient-to-r from-[#67e8f9] to-[#ec4899] bg-clip-text text-transparent">Together</span>
          </h1>
          <p className="text-xl text-white/80 mb-10">
            The platform where students and builders discover real projects, 
            find teammates, and ship portfolio-worthy work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={goSignup}
              className="px-10 py-4 text-lg font-semibold rounded-2xl bg-white text-black hover:bg-[#67e8f9] transition"
            >
              Start Building Now
            </button>
            <button 
              onClick={goLogin}
              className="px-10 py-4 text-lg font-semibold rounded-2xl border border-white/30 hover:bg-white/10 transition"
            >
              Log in
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-black/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why builders love SyncUp</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { emoji: "🚀", title: "Discover Real Projects", desc: "Browse live startup and hackathon ideas." },
              { emoji: "🤝", title: "Smart Matching", desc: "AI-powered teammate suggestions." },
              { emoji: "💬", title: "Seamless Collaboration", desc: "Chat, tasks, and file sharing." },
              { emoji: "🏆", title: "Build Portfolio", desc: "Verified achievements for your profile." },
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-3xl border border-white/10 bg-zinc-950">
                <div className="text-5xl mb-6">{item.emoji}</div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">How SyncUp Works</h2>
          <p className="text-white/70 mb-12">Four simple steps</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              ["01", "Discover", "Explore projects"],
              ["02", "Match", "Find teammates"],
              ["03", "Build", "Collaborate"],
              ["04", "Ship", "Showcase work"],
            ].map(([num, title, desc]) => (
              <div key={num} className="p-6 rounded-3xl border border-white/10 bg-zinc-900">
                <div className="text-4xl font-mono text-white/30 mb-4">{num}</div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center border-t border-white/10">
        <h2 className="text-4xl font-bold mb-4">Ready to build something great?</h2>
        <button 
          onClick={goSignup}
          className="px-12 py-5 text-xl font-semibold rounded-2xl bg-white text-black hover:bg-[#67e8f9] transition mt-6"
        >
          Join SyncUp Now
        </button>
      </section>
    </div>
  );
}
