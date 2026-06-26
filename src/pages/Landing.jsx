// === INSTALL FIRST ===
// npm install framer-motion lucide-react

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Rocket, Users, MessageSquare, Award, 
  ArrowRight, Sparkles, Zap, Target 
} from 'lucide-react';

export default function ImmersiveLanding() {
  const navigate = useNavigate();
  const [statsAnimated, setStatsAnimated] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroBgY = useTransform(scrollYProgress, [0, 0.5], [0, -120]);

  const handleStart = () => navigate('/signup');   // Change if your route is different
  const handleLogin = () => navigate('/login');    // Change if your route is different

  const AnimatedCounter = ({ end, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !statsAnimated) {
          let start = 0;
          const duration = 1600;
          const step = Math.ceil(end / (duration / 16));

          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      }, { threshold: 0.6 });

      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, [end]);

    return <span ref={ref}>{count}{suffix}</span>;
  };

  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#67e8f9] via-[#ec4899] to-[#a3e635] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">SyncUp</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-[#67e8f9]">Features</a>
            <a href="#how" className="hover:text-[#67e8f9]">How it Works</a>
            <a href="#stats" className="hover:text-[#67e8f9]">Impact</a>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleLogin} className="px-6 py-2.5 hover:text-[#67e8f9] transition-colors">
              Log in
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="px-6 py-2.5 bg-white text-black rounded-full font-semibold flex items-center gap-2 hover:bg-[#67e8f9]"
            >
              Start Building Now <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen pt-20 relative flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroBgY }} className="absolute inset-0 bg-[radial-gradient(at_50%_30%,rgba(103,232,249,0.15)_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-8xl font-bold tracking-tighter leading-none mb-6"
          >
            BUILD<br />
            <span className="bg-gradient-to-r from-[#67e8f9] via-[#ec4899] to-[#a3e635] bg-clip-text text-transparent">TOGETHER</span>
          </motion.h1>

          <p className="text-2xl md:text-3xl text-white/70 max-w-2xl mx-auto">
            The premium collaboration platform where students and builders discover real projects, match with perfect teammates, and ship portfolio-worthy products.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleStart}
              className="px-10 py-5 bg-gradient-to-r from-[#67e8f9] to-[#ec4899] text-black font-semibold text-lg rounded-2xl flex items-center gap-3"
            >
              Start Building Now <ArrowRight />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogin}
              className="px-10 py-5 border border-white/30 hover:border-white/60 rounded-2xl text-lg"
            >
              I already have an account
            </motion.button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold tracking-tighter">Why builders love SyncUp</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Rocket, title: "Discover Real Projects", desc: "Browse live startup and hackathon ideas.", color: "#67e8f9" },
              { icon: Users, title: "Smart Matching", desc: "AI-powered teammate suggestions.", color: "#ec4899" },
              { icon: MessageSquare, title: "Seamless Collaboration", desc: "Chat, tasks, and file sharing in one place.", color: "#a3e635" },
              { icon: Award, title: "Build Portfolio", desc: "Every project becomes a verified achievement.", color: "#67e8f9" }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -12 }}
                className="bg-zinc-950 border border-white/10 rounded-3xl p-8 hover:border-[#67e8f9]/50 group"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{background: `rgba(${f.color === '#67e8f9' ? '103,232,249' : f.color === '#ec4899' ? '236,72,153' : '163,230,53'}, 0.15)`}}>
                  <f.icon className="w-9 h-9" style={{color: f.color}} />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{f.title}</h3>
                <p className="text-white/70">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 bg-black/60">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-6xl font-bold tracking-tighter mb-4">How SyncUp Works</h2>
          <p className="text-xl text-white/70 mb-12">Four steps from idea to launched product</p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", icon: Target, title: "Discover", desc: "Browse exciting projects" },
              { num: "02", icon: Users, title: "Match", desc: "AI teammate suggestions" },
              { num: "03", icon: MessageSquare, title: "Collaborate", desc: "Real-time tools" },
              { num: "04", icon: Award, title: "Ship", desc: "Build your portfolio" }
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-zinc-950 border border-white/10 p-8 rounded-3xl">
                <div className="text-6xl font-mono text-white/10 mb-6">{step.num}</div>
                <step.icon className="w-12 h-12 mx-auto mb-6 text-[#67e8f9]" />
                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-white/60">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="py-20 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { n: 1240, s: "+" },
            { n: 8750, s: "" },
            { n: 420, s: "" },
            { n: 98, s: "%" }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-6xl font-bold tracking-tighter"><AnimatedCounter end={stat.n} suffix={stat.s} /></div>
              <div className="text-white/60 mt-2">Projects • Matches • Ships • Success</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="cta" className="py-32 text-center">
        <h2 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">Ready to start building?</h2>
        <p className="text-2xl text-white/70 mb-10">Join 1000+ builders today</p>
        
        <motion.button
          whileHover={{ scale: 1.08 }}
          onClick={handleStart}
          className="px-16 py-7 text-xl font-semibold bg-white text-black rounded-3xl flex items-center gap-4 mx-auto hover:bg-gradient-to-r hover:from-[#67e8f9] hover:to-[#ec4899] hover:text-white"
        >
          Join 1000+ builders today →
        </motion.button>
      </section>
    </div>
  );
}
