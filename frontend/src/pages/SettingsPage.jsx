import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Database,
  CloudRain,
  Bot,
  HardDrive,
  Save,
  CheckCircle2,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Input';
import { Badge } from '../components/common/Badge';

export const SettingsPage = () => {
  const { demoMode, toggleDemoMode } = useAuth();
  const { addToast } = useToast();

  const [aiProvider, setAiProvider] = useState('demo');
  const [weatherProvider, setWeatherProvider] = useState('demo');
  const [storageProvider, setStorageProvider] = useState('local');
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleSave = () => {
    addToast({
      title: 'Settings Persisted',
      message: 'System runtime configurations updated.',
      type: 'success'
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
            System Settings & Providers
          </h1>
        </div>
        <p className="text-xs text-text-muted mt-1">
          Configure runtime abstractions for computer vision inference, weather telemetry, and LLM backends.
        </p>
      </div>

      <div className="space-y-6">
        {/* Runtime Environment Card */}
        <div className="p-6 rounded-3xl border border-border bg-surface space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-semibold text-sm text-text-primary">Inference Runtime Mode</h3>
            </div>
            <Badge variant={demoMode ? "warning" : "primary"} size="sm">
              {demoMode ? "DEMO MODE ACTIVE" : "PRODUCTION FASTAPI"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-text-primary block">Toggle Demo Mode</span>
              <p className="text-xs text-text-muted">
                When enabled, uses high-fidelity client-side mock models and synthesized weather datasets.
              </p>
            </div>
            <button
              onClick={toggleDemoMode}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                demoMode ? 'bg-amber-500' : 'bg-primary'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  demoMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Abstraction Providers Card */}
        <div className="p-6 rounded-3xl border border-border bg-surface space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/50">
            <Sliders className="w-4 h-4 text-secondary" />
            <h3 className="font-heading font-semibold text-sm text-text-primary">Backend Provider Abstractions</h3>
          </div>

          <div className="space-y-4">
            <Select
              label="Generative AI & RAG Backend"
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              options={[
                { value: 'demo', label: 'Deterministic Demo Adapter (Offline Zero-Latency)' },
                { value: 'openai', label: 'OpenAI GPT-4o-mini / Text-Embedding-3' },
                { value: 'gemini', label: 'Google Gemini 1.5 Flash' },
                { value: 'claude', label: 'Anthropic Claude 3.5 Sonnet' },
                { value: 'ollama', label: 'Local Ollama (Llama 3.2 3B)' },
              ]}
            />

            <Select
              label="Meteorological Weather Telemetry"
              value={weatherProvider}
              onChange={(e) => setWeatherProvider(e.target.value)}
              options={[
                { value: 'demo', label: 'Synthetic Microclimate Simulator (Default)' },
                { value: 'openweather', label: 'OpenWeatherMap API v3.0' },
                { value: 'weatherapi', label: 'WeatherAPI.com Live Telemetry' },
              ]}
            />

            <Select
              label="Leaf Image Storage Provider"
              value={storageProvider}
              onChange={(e) => setStorageProvider(e.target.value)}
              options={[
                { value: 'local', label: 'Local Development Storage (/uploads)' },
                { value: 's3', label: 'Amazon S3 / MinIO Object Storage' },
                { value: 'cloudinary', label: 'Cloudinary CDN' },
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" icon={Save} onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};
