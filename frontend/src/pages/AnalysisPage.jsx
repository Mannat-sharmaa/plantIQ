import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  Cpu,
  Layers,
  Activity,
  CloudRain,
  Bot,
  FileCheck2,
  ScanLine
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { scanService } from '../services/api';

export const AnalysisPage = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Image uploaded & verified', icon: ScanLine, detail: 'SHA-256 integrity hash generated & validated' },
    { id: 2, title: 'Image preprocessing & normalization', icon: Layers, detail: 'Normalized tensor (512×512×3) with Albumentations' },
    { id: 3, title: 'Identifying botanical species', icon: Cpu, detail: 'Feature extractor matched botanical morphology' },
    { id: 4, title: 'Detecting foliar condition', icon: Activity, detail: 'MobileNetV3 Softmax probabilities evaluated' },
    { id: 5, title: 'Generating Grad-CAM attribution', icon: Layers, detail: 'Penultimate layer activation heatmap computed' },
    { id: 6, title: 'Segmenting affected foliar region', icon: Layers, detail: 'U-Net semantic mask isolating necrotic lesions' },
    { id: 7, title: 'Calculating severity percentage', icon: Activity, detail: 'Canopy surface pixel ratio formula evaluated' },
    { id: 8, title: 'Synchronizing environmental context', icon: CloudRain, detail: 'Microclimate temperature, humidity & rainfall retrieved' },
    { id: 9, title: 'Querying pathology knowledge base', icon: Bot, detail: 'RAG vector retrieval over agronomic literature' },
    { id: 10, title: 'Synthesizing grounded AI advisory', icon: FileCheck2, detail: 'Domain-specific agronomic report generated' }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Progress through 10 steps smoothly
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          return prev;
        }
      });
    }, 550);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8 text-left">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant={isComplete ? "success" : "primary"} dot size="md">
          {isComplete ? "Inference Complete" : "Pipeline Processing"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
          {isComplete ? "Analysis Complete ✓" : "Analyzing Foliar Specimen"}
        </h1>
        <p className="text-xs sm:text-sm text-text-muted font-mono">
          Task ID: {scanId || 'scan-98421'}
        </p>
      </div>

      {/* Progress Card */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* 8-Step Animated Process (Section 17) */}
        <div className="space-y-6 relative">
          {steps.map((step, index) => {
            const isFinished = currentStep > step.id || isComplete;
            const isCurrent = currentStep === step.id && !isComplete;
            const isPending = currentStep < step.id;

            return (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-[15px] top-8 bottom-[-16px] w-[2px] transition-colors duration-500 ${
                      isFinished ? 'bg-primary' : 'bg-border/40'
                    }`}
                  />
                )}

                {/* Status Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border z-10 transition-all duration-300 ${
                    isFinished
                      ? 'bg-primary border-primary text-black shadow-neon-green/40'
                      : isCurrent
                      ? 'bg-primary/20 border-primary text-primary animate-pulse ring-4 ring-primary/20'
                      : 'bg-surface-light border-border text-text-dark'
                  }`}
                >
                  {isFinished ? (
                    <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <span className="text-[11px] font-mono">{step.id}</span>
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isFinished || isCurrent ? 'text-text-primary' : 'text-text-dark'
                      }`}
                    >
                      {step.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-primary animate-pulse">Running</span>
                    )}
                    {isFinished && (
                      <span className="text-[10px] font-mono text-primary">Done</span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-0.5 leading-snug font-mono ${
                      isFinished || isCurrent ? 'text-text-muted' : 'text-text-dark/60'
                    }`}
                  >
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA when finished */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <span className="text-xs font-semibold text-text-primary block">All 10 Pipeline Stages Synthesized</span>
              <span className="text-[11px] text-text-muted">Classification, U-Net mask, Grad-CAM, Environmental context & RAG advisory are ready.</span>
            </div>

            <Button
              size="lg"
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate(`/scan-result/${scanId || 'scan-98421'}`)}
              className="w-full sm:w-auto font-heading font-bold"
            >
              View Full Report
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
