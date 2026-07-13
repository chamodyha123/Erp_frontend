import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import authService from '../../services/authService';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  Factory, 
  UserCircle,
  FolderKanban,
  Boxes,
  TrendingUp,
  ArrowLeft,
  Grid3x3,
  CalendarCheck,
  CheckCircle2,
  Lock,
  Cpu,
  BarChart3,
  Globe,
  Settings,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface Module {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
  styles: {
    bg: string;
    shadow: string;
  };
}

export function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'module' | 'login'>('module');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const modules: Module[] = [
    { 
      id: 'finance', 
      name: 'Financial Management', 
      icon: <DollarSign className="w-8 h-8" />, 
      description: 'Accounting, GL, AP/AR, Cash Management',
      styles: { bg: 'from-emerald-500 to-teal-600', shadow: 'rgba(20,184,166,0.4)' }
    },
    { 
      id: 'procurement', 
      name: 'Procurement', 
      icon: <ShoppingCart className="w-8 h-8" />, 
      description: 'Purchase Orders, Vendor Management',
      styles: { bg: 'from-blue-600 to-indigo-700', shadow: 'rgba(37,99,235,0.4)' }
    },
    { 
      id: 'inventory', 
      name: 'Inventory Management', 
      icon: <Package className="w-8 h-8" />, 
      description: 'Stock Control, Warehousing, Tracking',
      styles: { bg: 'from-sky-400 to-blue-500', shadow: 'rgba(56,189,248,0.4)' }
    },
    { 
      id: 'sales', 
      name: 'Sales & Distribution', 
      icon: <TrendingUp className="w-8 h-8" />, 
      description: 'Orders, Invoicing, Delivery Management',
      styles: { bg: 'from-blue-500 to-sky-400', shadow: 'rgba(59,130,246,0.4)' }
    },
    { 
      id: 'manufacturing', 
      name: 'Manufacturing (MRP)', 
      icon: <Factory className="w-8 h-8" />, 
      description: 'Work Orders, BOM, Production Planning',
      styles: { bg: 'from-purple-600 to-indigo-700', shadow: 'rgba(147,51,234,0.4)' }
    },
    { 
      id: 'hr', 
      name: 'Human Resource', 
      icon: <Users className="w-8 h-8" />, 
      description: 'Payroll, Attendance, Recruitment',
      styles: { bg: 'from-teal-400 to-emerald-500', shadow: 'rgba(45,212,191,0.4)' }
    },
    { 
      id: 'crm', 
      name: 'CRM Hub', 
      icon: <UserCircle className="w-8 h-8" />, 
      description: 'Leads, Opportunities, Activities',
      styles: { bg: 'from-indigo-600 to-blue-600', shadow: 'rgba(79,70,229,0.4)' }
    },
    { 
      id: 'assets', 
      name: 'Asset Management', 
      icon: <Boxes className="w-8 h-8" />, 
      description: 'Fixed Assets, Maintenance, Depreciation',
      styles: { bg: 'from-teal-500 to-cyan-600', shadow: 'rgba(13,148,136,0.4)' }
    },
    { 
      id: 'projects', 
      name: 'Project Management', 
      icon: <FolderKanban className="w-8 h-8" />, 
      description: 'Tasks, Timesheets, Budgeting',
      styles: { bg: 'from-purple-500 to-purple-700', shadow: 'rgba(168,85,247,0.4)' }
    },
    { 
      id: 'attendance', 
      name: 'Attendance Gate', 
      icon: <CalendarCheck className="w-8 h-8" />, 
      description: 'Clock In / Clock Out Staff Tracking',
      styles: { bg: 'from-indigo-500 to-purple-600', shadow: 'rgba(99,102,241,0.4)' }
    },
    { 
      id: 'analytics', 
      name: 'Business Analytics', 
      icon: <BarChart3 className="w-8 h-8" />, 
      description: 'BI Reporting, Forecasts & KPIs',
      styles: { bg: 'from-sky-500 to-indigo-600', shadow: 'rgba(14,165,233,0.4)' }
    },
    { 
      id: 'supplychain', 
      name: 'Supply Chain Sync', 
      icon: <Globe className="w-8 h-8" />, 
      description: 'Logistics, Fleet and Route Control',
      styles: { bg: 'from-indigo-700 to-purple-500', shadow: 'rgba(79,70,229,0.4)' }
    },
    { 
      id: 'core_config', 
      name: 'System Infrastructure', 
      icon: <Cpu className="w-8 h-8" />, 
      description: 'Kernel Settings & API Extensions',
      styles: { bg: 'from-cyan-500 to-blue-600', shadow: 'rgba(6,182,212,0.4)' }
    },
    { 
      id: 'qa_module', 
      name: 'Quality Assurance', 
      icon: <Settings className="w-8 h-8" />, 
      description: 'Audit Logs & Validation Flows',
      styles: { bg: 'from-emerald-600 to-teal-500', shadow: 'rgba(5,150,105,0.4)' }
    },
    { 
      id: 'security', 
      name: 'Security Shield', 
      icon: <ShieldAlert className="w-8 h-8" />, 
      description: 'IAM Controls & Token Management',
      styles: { bg: 'from-blue-700 to-indigo-900', shadow: 'rgba(29,78,216,0.4)' }
    },
    { 
      id: 'support', 
      name: 'Global Desk Support', 
      icon: <HelpCircle className="w-8 h-8" />, 
      description: 'Ticketing and Corporate Assistance',
      styles: { bg: 'from-purple-600 to-indigo-600', shadow: 'rgba(147,51,234,0.4)' }
    }
  ];

  // ADVANCED QUANTUM DIGITAL LAYERED CANVAS INFRASTRUCTURE
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const maxParticles = 75; // Interactive Forcefield Dots
    const maxStaticParticles = 55; // Free Cosmic Ambient Floating Dots

    let mouse = { x: -1000, y: -1000, easeX: -1000, easeY: -1000 };

    class Particle {
      x: number = 0;
      y: number = 0;
      radius: number = 0;
      vx: number = 0;
      vy: number = 0;
      color: string = '';
      alpha: number = 0;
      baseVx: number = 0;
      baseVy: number = 0;
      isStatic: boolean = false;

      constructor(isStatic = false) {
        this.isStatic = isStatic;
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height; 
        
        if (this.isStatic) {
          // --- FREE MOVEMENT STATIC AMBIENT CONFIG ---
          this.radius = Math.random() * 2.2 + 1.2;
          // Giving them an independent organic drift vector path
          this.baseVx = (Math.random() - 0.5) * 0.7; 
          this.baseVy = (Math.random() - 0.5) * 0.7; 
          this.alpha = Math.random() * 0.4 + 0.25;
        } else {
          // Interactive nodes formula
          this.radius = Math.random() * 3.5 + 2.5; 
          this.baseVx = (Math.random() - 0.5) * 0.4;
          this.baseVy = -(Math.random() * 0.8 + 0.4); 
          this.alpha = Math.random() * 0.6 + 0.4;
        }
        
        this.vx = this.baseVx;
        this.vy = this.baseVy;

        const neonColors = ['#00f0ff', '#00ffd2', '#3b82f6', '#a855f7', '#06b6d4'];
        this.color = neonColors[Math.floor(Math.random() * neonColors.length)];
      }

      update() {
        if (!this.isStatic) {
          // Interactive Nodes: Reacts directly to mouse positions
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);
          const activeRadius = 240; 

          if (distance < activeRadius) {
            const force = (activeRadius - distance) / activeRadius;
            this.vx -= (dx / distance) * force * 0.35;
            this.vy -= (dy / distance) * force * 0.35;
            
            this.vx *= 0.94;
            this.vy *= 0.94;
          } else {
            this.vx += (this.baseVx - this.vx) * 0.05;
            this.vy += (this.baseVy - this.vy) * 0.05;
          }

          const dragStrengthX = (mouse.easeX - width / 2) * 0.002;
          const dragStrengthY = (mouse.easeY - height / 2) * 0.002;

          this.x += this.vx + dragStrengthX * this.radius; 
          this.y += this.vy + dragStrengthY * this.radius;

          // Flow upwards boundaries reset
          if (this.y < -15 || this.x < -15 || this.x > width + 15 || this.y > height + 15) {
            this.reset();
            this.y = height + 10;
          }
        } else {
          // --- TRUE FREE FLOATING AMBIENT PATHWAY LOGIC ---
          this.x += this.vx;
          this.y += this.vy;

          // Slow organic direction shift so they bounce naturally around the cluster space
          if (Math.random() < 0.01) {
            this.vx += (Math.random() - 0.5) * 0.1;
            this.vy += (Math.random() - 0.5) * 0.1;
          }

          // Screen edge wrap around boundary logic for free particles
          if (this.x < -10) this.x = width + 10;
          if (this.x > width + 10) this.x = -10;
          if (this.y < -10) this.y = height + 10;
          if (this.y > height + 10) this.y = -10;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        
        ctx.shadowBlur = this.isStatic ? 8 : 16; 
        ctx.shadowColor = this.color;
        ctx.fill();
      }
    }

    // Initialize Interactive Layer
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle(false));
    }

    // Initialize Free-Floating Ambient Layer
    for (let i = 0; i < maxStaticParticles; i++) {
      particles.push(new Particle(true));
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    const render = () => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#030712');
      gradient.addColorStop(0.5, '#070f22');
      gradient.addColorStop(1, '#02050c');
      
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 1.0;
      ctx.fillRect(0, 0, width, height);

      mouse.easeX += (mouse.x - mouse.easeX) * 0.05;
      mouse.easeY += (mouse.y - mouse.easeY) * 0.05;

      // Render Matrix Architecture lines exclusively on active nodes
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          if (particles[i].isStatic || particles[j].isStatic) continue;
          
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = (130 - dist) / 130 * 0.12;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
    setStep('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) return;
    setIsLoading(true);
    setError(null);
    try {
      await authService.login({ username: credentials.username, password: credentials.password });
      localStorage.setItem('selectedModule', selectedModule?.id || 'all');
      navigate(selectedModule?.id === 'attendance' ? '/hr/clock-in' : '/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllServices = () => {
    setSelectedModule({
      id: 'all',
      name: 'All Services Engine',
      icon: <Grid3x3 className="w-8 h-8" />,
      description: 'Access unified enterprise hub operations',
      styles: { bg: 'from-slate-900 to-slate-950', shadow: 'rgba(56,189,248,0.2)' }
    });
    setStep('login');
  };

  const handleBack = () => {
    setStep('module');
    setSelectedModule(null);
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex flex-col justify-between font-sans text-blue-100 select-none">
      
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      />

      {/* Futuristic Digital Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff05_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
      
      {/* Dynamic Cyber Tech Vignette Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,#02050c_90%)] pointer-events-none z-0 opacity-80"></div>

      {/* DYNAMIC ACCELERATED SPEED ORIENTATION */}
      <style>{`
        @keyframes orbit-system {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-orbit-slow {
          animation: orbit-system 28s linear infinite; 
        }
        .animate-orbit-slow:hover {
          animation-play-state: paused;
        }
        .counter-rotate-node {
          animation: orbit-system 28s linear infinite reverse;
        }
        .animate-orbit-slow:hover .counter-rotate-node {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-white/[0.03] bg-slate-950/40 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30">N</div>
          <span className="text-white font-bold text-xl tracking-wider">Nexa<span className="text-sky-400">ERP</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-200 bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-xl font-mono">

          <Lock className="w-3.5 h-3.5 text-sky-400 animate-pulse" /> Unified Architecture Gateway

        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 flex-1 flex flex-col items-center justify-center">
        
        <div className="mb-4 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Nexa<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">ERP</span>
          </h1>
          <p className="text-xs md:text-sm text-blue-300 font-medium tracking-widest uppercase">
            {step === 'module' ? 'Select Domain Architecture Module' : 'Identity Verification Required'}
          </p>
        </div>

        {step === 'module' ? (
          <div className="w-full max-w-6xl flex flex-col items-center">
            
            {/* Desktop Accelerated Orbit Map Layout */}
            <div className="hidden md:flex items-center justify-center w-full min-h-[660px]">
              <div className="relative w-[600px] aspect-square flex items-center justify-center">
                
                <div className="absolute inset-0 rounded-full border border-white/[0.02]"></div>
                <div className="absolute inset-[8%] rounded-full border border-dashed border-blue-400/10"></div>

                <div className="absolute inset-0 animate-orbit-slow flex items-center justify-center">
                  {modules.map((module, index) => {
                    const totalModules = modules.length;
                    const angle = (index * 360) / totalModules;
                    const orbitRadius = 50; 
                    
                    const angleRad = (angle * Math.PI) / 180;
                    const x = 50 + orbitRadius * Math.cos(angleRad);
                    const y = 50 + orbitRadius * Math.sin(angleRad);
                    const isHovered = hoveredModule === module.id;
                    
                    return (
                      <div
                        key={module.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <div className="counter-rotate-node">
                          <button
                            onClick={() => handleModuleSelect(module)}
                            onMouseEnter={() => setHoveredModule(module.id)}
                            onMouseLeave={() => setHoveredModule(null)}
                            className="relative block focus:outline-none"
                          >
                            <div 
                              className={`w-20 h-20 rounded-[1.65rem] bg-gradient-to-br ${module.styles.bg} flex items-center justify-center text-white transition-all duration-300 relative border border-white/10`}
                              style={{
                                boxShadow: isHovered ? `0 0 35px ${module.styles.shadow}` : '0 8px 24px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.15)',
                                transform: isHovered ? 'scale(1.22) translateY(-4px)' : 'scale(1)'
                              }}
                            >
                              {module.icon}
                              <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-slate-900 border border-white/40 shadow-sm"></div>
                            </div>

                            <div className={`
                              absolute top-full mt-4 left-1/2 transform -translate-x-1/2 
                              transition-all duration-200 pointer-events-none z-50
                              ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'}
                            `}>
                              <div className="bg-slate-950/95 border border-blue-900/40 backdrop-blur-2xl px-4 py-3 rounded-2xl shadow-2xl text-left w-56">
                                <p className="text-sm font-bold tracking-wide flex items-center gap-2 text-white">
                                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                                  {module.name}
                                </p>
                                <p className="text-xs text-blue-200/70 font-normal mt-1 leading-normal">
                                  {module.description}
                                </p>
                              </div>
                            </div>

                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleAllServices}
                  onMouseEnter={() => setHoveredModule('all')}
                  onMouseLeave={() => setHoveredModule(null)}
                  className="relative z-40 group focus:outline-none"
                >
                  <div className={`
                    w-44 h-44 rounded-[2.2rem] bg-slate-950/50 border backdrop-blur-md
                    flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-300
                    ${hoveredModule === 'all' ? 'scale-105 border-sky-500 shadow-[0_0_50px_rgba(56,189,248,0.2)]' : 'border-white/[0.06]'}
                  `}>
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-2 shadow-inner">
                      <Grid3x3 className="w-7 h-7 text-slate-400 group-hover:text-sky-400 transition-colors" />
                    </div>
                    <p className="font-bold text-xs tracking-wider uppercase text-white">All Modules</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 tracking-tight">Unified Gateway</p>
                  </div>
                </button>

              </div>
            </div>

            {/* Mobile Cards Grid View Adaptations */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 md:hidden w-full max-w-xl mx-auto px-2">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => handleModuleSelect(module)}
                  className="flex flex-col items-center p-4 bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.05] active:scale-95 transition-all duration-150 text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.styles.bg} flex items-center justify-center text-white shadow-lg mb-3 border border-white/10`}>
                    {module.icon}
                  </div>
                  <p className="text-blue-100 text-xs font-semibold tracking-wide leading-tight">
                    {module.name}
                  </p>
                </button>
              ))}
              
              <button
                onClick={handleAllServices}
                className="flex flex-col items-center p-4 bg-slate-950/60 backdrop-blur-xl rounded-2xl border border-sky-500/30 active:scale-95 transition-all duration-150 text-center col-span-2 sm:col-span-1"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/[0.05] flex items-center justify-center text-sky-400 shadow-md mb-3">
                  <Grid3x3 className="w-6 h-6" />
                </div>
                <p className="text-white text-xs font-bold tracking-wide">All Services</p>
              </button>
            </div>

          </div>
        ) : (
          <div className="w-full max-w-md animate-[fadeIn_0.15s_ease-out]">
            <div className="bg-slate-950/80 border border-blue-900/30 backdrop-blur-3xl rounded-3xl shadow-2xl p-6 md:p-8 relative">
              
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-blue-300 hover:text-white text-xs font-medium transition-colors mb-6 bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 rounded-xl group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Return to Central Grid</span>
              </button>

              <div className="flex items-center gap-4 mb-6 p-4 bg-blue-950/40 border border-blue-800/20 rounded-2xl">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedModule?.styles.bg} border border-white/10 flex items-center justify-center shadow-md flex-shrink-0 text-white`}>
                  {selectedModule?.icon}
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 block font-mono">Secured Cluster</span>
                  <h3 className="text-white font-bold text-sm truncate leading-snug">{selectedModule?.name}</h3>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-xs font-bold tracking-wider uppercase text-blue-300 mb-2 font-mono">
                    System Identity
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full px-4 py-3 bg-blue-950/50 border border-blue-900/40 focus:border-sky-500/50 rounded-xl text-white text-sm placeholder-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-mono"
                    placeholder="Username"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-bold tracking-wider uppercase text-blue-300 mb-2 font-mono">
                    Access Token Key
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full px-4 py-3 bg-blue-950/50 border border-blue-900/40 focus:border-sky-500/50 rounded-xl text-white text-sm placeholder-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-mono"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center text-blue-300 cursor-pointer select-none font-medium">
                    <input type="checkbox" className="mr-2 rounded border-blue-900/60 bg-blue-950 text-sky-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5" />
                    Remember token
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-blue-300 hover:text-blue-100 transition-colors"
                  >
                    Forgot password?
                  </button>

                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 active:scale-[0.99] disabled:opacity-50 text-white text-sm font-bold py-3 px-6 rounded-xl transition-all shadow-xl shadow-blue-950/50"
                >
                  {isLoading ? 'Decrypting Credentials...' : 'Establish Secure Connection'}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium font-mono">
                  {error}
                </div>
              )}

              <div className="mt-5 p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl text-center">

                <p className="text-blue-400/60 text-[11px] font-mono">
                  Preset Node: <span className="text-blue-200 bg-slate-900 px-1.5 py-0.5 rounded">admin</span> / <span className="text-blue-200 bg-slate-900 px-1.5 py-0.5 rounded">Admin1234!</span>
                </p>

              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.03] grid grid-cols-2 gap-2 text-[10px] text-blue-300/70 font-mono">
                <div className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-sky-400 flex-shrink-0" /> Realtime Security</div>
                <div className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-sky-400 flex-shrink-0" /> End-to-End Encrypted</div>
                <div className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-sky-400 flex-shrink-0" /> Distributed Node</div>
                <div className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-sky-400 flex-shrink-0" /> Audit Logging</div>
              </div>

            </div>
          </div>
        )}
      </div>

      <div className="relative z-20 w-full text-center py-3.5 border-t border-white/[0.03] bg-slate-950/60 text-[11px] text-blue-400/60 tracking-wider flex flex-col sm:flex-row items-center justify-between px-6 gap-2 font-mono">

        <p>© 2026 NexaERP Infrastructure Operations. Auth Architecture Layer.</p>
        <div className="flex items-center gap-4 text-blue-500/60">
          <a href="#" className="hover:text-blue-400 transition-colors">Anti-Grav Target Sync</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-400 transition-colors">Core Layer: Active</a>

        </div>
      </div>

    </div>
  );
}