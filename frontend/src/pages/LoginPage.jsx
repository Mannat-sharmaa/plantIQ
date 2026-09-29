import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input, Checkbox } from '../components/common/Input';
import { GlassCard } from '../components/common/Card';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('plantiq_remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const errs = {};
    if (!email) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
      addToast({
        title: 'Authentication Successful',
        message: 'Welcome back to PlantIQ Health Intelligence.',
        type: 'success'
      });
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({ form: err.response?.data?.detail || 'Authentication failed. Please verify credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (role = 'USER') => {
    if (role === 'ADMIN') {
      setEmail('admin@plantiq.ai');
      setPassword('admin1234');
    } else {
      setEmail('farmer.demo@plantiq.ai');
      setPassword('farmer1234');
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-stretch bg-grid-pattern relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Left 50% Column: Visual Tech Showcase */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#0c130f] border-r border-border/60 relative overflow-hidden text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="text-2xl">🌱</span>
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-text-primary">Plant<span className="text-primary">IQ</span></span>
            <span className="text-[10px] block font-mono text-text-muted">Multi-Layer Foliar Intelligence</span>
          </div>
        </div>

        <div className="space-y-6 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            PyTorch Inference Engine Ready
          </div>

          <h2 className="text-3xl xl:text-4xl font-heading font-bold text-white tracking-tight leading-snug">
            High-Resolution Diagnosis <br />
            <span className="text-gradient">With Explainable Certainty.</span>
          </h2>

          <p className="text-sm text-text-muted leading-relaxed">
            Log in to manage monitored crops, review historical foliar progression timelines, inspect Grad-CAM heatmaps, and access localized microclimate analytics.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-surface/80 border border-border">
              <span className="font-mono text-xl font-bold text-primary">54,305</span>
              <p className="text-xs text-text-muted mt-0.5">Annotated Specimens</p>
            </div>
            <div className="p-4 rounded-xl bg-surface/80 border border-border">
              <span className="font-mono text-xl font-bold text-purple-400">95.4%</span>
              <p className="text-xs text-text-muted mt-0.5">Top-1 Accuracy</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-text-dark font-mono">
          PlantIQ AI &copy; 2026. Academic Defense & Production Build.
        </div>
      </div>

      {/* Right 50% Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <GlassCard glow className="text-left p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-heading font-bold text-text-primary">Welcome Back</h3>
              <p className="text-xs text-text-muted mt-1">
                Enter your credentials to access the PlantIQ intelligence portal.
              </p>
            </div>

            {errors.form && (
              <div className="mb-4 p-3 rounded-xl bg-status-error/10 border border-status-error/30 text-xs text-status-error">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@agritech.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-muted hover:text-text-primary p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <Checkbox
                  label="Remember email"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <button
                  type="button"
                  onClick={() => addToast({ title: 'Password Reset', message: 'Demo reset link dispatched to mailbox.', type: 'info' })}
                  className="text-primary hover:underline text-xs"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2 font-heading font-bold tracking-wide"
              >
                LOGIN
              </Button>
            </form>

            {/* Quick Demo Fill Buttons */}
            <div className="mt-6 pt-5 border-t border-border/50 text-center">
              <span className="text-[11px] font-mono text-text-dark uppercase">Quick Demo Login:</span>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Button
                  size="sm"
                  variant="subtle"
                  onClick={() => handleDemoFill('USER')}
                  className="text-xs"
                >
                  Farmer Demo
                </Button>
                <Button
                  size="sm"
                  variant="subtle"
                  onClick={() => handleDemoFill('ADMIN')}
                  className="text-xs text-purple-300 border-purple-500/30"
                >
                  Admin Demo
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};
