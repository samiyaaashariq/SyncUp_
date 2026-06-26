<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SyncUp • Build Together</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Space+Grotesk:wght@500;600;700&amp;display=swap');

        :root {
            --cyan: #67e8f9;
            --pink: #ec4899;
            --lime: #a3e635;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', system-ui, sans-serif;
            background-color: #0a0a0a;
            color: white;
            overflow-x: hidden;
            line-height: 1.6;
        }

        .title-font {
            font-family: 'Space Grotesk', sans-serif;
        }

        .hero-bg {
            background: radial-gradient(circle at 50% 30%, rgba(103, 232, 249, 0.18) 0%, transparent 70%);
        }

        .neon-text {
            background: linear-gradient(90deg, var(--cyan), var(--pink), var(--lime));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .floating-orb {
            animation: floatOrb 25s ease-in-out infinite;
        }

        @keyframes floatOrb {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(60px, -60px) rotate(8deg); }
        }

        .card {
            transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
            background: #111111;
            border: 1px solid rgba(255,255,255,0.08);
        }

        .card:hover {
            transform: translateY(-16px);
            border-color: #67e8f9;
            box-shadow: 0 30px 60px -15px rgba(103, 232, 249, 0.25);
        }

        .btn-primary {
            background: linear-gradient(to right, #67e8f9, #ec4899);
            color: black;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(103, 232, 249, 0.6);
        }

        .section-header {
            font-size: 3.5rem;
            line-height: 1.1;
            font-weight: 700;
            letter-spacing: -0.04em;
        }

        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(to right, #67e8f9, #ec4899);
            z-index: 100;
            transition: width 0.1s;
        }
    </style>
</head>
<body>
    <!-- Progress Bar -->
    <div id="progressBar" class="progress-bar" style="width: 0%;"></div>

    <!-- NAV -->
    <nav style="position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(10,10,10,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="max-width: 1280px; margin: 0 auto; padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #67e8f9, #ec4899, #a3e635); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: black; font-size: 1.4rem;">
                    <i class="fa-solid fa-sparkles"></i>
                </div>
                <span style="font-size: 1.75rem; font-weight: 700; letter-spacing: -0.05em;" class="title-font">SyncUp</span>
            </div>
            
            <div style="display: none; gap: 2rem; font-size: 0.95rem; font-weight: 500;" class="md-flex">
                <a href="#features" style="color: white; text-decoration: none;">Features</a>
                <a href="#how" style="color: white; text-decoration: none;">How it Works</a>
                <a href="#stats" style="color: white; text-decoration: none;">Impact</a>
            </div>

            <div style="display: flex; gap: 1rem; align-items: center;">
                <button onclick="document.getElementById('login').scrollIntoView({ behavior: 'smooth' })" 
                        style="padding: 10px 24px; color: white; border: none; background: transparent; font-weight: 500; cursor: pointer;">
                    Log in
                </button>
                <button onclick="document.getElementById('cta').scrollIntoView({ behavior: 'smooth' })" 
                        class="btn-primary" 
                        style="padding: 12px 28px; border-radius: 9999px; display: flex; align-items: center; gap: 10px; border: none; cursor: pointer;">
                    Start Building Now 
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    </nav>

    <!-- HERO -->
    <section style="min-height: 100vh; padding-top: 80px; position: relative; display: flex; align-items: center; overflow: hidden;" class="hero-bg">
        <!-- Orbs -->
        <div style="position: absolute; top: 15%; left: 8%; width: 380px; height: 380px; background: #67e8f9; border-radius: 50%; filter: blur(80px); opacity: 0.12;" class="floating-orb"></div>
        <div style="position: absolute; bottom: 20%; right: 10%; width: 520px; height: 520px; background: #ec4899; border-radius: 50%; filter: blur(90px); opacity: 0.1;" class="floating-orb" id="orb2"></div>

        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px; text-align: center; position: relative; z-index: 10;">
            <div style="display: inline-flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 8px 24px; border-radius: 9999px; margin-bottom: 2rem; font-size: 0.9rem; letter-spacing: 2px;">
                <div style="width: 8px; height: 8px; background: #a3e635; border-radius: 50%; animation: pulse 2s infinite;"></div>
                BETA LIVE
            </div>

            <h1 style="font-size: 4.8rem; line-height: 1.05; font-weight: 700; letter-spacing: -0.06em;" class="title-font">
                BUILD<br>
                <span class="neon-text">TOGETHER</span>
            </h1>

            <p style="font-size: 1.65rem; max-width: 720px; margin: 1.5rem auto; color: #ddd; font-weight: 300;">
                The premium collaboration platform where students and builders discover real projects, match with perfect teammates, and ship portfolio-worthy products.
            </p>

            <div style="margin-top: 3rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; justify-content: center;">
                <button onclick="document.getElementById('cta').scrollIntoView({ behavior: 'smooth' })" 
                        class="btn-primary" 
                        style="font-size: 1.25rem; padding: 22px 52px; border-radius: 9999px;">
                    Start Building Now
                </button>
                <button onclick="document.getElementById('login').scrollIntoView({ behavior: 'smooth' })" 
                        style="font-size: 1.1rem; padding: 18px 42px; background: transparent; border: 2px solid rgba(255,255,255,0.3); border-radius: 9999px; color: white; cursor: pointer;">
                    I already have an account
                </button>
            </div>
        </div>

        <div style="position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.4); font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
            Scroll to explore <span style="animation: bounce 1.8s infinite;">↓</span>
        </div>
    </section>

    <!-- FEATURES -->
    <section id="features" style="padding: 7rem 0; background: #0a0a0a;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 24px;">
            <div style="text-align: center; margin-bottom: 4rem;">
                <div style="color: #67e8f9; font-size: 0.95rem; letter-spacing: 3px; margin-bottom: 1rem;">POWERFUL TOOLS FOR BUILDERS</div>
                <h2 style="font-size: 3.2rem;" class="title-font">Why builders love SyncUp</h2>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
                <div class="card" style="padding: 2.5rem; border-radius: 28px;">
                    <div style="width: 78px; height: 78px; background: rgba(103,232,249,0.1); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem;">
                        <i class="fa-solid fa-rocket" style="font-size: 2.6rem; color: #67e8f9;"></i>
                    </div>
                    <h3 style="font-size: 1.65rem; margin-bottom: 1rem;">Discover Real Projects</h3>
                    <p style="color: #aaa; font-size: 1.1rem;">Browse live startup and hackathon ideas.</p>
                </div>

                <div class="card" style="padding: 2.5rem; border-radius: 28px;">
                    <div style="width: 78px; height: 78px; background: rgba(236,72,153,0.1); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem;">
                        <i class="fa-solid fa-users" style="font-size: 2.6rem; color: #ec4899;"></i>
                    </div>
                    <h3 style="font-size: 1.65rem; margin-bottom: 1rem;">Smart Matching</h3>
                    <p style="color: #aaa; font-size: 1.1rem;">AI-powered teammate suggestions.</p>
                </div>

                <div class="card" style="padding: 2.5rem; border-radius: 28px;">
                    <div style="width: 78px; height: 78px; background: rgba(163,230,53,0.1); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem;">
                        <i class="fa-solid fa-comments" style="font-size: 2.6rem; color: #a3e635;"></i>
                    </div>
                    <h3 style="font-size: 1.65rem; margin-bottom: 1rem;">Seamless Collaboration</h3>
                    <p style="color: #aaa; font-size: 1.1rem;">Chat, tasks, and file sharing in one place.</p>
                </div>

                <div class="card" style="padding: 2.5rem; border-radius: 28px;">
                    <div style="width: 78px; height: 78px; background: rgba(103,232,249,0.1); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem;">
                        <i class="fa-solid fa-trophy" style="font-size: 2.6rem; color: #67e8f9;"></i>
                    </div>
                    <h3 style="font-size: 1.65rem; margin-bottom: 1rem;">Build Portfolio</h3>
                    <p style="color: #aaa; font-size: 1.1rem;">Every project becomes a verified achievement.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- HOW IT WORKS -->
    <section id="how" style="padding: 7rem 0; background: #111;">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px; text-align: center;">
            <h2 style="font-size: 3.2rem; margin-bottom: 1.5rem;" class="title-font">How SyncUp Works</h2>
            <p style="font-size: 1.3rem; color: #bbb; max-width: 500px; margin: 0 auto 4rem;">From idea to shipped product — beautifully simple.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2.5rem;">
                <div style="text-align: center;">
                    <div style="font-size: 5.5rem; font-weight: 700; color: rgba(255,255,255,0.08); margin-bottom: 1rem;">01</div>
                    <div style="width: 90px; height: 90px; margin: 0 auto 1.5rem; background: rgba(103,232,249,0.1); border-radius: 24px; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-bullseye" style="font-size: 3rem; color: #67e8f9;"></i>
                    </div>
                    <h3 style="font-size: 1.7rem; margin-bottom: 0.8rem;">Discover</h3>
                    <p style="color: #aaa;">Browse exciting projects and hackathon challenges.</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 5.5rem; font-weight: 700; color: rgba(255,255,255,0.08); margin-bottom: 1rem;">02</div>
                    <div style="width: 90px; height: 90px; margin: 0 auto 1.5rem; background: rgba(236,72,153,0.1); border-radius: 24px; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-users" style="font-size: 3rem; color: #ec4899;"></i>
                    </div>
                    <h3 style="font-size: 1.7rem; margin-bottom: 0.8rem;">Match</h3>
                    <p style="color: #aaa;">AI finds your perfect teammates.</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 5.5rem; font-weight: 700; color: rgba(255,255,255,0.08); margin-bottom: 1rem;">03</div>
                    <div style="width: 90px; height: 90px; margin: 0 auto 1.5rem; background: rgba(163,230,53,0.1); border-radius: 24px; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-handshake" style="font-size: 3rem; color: #a3e635;"></i>
                    </div>
                    <h3 style="font-size: 1.7rem; margin-bottom: 0.8rem;">Collaborate</h3>
                    <p style="color: #aaa;">Real-time chat, tasks &amp; files.</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 5.5rem; font-weight: 700; color: rgba(255,255,255,0.08); margin-bottom: 1rem;">04</div>
                    <div style="width: 90px; height: 90px; margin: 0 auto 1.5rem; background: rgba(103,232,249,0.1); border-radius: 24px; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-trophy" style="font-size: 3rem; color: #67e8f9;"></i>
                    </div>
                    <h3 style="font-size: 1.7rem; margin-bottom: 0.8rem;">Ship &amp; Showcase</h3>
                    <p style="color: #aaa;">Launch and build your verified portfolio.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- STATS -->
    <section id="stats" style="padding: 5rem 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 3rem; text-align: center;">
            <div>
                <div id="count1" style="font-size: 4.2rem; font-weight: 700; letter-spacing: -2px;">1240</div>
                <div style="color: #888; margin-top: 8px;">Projects Discovered</div>
            </div>
            <div>
                <div id="count2" style="font-size: 4.2rem; font-weight: 700; letter-spacing: -2px;">8750</div>
                <div style="color: #888; margin-top: 8px;">Teammates Matched</div>
            </div>
            <div>
                <div id="count3" style="font-size: 4.2rem; font-weight: 700; letter-spacing: -2px;">420</div>
                <div style="color: #888; margin-top: 8px;">Products Shipped</div>
            </div>
            <div>
                <div id="count4" style="font-size: 4.2rem; font-weight: 700; letter-spacing: -2px;">98</div>
                <div style="color: #888; margin-top: 8px;">Success Rate %</div>
            </div>
        </div>
    </section>

    <!-- FINAL CTA -->
    <section id="cta" style="padding: 9rem 0; text-align: center; position: relative;">
        <div style="max-width: 800px; margin: 0 auto; padding: 0 24px;">
            <h2 style="font-size: 3.8rem; line-height: 1.1;" class="title-font">Ready to build something amazing?</h2>
            <p style="font-size: 1.5rem; color: #bbb; margin: 1.5rem 0 3rem;">Join 1000+ builders turning ideas into reality.</p>
            
            <button onclick="alert('Welcome to SyncUp! 🎉 (Connect your signup flow here)')" 
                    class="btn-primary" 
                    style="font-size: 1.4rem; padding: 24px 60px; border-radius: 9999px;">
                Join 1000+ builders today →
            </button>
        </div>
    </section>

    <!-- FOOTER -->
    <footer style="border-top: 1px solid rgba(255,255,255,0.08); padding: 3rem 0; text-align: center; color: #666; font-size: 0.95rem;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
            <div>© 2026 SyncUp. All rights reserved.</div>
            <div style="display: flex; gap: 2rem;">
                <a href="#" style="color: #666; text-decoration: none;">Privacy</a>
                <a href="#" style="color: #666; text-decoration: none;">Terms</a>
                <a href="#" style="color: #666; text-decoration: none;">Contact</a>
            </div>
        </div>
    </footer>

    <script>
        // Progress bar
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            document.getElementById('progressBar').style.width = scrollPercent + '%';
        });

        // Counter Animation
        function animateCounter(id, target, duration = 1800) {
            let start = 0;
            const increment = target / (duration / 16);
            const el = document.getElementById(id);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(start);
                }
            }, 16);
        }

        // Trigger stats on scroll
        let animated = false;
        window.addEventListener('scroll', () => {
            if (animated) return;
            const stats = document.getElementById('stats');
            const rect = stats.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75) {
                animated = true;
                animateCounter('count1', 1240);
                animateCounter('count2', 8750);
                animateCounter('count3', 420);
                animateCounter('count4', 98);
            }
        });

        // Orb subtle movement
        setTimeout(() => {
            const orb2 = document.getElementById('orb2');
            if (orb2) orb2.style.animation = 'floatOrb 32s ease-in-out infinite';
        }, 1200);
    </script>
</body>
</html>
