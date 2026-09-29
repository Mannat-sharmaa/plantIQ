import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Activity,
  CloudRain,
  ShieldAlert,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { analyticsService } from '../services/api';
import { ChartCard } from '../components/common/ChartCard';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return <LoadingSpinner label="Compiling aggregate pathology analytics..." />;
  }

  const { stats, diseaseDistribution, severityDistribution, scanTrends, environmentalCorrelation } = data;

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
              Pathology & Environmental Analytics
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Population-level epidemiological data, model certainty distributions, and microclimate correlations.
          </p>
        </div>

        <Badge variant="primary" dot size="sm">
          Analytics Pipeline Active
        </Badge>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Specimens"
          value={stats.totalScans}
          icon={Activity}
          subvalue="Validated Leaves"
        />
        <StatCard
          title="Model Accuracy Rate"
          value={stats.scanAccuracyRate}
          suffix="%"
          icon={TrendingUp}
          subvalue="Validation Split"
        />
        <StatCard
          title="Active Crop Units"
          value={stats.activeMonitoredPlants}
          icon={BarChart3}
          subvalue="Across 6 species"
        />
        <StatCard
          title="Mean Foliar Disruption"
          value={stats.avgAffectedArea}
          suffix="%"
          icon={CloudRain}
          purple
        />
      </div>

      {/* Charts Row 1: Disease Distribution & Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Disease Breakdown */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Foliar Pathogen Distribution"
            subtitle="Relative occurrence across total scanned leaf specimens"
          >
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseaseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {diseaseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#111a15" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111a15',
                      borderColor: 'rgba(0,255,136,0.3)',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Severity Distribution */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Severity Tier Breakdown"
            subtitle="Percentage of scans categorized by segmented affected leaf area"
          >
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityDistribution} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis unit="%" stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111a15',
                      borderColor: 'rgba(0,255,136,0.3)',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                    formatter={(val) => [`${val}% of scans`, 'Proportion']}
                  />
                  <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                    {severityDistribution.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Charts Row 2: Scan Volume & Environmental Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Longitudinal Monthly Scan Volume */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Monthly Diagnostic Volume"
            subtitle="Total scans performed and confirmed diseased instances"
          >
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scanTrends} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="totalScansGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="diseasedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4d6d" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff4d6d" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111a15',
                      borderColor: 'rgba(139,92,246,0.3)',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="scans" name="Total Scans" stroke="#8b5cf6" fill="url(#totalScansGrad)" />
                  <Area type="monotone" dataKey="diseased" name="Diseased Confirmed" stroke="#ff4d6d" fill="url(#diseasedGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Environmental Correlation (Section 30 requirement: Label observed association, not causation) */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Humidity vs Affected Area Association"
            subtitle="Mean segmented necrotic surface across relative humidity bands"
            disclaimer="⚠️ Important Scientific Note: Observed association, not proof of causation. Environmental parameters provide epidemiological context only."
          >
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={environmentalCorrelation} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis unit="%" stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111a15',
                      borderColor: 'rgba(0,255,136,0.3)',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                    formatter={(val) => [`${val}% avg affected leaf`, 'Necrotic Surface']}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgAffected"
                    stroke="#00ff88"
                    strokeWidth={3}
                    dot={{ fill: '#00ff88', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
