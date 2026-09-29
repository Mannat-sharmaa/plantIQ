import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  Cpu,
  Layers,
  CloudRain,
  Bot,
  Calendar,
  Network,
  CheckCircle2,
  ChevronRight,
  ScanLine
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { GlassCard } from '../components/common/Card';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle pipeline active step
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePipelineStep((prev) => (prev + 1) % 6);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const pipelineNodes = [
    { title: "Input Leaf", subtitle: "Image Validation", icon: ScanLine, tag: "01" },
    { title: "Classifier", subtitle: "EfficientNet-B4", icon: Cpu, tag: "02" },
    { title: "Segmentation", subtitle: "U-Net ResNet-34", icon: Layers, tag: "03" },
    { title: "Severity Metric", subtitle: "Pixel Area Ratio", icon: Activity, tag: "04" },
    { title: "Environment", subtitle: "Microclimate Sync", icon: CloudRain, tag: "05" },
    { title: "Grounded AI", subtitle: "RAG + LLM Advisory", icon: Bot, tag: "06" }
  ];

  const features = [
    {
      title: "Disease Classification",
      desc: "Deep convolutional backbone identifying multi-class foliar pathogens with probabilistic uncertainty calibration.",
      icon: Cpu,
      tag: "PyTorch"
    },
    {
      title: "Foliar Segmentation",
      desc: "Pixel-level U-Net identifying exact necrotic margins to delineate diseased foliage from healthy chlorophyll.",
      icon: Layers,
      tag: "Semantic CV"
    },
    {
      title: "Severity Estimation",
      desc: "Mathematical ratio of affected pixels versus healthy leaf surface categorized into Low, Moderate, High, or Critical.",
      icon: Activity,
      tag: "Deterministic"
    },
    {
      title: "Explainable AI (Grad-CAM)",
      desc: "Gradient-weighted class activation maps revealing which spatial features triggered model predictions.",
      icon: Sparkles,
      tag: "XAI Interpretability"
    },
    {
      title: "Environmental Intelligence",
      desc: "Automatic localized ambient temperature, humidity, and rainfall context synced via geolocation.",
      icon: CloudRain,
      tag: "Weather API"
    },
    {
      title: "RAG Plant Assistant",
      desc: "Retrieval-augmented conversational intelligence grounded in peer-reviewed pathology literature without hallucinations.",
      icon: Bot,
      tag: "Vector Search"
    },
    {
      title: "Health Progression Timeline",
      desc: "Track individual plants longitudinally over days and weeks to evaluate treatment efficacy and recovery.",
      icon: Calendar,
      tag: "Longitudinal"
    },
    {
      title: "Unsupervised Pattern Clusters",
      desc: "K-Means clustering on latent feature vectors enabling exploratory discovery of atypical lesions.",
      icon: Network,
      tag: "Unsupervised ML"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary overflow-hidden bg-grid-pattern relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-100px] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Sticky Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 sm:px-12 flex items-center justify-between ${
          scrolled
            ? 'h-16 bg-[#0a0f0d]/90 backdrop-blur-md border-b border-border/60 shadow-glass'
            : 'h-20 bg-transparent'
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/40 flex items-center justify-center shadow-neon-green/20">
            <span className="text-2xl">🌱</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-heading font-bold text-lg tracking-tight">
              Plant<span className="text-primary">IQ</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">
              Health Intelligence
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-text-muted">
          <a href="#pipeline" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#features" className="hover:text-primary transition-colors">Architecture</a>
          <a href="#about" className="hover:text-primary transition-colors">Scientific Defense</a>
          <Link to="/model-information" className="hover:text-primary transition-colors">Models</Link>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/scan')}>
            Analyze Leaf
          </Button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 sm:pt-40 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono font-medium text-primary">
                Multi-Layer Computer Vision & Pathology AI
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-white leading-[1.1]">
              One Image. <br />
              <span className="text-gradient">Multiple Layers of Intelligence.</span>
            </h1>

            <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
              Upload a single plant leaf. PlantIQ executes real-time classification, pixel-wise foliar segmentation, mathematical severity calculation, Grad-CAM interpretability, microclimate weather fusion, and grounded RAG advisory.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={ScanLine}
                onClick={() => navigate('/scan')}
                className="font-heading font-bold"
              >
                Analyze My Plant
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Explore Live Dashboard
              </Button>
            </div>

            {/* Trust Line & Demo Stats */}
            <div className="pt-6 border-t border-border/50 flex flex-wrap items-center gap-6 text-xs text-text-muted">
              <div className="flex -space-x-2">
                {['#00ff88', '#8b5cf6', '#38bdf8', '#ffb020'].map((bg, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: bg }}
                    className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-black"
                  >
                    {i === 3 ? '+10k' : '🌾'}
                  </div>
                ))}
              </div>
              <div>
                <span className="font-semibold text-text-primary">Trusted by 10,000+ farmers & agronomists</span>
                <p className="text-[11px] text-text-dark">Validated across 54,000+ curated leaf specimens</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Custom Animated Leaf SVG with Laser Scan & Disease Spots */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Ambient Leaf Glow */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse-subtle" />

            <div className="relative w-full max-w-md aspect-square rounded-3xl border border-border/80 bg-surface/80 backdrop-blur-xl p-8 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
              {/* Scan HUD Overlay Badges */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <Badge variant="primary" dot size="sm">LIVE INFERENCE</Badge>
                <span className="font-mono text-[10px] text-text-muted">384×384 TENSOR</span>
              </div>

              <div className="absolute top-4 right-4 z-20 font-mono text-[10px] text-primary">
                CAM: ACTIVE
              </div>

              {/* Animated Leaf SVG */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_25px_rgba(0,255,136,0.3)]">
                  <defs>
                    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8" />
                      <stop offset="60%" stopColor="#10b981" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#065f46" stopOpacity="0.95" />
                    </linearGradient>
                    <radialGradient id="spotGrad1" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ff4d6d" stopOpacity="0.95" />
                      <stop offset="70%" stopColor="#b91c1c" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ffb020" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="spotGrad2" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffb020" stopOpacity="0.95" />
                      <stop offset="60%" stopColor="#b45309" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Leaf Silhouette */}
                  <path
                    d="M 100,10 C 145,45 170,100 135,160 C 110,185 95,190 90,195 C 90,185 80,180 65,160 C 30,100 55,45 100,10 Z"
                    fill="url(#leafGrad)"
                    stroke="#00ff88"
                    strokeWidth="2.5"
                  />

                  {/* Central Stem */}
                  <path
                    d="M 100,15 Q 100,90 90,195"
                    stroke="#e8f5ee"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.7"
                  />

                  {/* Lateral Leaf Veins */}
                  <path d="M 100,45 Q 125,55 145,65" stroke="#e8f5ee" strokeWidth="1.2" opacity="0.5" />
                  <path d="M 100,45 Q 75,55 55,65" stroke="#e8f5ee" strokeWidth="1.2" opacity="0.5" />
                  <path d="M 98,80 Q 130,95 152,110" stroke="#e8f5ee" strokeWidth="1.2" opacity="0.5" />
                  <path d="M 98,80 Q 70,95 48,110" stroke="#e8f5ee" strokeWidth="1.2" opacity="0.5" />
                  <path d="M 95,120 Q 120,135 135,148" stroke="#e8f5ee" strokeWidth="1.2" opacity="0.5" />
                  <path d="M 95,120 Q 75,135 62,148" stroke="#e8f5ee" strokeWidth="1.2" opacity="0.5" />

                  {/* Diseased Lesion Spots (highlighted during scan) */}
                  <ellipse cx="125" cy="85" rx="14" ry="9" fill="url(#spotGrad1)" className="animate-pulse" />
                  <ellipse cx="72" cy="115" rx="11" ry="8" fill="url(#spotGrad2)" className="animate-pulse" />
                  <circle cx="118" cy="135" r="7" fill="url(#spotGrad1)" opacity="0.85" />
                  <circle cx="75" cy="75" r="5" fill="url(#spotGrad2)" opacity="0.75" />
                </svg>

                {/* Sweeping Laser Scan Line */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent shadow-[0_0_15px_#00ff88] animate-scan pointer-events-none" />
              </div>

              {/* Floating Live Metric Card */}
              <div className="w-full mt-2 p-3 rounded-xl bg-surface-light/80 border border-border/80 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase">Detected Pathogen</span>
                  <div className="font-heading font-semibold text-xs text-text-primary">Tomato Late Blight</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-text-muted uppercase">Confidence</span>
                  <div className="font-mono font-bold text-xs text-primary">94.2%</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI PIPELINE SECTION (Section 10) */}
      <section id="pipeline" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto text-center border-t border-border/50">
        <Badge variant="primary" dot size="md" className="mb-3">
          End-to-End Deep Learning Pipeline
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary tracking-tight">
          How It Works
        </h2>
        <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto mt-2 mb-12">
          Six synchronized layers of intelligence transforming pixels into actionable agronomic diagnosis.
        </p>

        {/* Pipeline Nodes Flow */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
          {pipelineNodes.map((node, i) => {
            const Icon = node.icon;
            const isActive = activePipelineStep === i;
            return (
              <motion.div
                key={node.tag}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl p-5 border text-left transition-all duration-300 ${
                  isActive
                    ? 'border-primary bg-primary/10 shadow-neon-green/30'
                    : 'border-border bg-surface/60 hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-primary">{node.tag}</span>
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-primary text-black' : 'bg-surface-light text-text-muted'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-heading font-semibold text-sm text-text-primary">{node.title}</h4>
                <p className="text-xs text-text-muted mt-1 leading-snug">{node.subtitle}</p>

                {/* Progress dot */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary shadow-neon-green" />
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURES GRID (Section 11) */}
      <section id="features" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-border/50">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="secondary" size="md" className="mb-3">
            Core Modules
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary tracking-tight">
            Engineered for Precision & Explainability
          </h2>
          <p className="text-sm text-text-muted mt-2">
            Every layer complies with scientific rigor: uncertainty reporting, visual heatmaps, and zero hallucinations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <GlassCard key={index} glow tilt className="text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-light border border-border flex items-center justify-center text-primary shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-text-dark uppercase">{feat.tag}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-base text-text-primary mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-border/40 flex items-center gap-1 text-xs text-primary font-medium">
                  <span>Explore component</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* SCIENTIFIC DEFENSE / ETHICS CALLOUT (Section 2) */}
      <section id="about" className="py-16 px-6 sm:px-12 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-secondary/30 bg-surface/90 p-8 sm:p-12 relative overflow-hidden backdrop-blur-xl text-left shadow-2xl">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-purple-300 text-xs font-mono mb-4">
            <Shield className="w-3.5 h-3.5" />
            Rigorous AI & Scientific Integrity
          </div>

          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight mb-4">
            Strict Separation of Prediction, Explanation & Context
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-text-muted pt-2">
            <div className="p-4 rounded-xl bg-surface-light/60 border border-border">
              <span className="font-semibold text-primary block mb-1">1. MODEL PREDICTION</span>
              Deterministic neural inferences from PyTorch backbones. Displays calibrated confidence percentages without arbitrary certainty claims.
            </div>
            <div className="p-4 rounded-xl bg-surface-light/60 border border-border">
              <span className="font-semibold text-purple-300 block mb-1">2. AI-GENERATED REPORT</span>
              Synthesized by LLMs grounded strictly via vector search on pathology documents. Clearly distinct from biological ground truth.
            </div>
            <div className="p-4 rounded-xl bg-surface-light/60 border border-border">
              <span className="font-semibold text-amber-300 block mb-1">3. ENVIRONMENTAL CONTEXT</span>
              Retrieved from meteorological APIs. Evaluated as epidemiological risk factors rather than standalone proof of disease.
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/50 py-12 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span>🌱</span>
          <span className="font-heading font-bold text-text-primary">PlantIQ</span>
          <span>— Deep Learning Plant Health Intelligence</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/model-performance" className="hover:text-primary transition-colors">Model Metrics</Link>
          <Link to="/clusters" className="hover:text-primary transition-colors">Cluster Map</Link>
          <Link to="/admin" className="hover:text-primary transition-colors">Admin Console</Link>
          <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
        </div>

        <div>
          <span>B.Tech AI & Data Science Project</span>
        </div>
      </footer>
    </div>
  );
};
