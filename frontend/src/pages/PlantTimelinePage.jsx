import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Activity,
  ArrowLeft,
  ScanLine,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { plantsService } from '../services/api';
import { TimelineNode } from '../components/common/TimelineNode';
import { ChartCard } from '../components/common/ChartCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const PlantTimelinePage = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plantData, timelineData] = await Promise.all([
          plantsService.getPlant(plantId || 'plant-tomato-01'),
          plantsService.getPlantTimeline(plantId || 'plant-tomato-01')
        ]);
        setPlant(plantData);
        setTimeline(timelineData);
      } catch (err) {
        console.error('Failed to load timeline:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [plantId]);

  if (loading || !plant) {
    return <LoadingSpinner label="Compiling longitudinal plant history..." />;
  }

  // Format data for Recharts AreaChart
  const chartData = timeline.map((item) => ({
    name: item.day,
    date: item.date,
    affectedArea: item.affectedPercentage,
    status: item.status
  }));

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header with back navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <button
            onClick={() => navigate('/plants')}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Monitored Plants</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
              {plant.name}
            </h1>
            <Badge variant="primary" size="sm">Longitudinal Record</Badge>
          </div>
          <p className="text-xs text-text-muted font-mono mt-0.5">{plant.species}</p>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={ScanLine}
          onClick={() => navigate('/scan')}
        >
          Add New Scan Node
        </Button>
      </div>

      {/* Progression Graph (Section 29) */}
      <ChartCard
        title="Foliar Lesion Progression Curve"
        subtitle="Mathematical percentage of necrotic leaf surface tracked across serial scans"
        disclaimer="Note: Progression curve is calculated strictly from segmented 2D leaf surface area and indicates visual symptom spread."
      >
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis unit="%" stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 40]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111a15',
                  borderColor: 'rgba(0,255,136,0.3)',
                  borderRadius: '0.75rem',
                  fontSize: '12px'
                }}
                formatter={(value) => [`${value}% affected surface`, 'Lesion Extent']}
              />
              <Area
                type="monotone"
                dataKey="affectedArea"
                stroke="#00ff88"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#areaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Serial Diagnostic Timeline Nodes (Section 29) */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="mb-6 pb-3 border-b border-border/50">
          <h3 className="font-heading font-semibold text-lg text-text-primary">Diagnostic Chronology</h3>
          <p className="text-xs text-text-muted mt-0.5">Sequential milestones from baseline inspection to current state</p>
        </div>

        <div className="space-y-2">
          {timeline.map((item, index) => (
            <TimelineNode
              key={item.day}
              item={item}
              index={index}
              isLast={index === timeline.length - 1}
              onSelectScan={(scanId) => navigate(`/scan-result/${scanId}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
