import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  Table,
  Zap,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { modelService } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { ChartCard } from '../components/common/ChartCard';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ModelPerformancePage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await modelService.getModels();
        setModels(data);
      } catch (err) {
        console.error('Failed to load models:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  if (loading || models.length === 0) {
    return <LoadingSpinner label="Loading model evaluation benchmarks..." />;
  }

  const classifier = models[0];
  const segmenter = models[1];

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
              Model Performance & Benchmark Metrics
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Empirical evaluation statistics, validation splits, and pixel-level segmentation scores.
          </p>
        </div>

        {/* Section 32 Mandatory Label */}
        <Badge variant="warning" dot size="sm">
          Validation Test Callset (Curated Benchmark)
        </Badge>
      </div>

      {/* Classification Primary Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="primary" size="sm">1. CLASSIFICATION ENGINE</Badge>
          <span className="text-xs font-mono text-text-muted">{classifier.architecture}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Top-1 Accuracy"
            value={(classifier.metrics.accuracy * 100).toFixed(1)}
            suffix="%"
            icon={CheckCircle2}
            subvalue="54,305 Test Split"
          />
          <StatCard
            title="Precision (Macro)"
            value={(classifier.metrics.precision * 100).toFixed(1)}
            suffix="%"
            icon={Activity}
          />
          <StatCard
            title="Recall (Sensitivity)"
            value={(classifier.metrics.recall * 100).toFixed(1)}
            suffix="%"
            icon={Zap}
          />
          <StatCard
            title="F1-Score (Harmonic)"
            value={(classifier.metrics.f1Score * 100).toFixed(1)}
            suffix="%"
            icon={Sparkles}
            purple
          />
        </div>
      </div>

      {/* Segmentation Metrics (Section 32) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" size="sm">2. SEMANTIC SEGMENTATION</Badge>
          <span className="text-xs font-mono text-text-muted">{segmenter.architecture}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Mean Intersection-over-Union (mIoU)"
            value={(segmenter.metrics.meanIoU * 100).toFixed(1)}
            suffix="%"
            icon={Layers}
            subvalue="Foliar Lesion Masks"
          />
          <StatCard
            title="Dice Similarity Coefficient"
            value={(segmenter.metrics.diceScore * 100).toFixed(1)}
            suffix="%"
            icon={Activity}
            subvalue="Pixel overlap"
          />
          <StatCard
            title="Pixel Accuracy"
            value={(segmenter.metrics.pixelAccuracy * 100).toFixed(1)}
            suffix="%"
            icon={CheckCircle2}
            purple
          />
        </div>
      </div>

      {/* Confusion Matrix Table (Section 32) */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="font-heading font-semibold text-base text-text-primary">
            Multi-Class Confusion Matrix (Validation Set)
          </h3>
          <p className="text-xs text-text-muted">
            Ground Truth vs Predicted classifications across 4 representative foliar categories
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead className="bg-surface-light border-b border-border/60 text-text-muted font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 text-left">Predicted \ Actual</th>
                <th className="py-3 px-4">Healthy</th>
                <th className="py-3 px-4">Early Blight</th>
                <th className="py-3 px-4">Late Blight</th>
                <th className="py-3 px-4">Leaf Spot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {classifier.confusionMatrix?.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-light/30">
                  <td className="py-3 px-4 font-sans font-semibold text-left text-text-primary">
                    {row.predicted}
                  </td>
                  <td className={`py-3 px-4 ${row.predicted === 'Healthy' ? 'bg-primary/10 text-primary font-bold' : 'text-text-muted'}`}>
                    {row.actualHealthy}
                  </td>
                  <td className={`py-3 px-4 ${row.predicted === 'Early Blight' ? 'bg-primary/10 text-primary font-bold' : 'text-text-muted'}`}>
                    {row.actualEarlyBlight}
                  </td>
                  <td className={`py-3 px-4 ${row.predicted === 'Late Blight' ? 'bg-primary/10 text-primary font-bold' : 'text-text-muted'}`}>
                    {row.actualLateBlight}
                  </td>
                  <td className={`py-3 px-4 ${row.predicted === 'Leaf Spot' ? 'bg-primary/10 text-primary font-bold' : 'text-text-muted'}`}>
                    {row.actualLeafSpot}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Architectures Info Cards (Section 33) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {models.map((m) => (
          <div key={m.id} className="p-5 rounded-2xl border border-border bg-surface flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">{m.type}</Badge>
                <span className="font-mono text-[10px] text-text-muted">{m.version}</span>
              </div>
              <h4 className="font-heading font-bold text-base text-text-primary">{m.name}</h4>
              <p className="text-xs text-text-muted leading-relaxed">{m.architecture}</p>
              
              <div className="space-y-1.5 pt-2 text-xs border-t border-border/50">
                <div className="flex justify-between">
                  <span className="text-text-dark">Framework:</span>
                  <span className="font-mono text-text-primary">{m.framework}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dark">Input Size:</span>
                  <span className="font-mono text-text-primary">{m.inputSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dark">Dataset:</span>
                  <span className="text-text-muted text-[11px] truncate max-w-[150px]">{m.dataset}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
              <span className="text-text-dark">Status:</span>
              <span className="font-mono text-primary font-semibold">Active in Production</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
