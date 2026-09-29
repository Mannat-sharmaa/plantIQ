import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ScanLine,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CloudRain,
  Wind,
  Droplets,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { ChartCard } from '../components/common/ChartCard';
import { Button } from '../components/common/Button';
import { Badge, SeverityBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DashboardPage = () => {
  const { user, demoMode } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getDashboardData();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return <LoadingSpinner label="Loading dashboard diagnostics..." />;
  }

  const { stats, recentScans = [], recentTimeline = [], environmentalSummary } = data || {};

  const diseasePieData = [
    { name: 'Late Blight', value: 184, color: '#ff4d6d' },
    { name: 'Early Blight', value: 142, color: '#ffb020' },
    { name: 'Leaf Spot', value: 98, color: '#8b5cf6' },
    { name: 'Healthy Baseline', value: 812, color: '#00ff88' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
              {getGreeting()}, {user?.name || 'Farmer'} 🌱
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Real-time multi-spectral overview and crop pathogen tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {demoMode && (
            <Badge variant="warning" size="sm" dot>
              Demo Simulation Mode
            </Badge>
          )}
          <Button
            size="md"
            variant="primary"
            icon={ScanLine}
            onClick={() => navigate('/scan')}
            className="font-heading font-semibold"
          >
            New Scan
          </Button>
        </div>
      </div>

      {/* Primary 4 Stat Cards (Section 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Scans"
          value={stats?.totalScans || 1428}
          icon={ScanLine}
          trend="+12%"
          trendPositive={true}
          glow
        />
        <StatCard
          title="Healthy Plants"
          value={stats?.healthyPlants || 812}
          icon={ShieldCheck}
          trend="+8%"
          trendPositive={true}
        />
        <StatCard
          title="Diseased Plants"
          value={stats?.diseasedPlants || 616}
          icon={AlertTriangle}
          trend="-3%"
          trendPositive={true}
        />
        <StatCard
          title="Avg Affected Area"
          value={stats?.avgAffectedArea || 16.4}
          suffix="%"
          icon={Activity}
          subvalue="Mean pixel ratio"
          purple
        />
      </div>

      {/* Main Grid: Disease Distribution & Environmental Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Disease Distribution Chart */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Pathogen Distribution"
            subtitle="Categorized across analyzed foliage specimens"
            action={
              <button
                onClick={() => navigate('/analytics')}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <span>Full Analytics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="w-full h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseasePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {diseasePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#111a15" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111a15',
                      borderColor: 'rgba(0,255,136,0.2)',
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

        {/* Right: Environmental Microclimate Card (Section 14 & 23) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-heading font-semibold text-sm text-text-primary">Microclimate Context</h3>
                </div>
                <Badge variant="info" size="sm">GPS Active</Badge>
              </div>

              <div className="mt-4">
                <span className="text-[11px] font-mono text-text-muted">LOCATION</span>
                <p className="text-sm font-semibold text-text-primary">
                  {environmentalSummary?.location || 'Ludhiana Agricultural Belt, Punjab'}
                </p>
              </div>

              {/* Weather indicators */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-surface-light border border-border/50">
                  <span className="text-[10px] text-text-dark font-mono block">TEMPERATURE</span>
                  <span className="text-lg font-bold font-mono text-text-primary">
                    {environmentalSummary?.temperatureC !== undefined && environmentalSummary?.temperatureC !== null
                      ? `${environmentalSummary.temperatureC}°C`
                      : '--'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-light border border-border/50">
                  <span className="text-[10px] text-text-dark font-mono block">HUMIDITY</span>
                  <span className="text-lg font-bold font-mono text-cyan-400">
                    {environmentalSummary?.humidityPercent !== undefined && environmentalSummary?.humidityPercent !== null
                      ? `${environmentalSummary.humidityPercent}%`
                      : '--'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-light border border-border/50">
                  <span className="text-[10px] text-text-dark font-mono block">PRECIPITATION</span>
                  <span className="text-lg font-bold font-mono text-text-primary">
                    {environmentalSummary?.rainfallMm !== undefined && environmentalSummary?.rainfallMm !== null
                      ? `${environmentalSummary.rainfallMm} mm`
                      : '--'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-light border border-border/50">
                  <span className="text-[10px] text-text-dark font-mono block">WIND SPEED</span>
                  <span className="text-lg font-bold font-mono text-text-primary">
                    {environmentalSummary?.windKmh !== undefined && environmentalSummary?.windKmh !== null
                      ? `${environmentalSummary.windKmh} km/h`
                      : '--'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-text-muted leading-relaxed">
              <span className="text-amber-400 font-semibold block mb-0.5">⚠️ Epidemiological Alert:</span>
              {environmentalSummary?.riskFactor || "Elevated humidity and ambient temps favor fungal zoospore proliferation."}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans Table / Grid (Section 14) */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div>
            <h3 className="font-heading font-semibold text-base text-text-primary">Recent Foliar Scans</h3>
            <p className="text-xs text-text-muted">Direct output from computer vision and segmentation pipelines</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/history')}
          >
            View All Scans
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {recentScans.map((scan) => (
            <motion.div
              key={scan.id}
              whileHover={{ y: -3 }}
              onClick={() => navigate(`/scan-result/${scan.id}`)}
              className="rounded-xl border border-border bg-surface-light/50 p-3.5 hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-border/50 bg-black/40 mb-3">
                  <img
                    src={scan.imageUrl}
                    alt={scan.plantName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 border border-white/10 text-primary">
                      {((scan.confidence || 0.94) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-text-primary truncate">{scan.plantName}</span>
                </div>
                <div className="font-mono text-xs text-text-muted mb-2">{scan.disease}</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                <SeverityBadge severity={scan.severity} affectedPercentage={scan.segmentation?.affectedPercentage} />
                <span className="text-[10px] text-text-dark">
                  {new Date(scan.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
