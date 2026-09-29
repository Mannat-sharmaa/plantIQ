import React from 'react';
import { BarChart2, Cpu, HardDrive, Zap, Server } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { ChartCard } from '../../components/common/ChartCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export const AdminAnalyticsPage = () => {
  const latencyData = [
    { component: 'Validation', ms: 8 },
    { component: 'Preprocess', ms: 14 },
    { component: 'EfficientNet', ms: 42 },
    { component: 'U-Net Seg', ms: 78 },
    { component: 'Grad-CAM', ms: 35 },
    { component: 'RAG Retrieval', ms: 18 },
  ];

  return (
    <div className="space-y-6 text-left pb-12">
      <div className="pb-2 border-b border-secondary/20">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-purple-400" />
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            System Telemetry & Performance
          </h1>
        </div>
        <p className="text-xs text-text-muted mt-1">Inference latency benchmarks and resource utilization.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Mean Pipeline Latency" value={195} suffix=" ms" icon={Zap} purple />
        <StatCard title="GPU VRAM Allocation" value="3.4" suffix=" GB" icon={Cpu} subvalue="NVIDIA CUDA" />
        <StatCard title="Worker Threads" value={8} icon={Server} subvalue="Uvicorn Gunicorn" />
        <StatCard title="Cache Hit Ratio" value={91.4} suffix="%" icon={HardDrive} />
      </div>

      <ChartCard
        title="Inference Step Latency Breakdown (Milliseconds)"
        subtitle="Timing analysis of each neural pipeline component"
        className="border-secondary/20 bg-[#0e0f18]"
      >
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={latencyData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="component" stroke="#64748b" fontSize={11} />
              <YAxis unit=" ms" stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0e0f18', borderColor: '#8b5cf6', fontSize: '12px' }} />
              <Bar dataKey="ms" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};
