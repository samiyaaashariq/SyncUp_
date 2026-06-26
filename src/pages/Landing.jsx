import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ImmersiveLanding() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-pink-500 to-lime-400 flex items-center justify-center">
              <span className="text-black font-bold text-xl">S</span>
            </div>
            <span className="text-3xl font-bold tracking-tighter">SyncUp</span>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#how" className="hover:text-cyan-400 transition">How it Works</a>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/login')} className="px-6 py-2 hover:text-cyan-400">Log in</button>
            <button onClick={() => navigate('/signup')} 
                    className="px-8 py-2 bg-white text-black rounded-full font-semibold hover:bg-cyan-400 transition">
              Start Building
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Immersive */}
      <section className="min-h-screen relative flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_20%,rgba(103,232,249,0.15),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(at_70%_70%,rgba(236,72,153,0.12),transparent)]" style={{ transform: `translateY(${scrollY * 0.1}px)` }}></div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="inline-block mb-6 px-6 py-2 rounded-full border border-white/20 text-sm tracking-widest">
            ✨ Now Live for Builders
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
            BUILD<br />
            <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-lime-400 bg-clip-text text-transparent">TOGETHER</span>
          </h1>

          <p className="text-2xl md:text-3xl text-white/80 max-w-2xl mx-auto mb-10">
            The premium collaboration platform where students and builders discover real projects, match with perfect teammates, and ship portfolio-worthy products.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button 
              onClick={() => navigate('/signup')}
              className="px-12 py-6 text-xl font-semibold rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-500 text-black hover:scale-105 transition-all active:scale-95">
              Start Building Now
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-12 py-6 text-xl font-semibold rounded-2xl border border-white/30 hover:border-white/70 transition-all">
              I already have an account
            </button>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-10 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-lime-400 rounded-full animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">Why builders love SyncUp</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              ["🚀", "Discover Real Projects", "Browse live startup and hackathon ideas."],
              ["🤝", "Smart Matching", "AI-powered teammate suggestions."],
              ["💬", "Seamless Collaboration", "Chat, tasks, and file sharing in one place."],
              ["📈", "Build Portfolio", "Every project becomes a verified achievement."]
            ].map(([emoji, title, desc], i) => (
              <div key={i} className="bg-zinc-900 border border-white/10 p-8 rounded-3xl hover:border-cyan-400 transition-all group hover:-translate-y-2">
                <div className="text-5xl mb-6 group-hover:scale-110 transition">{emoji}</div>
                <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                <p className="text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-24 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">How SyncUp Works</h2>
          <p className="text-xl text-white/70 mb-16">From idea to shipped product in four steps</p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              ["01", "Discover", "Browse exciting projects"],
              ["02", "Match", "Get AI teammate suggestions"],
              ["03", "Collaborate", "Work in real-time"],
              ["04", "Ship", "Build your portfolio"]
            ].map(([num, title, desc]) => (
              <div key={num} className="text-left bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-white/30 transition">
                <div className="text-7xl font-mono text-white/10 mb-4">{num}</div>
                <h3 className="text-2xl font-semibold mb-2">{title}</h3>
                <p className="text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent">
        <h2 className="text-6xl font-bold tracking-tighter mb-6">Ready to build something great?</h2>
        <p className="text-2xl text-white/70 mb-10">Join 1000+ builders today</p>
        <button 
          onClick={() => navigate('/signup')}
          className="px-16 py-7 text-xl font-semibold rounded-3xl bg-white text-black hover:bg-gradient-to-r hover:from-cyan-400 hover:to-pink-500 hover:text-white transition-all">
          Join 1000+ builders today →
        </button>
      </section>
    </div>
  );
}
