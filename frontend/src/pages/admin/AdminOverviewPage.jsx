import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  ScanLine,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { ChartCard } from '../../components/common/ChartCard';
import { Badge } from '../../components/common/Badge';

export const AdminOverviewPage = () => {
  const dailyScansData = [
    { day: 'Mon', scans: 142 },
    { day: 'Tue', scans: 198 },
    { day: 'Wed', scans: 245 },
    { day: 'Thu', scans: 210 },
    { day: 'Fri', scans: 320 },
    { day: 'Sat', scans: 410 },
    { day: 'Sun', scans: 380 },
  ];

  const userGrowthData = [
    { month: 'Jun', users: 180 },
    { month: 'Jul', users: 320 },
    { month: 'Aug', users: 590 },
    { month: 'Sep', users: 1120 },
  ];

  const confidenceDistData = [
    { range: '90-100%', count: 840, fill: '#00ff88' },
    { range: '80-90%', count: 380, fill: '#8b5cf6' },
    { range: '70-80%', count: 145, fill: '#ffb020' },
    { range: '<70%', count: 63, fill: '#ff4d6d' },
  ];

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-secondary/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Administrative Command Center
            </h1>
            <Badge variant="secondary" size="sm">Admin Role</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Global system health, active inference pipelines, user base, and model validation status.
          </p>
        </div>
      </div>

      {/* 4 Core Admin Stats (Section 39) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={1120}
          icon={Users}
          trend="+18%"
          purple
        />
        <StatCard
          title="Total Scans Processed"
          value={1428}
          icon={ScanLine}
          trend="+24%"
        />
        <StatCard
          title="Diseased Inferences"
          value={616}
          icon={AlertTriangle}
          subvalue="43.1% positive rate"
        />
        <StatCard
          title="Healthy Inferences"
          value={812}
          icon={ShieldCheck}
          subvalue="56.9% baseline"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Scans */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Weekly Inference Load"
            subtitle="Real-time daily image inference throughput"
            className="border-secondary/20 bg-[#0e0f18]"
          >
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyScansData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0e0f18', borderColor: '#8b5cf6', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="scans" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Confidence Distribution */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Model Confidence Distribution"
            subtitle="Entropy distribution across live classifications"
            className="border-secondary/20 bg-[#0e0f18]"
          >
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceDistData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0e0f18', borderColor: '#8b5cf6', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {confidenceDistData.map((c, i) => (
                      <Cell key={i} fill={c.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
