
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Rocket, Users, MessageSquare, Award, 
  ArrowRight, Sparkles, Zap, Target 
} from 'lucide-react';

export default function ImmersiveLanding() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);

  // Scroll-based transforms for parallax
  const { scrollYProgress } = useScroll();
  const heroBgY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const floatingY1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const floatingY2 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // Count-up animation for stats
  const AnimatedCounter = ({ end, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            let start = 0;
            const duration = 1800;
            const increment = Math.ceil(end / (duration / 16));
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                setCount(end);
                clearInterval(timer);
              } else {
                setCount(start);
              }
            }, 16);
            
            return () => clearInterval(timer);
          }
        },
        { threshold: 0.6 }
      );

      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, [end]);

    return <span ref={ref}>{count}{suffix}</span>;
  };

  const handleStartBuilding = () => {
    navigate('/signup'); // Adjust route as per your app
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#67e8f9] via-[#ec4899] to-[#a3e635] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">SyncUp</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-[#67e8f9] transition-colors">Features</a>
            <a href="#how" className="hover:text-[#67e8f9] transition-colors">How it Works</a>
            <a href="#stats" className="hover:text-[#67e8f9] transition-colors">Impact</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogin}
              className="px-6 py-2.5 text-sm font-medium hover:text-[#67e8f9] transition-colors"
            >
              Log in
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartBuilding}
              className="px-6 py-2.5 bg-white text-black rounded-full font-semibold flex items-center gap-2 hover:bg-[#67e8f9] transition-colors"
            >
              Start Building <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className="min-h-screen pt-20 relative flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          style={{ y: heroBgY }}
          className="absolute inset-0 bg-[radial-gradient(at_50%_30%,rgba(103,232,249,0.15)_0%,transparent_50%)]"
        />
        
        {/* Floating Orbs */}
        <motion.div 
          style={{ y: floatingY1 }}
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#67e8f9] opacity-10 blur-3xl"
          animate={{ 
            x: [0, 40, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div 
          style={{ y: floatingY2 }}
          className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-[#ec4899] opacity-10 blur-3xl"
          animate={{ 
            x: [0, -60, 0],
            scale: [1, 0.95, 1]
          }}
          transition={{ duration: 30, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <div className="w-2 h-2 bg-[#a3e635] rounded-full animate-pulse" />
            <span className="text-sm uppercase tracking-[3px] font-mono">Now in Beta</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl md:text-8xl font-bold tracking-tighter leading-none mb-6"
          >
            BUILD<br />
            <span className="bg-gradient-to-r from-[#67e8f9] via-[#ec4899] to-[#a3e635] bg-clip-text text-transparent">TOGETHER</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl text-white/70 max-w-2xl mx-auto mb-4 font-light"
          >
            The premium collaboration platform where students and builders discover real projects, match with perfect teammates, and ship portfolio-worthy products.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(103,232,249,0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartBuilding}
              className="group px-10 py-5 bg-gradient-to-r from-[#67e8f9] to-[#ec4899] text-black font-semibold text-lg rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 transition-all"
            >
              Start Building Now
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="px-10 py-5 border border-white/30 hover:border-white/60 rounded-2xl text-lg font-medium transition-all"
            >
              I already have an account
            </motion.button>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-20 flex justify-center"
          >
            <div className="text-white/40 text-sm flex items-center gap-2">
              Scroll to explore <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>↓</motion.div>
            </div>
          </motion.div>
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline text-[#67e8f9] uppercase tracking-widest text-sm font-mono mb-3 block">POWERFUL TOOLS</div>
            <h2 className="text-6xl font-bold tracking-tighter">Why builders love SyncUp</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Rocket,
                title: "Discover Real Projects",
                desc: "Browse live startup and hackathon ideas.",
                accent: "#67e8f9"
              },
              {
                icon: Users,
                title: "Smart Matching",
                desc: "AI-powered teammate suggestions.",
                accent: "#ec4899"
              },
              {
                icon: MessageSquare,
                title: "Seamless Collaboration",
                desc: "Chat, tasks, and file sharing in one place.",
                accent: "#a3e635"
              },
              {
                icon: Award,
                title: "Build Portfolio",
                desc: "Every project becomes a verified achievement.",
                accent: "#67e8f9"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -12, transition: { duration: 0.2 } }}
                className="group bg-zinc-950 border border-white/10 rounded-3xl p-8 hover:border-[#67e8f9]/50 transition-all duration-300 relative overflow-hidden"
              >
                <div className="mb-8">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${feature.accent}20, transparent)` }}
                  >
                    <feature.icon className="w-9 h-9" style={{ color: feature.accent }} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.desc}</p>
                
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW SYNCUP WORKS */}
      <section id="how" className="py-24 bg-black/60 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-bold tracking-tighter mb-4">How SyncUp Works</h2>
            <p className="text-xl text-white/60 max-w-md mx-auto">From idea to shipped product in four delightful steps</p>
          </motion.div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-[#67e8f9]/40 to-transparent hidden lg:block" />
            
            <div className="grid lg:grid-cols-4 gap-12 relative">
              {[
                { 
                  step: "01", 
                  icon: Target, 
                  title: "Discover", 
                  desc: "Browse exciting projects and hackathon challenges from real builders." 
                },
                { 
                  step: "02", 
                  icon: Users, 
                  title: "Match", 
                  desc: "Get AI suggestions for teammates whose skills perfectly complement yours." 
                },
                { 
                  step: "03", 
                  icon: MessageSquare, 
                  title: "Collaborate", 
                  desc: "Work together in real-time with integrated chat, tasks, and file sharing." 
                },
                { 
                  step: "04", 
                  icon: Award, 
                  title: "Ship & Showcase", 
                  desc: "Launch your product and earn verified portfolio entries." 
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="relative bg-zinc-950/80 border border-white/10 p-8 rounded-3xl group"
                >
                  <div className="text-7xl font-mono text-white/10 mb-6 group-hover:text-[#67e8f9]/20 transition-colors">{item.step}</div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#67e8f9]/10 to-[#ec4899]/10 flex items-center justify-center">
                      <item.icon className="w-7 h-7 text-[#67e8f9]" />
                    </div>
                    <h3 className="text-3xl font-semibold">{item.title}</h3>
                  </div>
                  
                  <p className="text-white/70">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS / TRUST BAR */}
      <section id="stats" className="py-20 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { number: 1240, label: "Projects Discovered", suffix: "+" },
            { number: 8750, label: "Teammates Matched", suffix: "" },
            { number: 420, label: "Products Shipped", suffix: "" },
            { number: 98, label: "Success Rate", suffix: "%" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="text-6xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                <AnimatedCounter end={stat.number} suffix={stat.suffix} />
              </div>
              <div className="text-white/60 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-6 text-[#a3e635]">
              <Zap className="w-6 h-6" /> Join the movement
            </div>
            
            <h2 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none mb-8">
              Ready to build<br />something amazing?
            </h2>
            
            <p className="text-2xl text-white/70 mb-12">Join 1000+ builders turning ideas into reality.</p>
            
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartBuilding}
              className="px-16 py-7 text-xl font-semibold bg-white text-black rounded-3xl flex items-center gap-4 mx-auto hover:bg-gradient-to-r hover:from-[#67e8f9] hover:to-[#ec4899] hover:text-white group transition-all duration-300"
            >
              Join 1000+ builders today
              <ArrowRight className="group-hover:translate-x-2 transition" />
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#67e8f930_0%,transparent_70%)] pointer-events-none" />
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-white/40 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>© 2026 SyncUp. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
