import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ImmersiveLanding() {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#050505] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#67e8f9] to-[#ec4899] flex items-center justify-center text-black font-bold">S</div>
            <span className="text-3xl font-bold tracking-tighter">SyncUp</span>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-[#67e8f9] transition">Features</a>
            <a href="#how" className="hover:text-[#67e8f9] transition">How it Works</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="px-6 py-2.5 hover:text-[#67e8f9]">Log in</button>
            <button onClick={() => navigate('/signup')} className="px-8 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-[#67e8f9] transition">Start Building</button>
          </div>
        </div>
      </nav>

      {/* Hero - More Immersive */}
      <section className="min-h-screen relative flex items-center justify-center pt-16" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(103,232,249,0.18) 0%, transparent 70%)' }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 70% ${70 + scrollPosition * 0.05}%, rgba(236,72,153,0.15), transparent)` }}></div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 text-sm">
            <span className="text-lime-400">●</span> NOW LIVE FOR BUILDERS
          </div>

          <h1 className="text-7xl md:text-[5.8rem] leading-none font-bold tracking-[-3px] mb-8">
            BUILD<br />
            <span className="bg-gradient-to-r from-[#67e8f9] via-[#ec4899] to-[#a3e635] bg-clip-text text-transparent">TOGETHER</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12">
            The premium collaboration platform where students and builders discover real projects, match with perfect teammates, and ship portfolio-worthy products.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/signup')} className="px-12 py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-[#67e8f9] to-[#ec4899] text-black hover:scale-105 active:scale-95 transition-all">
              Start Building Now
            </button>
            <button onClick={() => navigate('/login')} className="px-12 py-6 text-lg font-semibold rounded-2xl border border-white/30 hover:border-white transition-all">
              I already have an account
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">Why builders love SyncUp</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { emoji: "🚀", title: "Discover Real Projects", desc: "Browse live startup and hackathon ideas." },
              { emoji: "🤝", title: "Smart Matching", desc: "AI-powered teammate suggestions." },
              { emoji: "💬", title: "Seamless Collaboration", desc: "Chat, tasks, and file sharing in one place." },
              { emoji: "🏆", title: "Build Portfolio", desc: "Every project becomes a verified achievement." }
            ].map((item, index) => (
              <div key={index} className="p-10 rounded-3xl border border-white/10 hover:border-[#67e8f9] transition-all group bg-zinc-950 hover:-translate-y-3">
                <div className="text-6xl mb-6 transition-transform group-hover:scale-110">{item.emoji}</div>
                <h3 className="text-3xl font-semibold mb-4">{item.title}</h3>
                <p className="text-white/70 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">How SyncUp Works</h2>
          <p className="text-xl text-white/70 mb-16">Four simple steps to launch together</p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              ["01", "Discover", "Explore real projects"],
              ["02", "Match", "Find perfect teammates"],
              ["03", "Build", "Collaborate in real-time"],
              ["04", "Ship", "Showcase your work"]
            ].map(([num, title, desc]) => (
              <div key={num} className="bg-zinc-900 p-8 rounded-3xl border border-white/10 hover:border-white/40 transition">
                <div className="text-6xl font-mono text-white/10 mb-6">{num}</div>
                <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                <p className="text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center border-t border-white/10">
        <h2 className="text-6xl font-bold mb-6 tracking-tight">Ready to start your next big project?</h2>
        <p className="text-2xl text-white/70 mb-12">Join thousands of builders already shipping.</p>
        <button 
          onClick={() => navigate('/signup')}
          className="px-16 py-7 text-2xl font-semibold rounded-3xl bg-white text-black hover:bg-gradient-to-r hover:from-cyan-400 hover:to-pink-500 hover:text-white transition-all duration-300">
          Join SyncUp Now →
        </button>
      </section>
    </div>
  );
}
