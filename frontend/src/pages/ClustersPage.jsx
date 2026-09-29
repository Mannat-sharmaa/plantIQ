import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Network,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { analyticsService } from '../services/api';
import { ChartCard } from '../components/common/ChartCard';
import { Badge } from '../components/common/Badge';
import { GlassCard } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ClustersPage = () => {
  const [clusteringData, setClusteringData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState(null);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await analyticsService.getClusters();
        setClusteringData(res);
      } catch (err) {
        console.error('Failed to load clusters:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClusters();
  }, []);

  if (loading || !clusteringData) {
    return <LoadingSpinner label="Computing high-dimensional PCA projection..." />;
  }

  const { description, clusters = [] } = clusteringData;

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
              Visual Pattern Discovery
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Unsupervised K-Means clustering on penultimate convolutional layer latent vectors (1,792-D projected to 2D PCA).
          </p>
        </div>

        <Badge variant="primary" dot size="sm">
          Unsupervised Latent Space
        </Badge>
      </div>

      {/* Critical Scientific Rule Callout (Section 31) */}
      <div className="p-4 rounded-2xl bg-surface-light border border-border flex items-start gap-3 text-xs text-text-muted leading-relaxed">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-text-primary block">Exploratory Analysis Disclaimer:</span>
          <p className="mt-0.5">
            Clustering groupings represent morphological similarity in image feature embeddings, not biological ground-truth classifications. Labels such as "Spot patterns" or "Blight-like" are exploratory descriptions designed to uncover atypical anomalies and novel phenotypic patterns.
          </p>
        </div>
      </div>

      {/* 2D Scatter Chart (Section 31) */}
      <ChartCard
        title="2D Principal Component Projection (PCA)"
        subtitle="Latent vector space representation showing natural cluster separations"
        disclaimer="Clusters derived via K-Means (K=4) evaluated with Silhouette Score = 0.68."
      >
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                type="number"
                dataKey="x"
                name="Principal Component 1"
                unit=""
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Principal Component 2"
                unit=""
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#111a15',
                  borderColor: 'rgba(0,255,136,0.3)',
                  borderRadius: '0.75rem',
                  fontSize: '12px'
                }}
                formatter={(value, name, item) => [
                  `${item.payload.sampleId} (${item.payload.status}) - Conf: ${(item.payload.confidence * 100).toFixed(0)}%`,
                  'Specimen'
                ]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />

              {clusters.map((cluster) => (
                <Scatter
                  key={cluster.id}
                  name={`${cluster.label} (${cluster.pointsCount} leaves)`}
                  data={cluster.points}
                  fill={cluster.color}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Cluster Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clusters.map((cluster) => (
          <motion.div
            key={cluster.id}
            whileHover={{ y: -3 }}
            onClick={() => setSelectedCluster(cluster)}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cluster.color }}
                />
                <span className="font-mono text-xs text-text-muted">{cluster.pointsCount} specimens</span>
              </div>

              <h4 className="font-heading font-semibold text-sm text-text-primary">{cluster.label}</h4>
              <p className="text-[11px] font-mono text-text-muted mt-0.5">{cluster.name}</p>
              <p className="text-xs text-text-dark mt-2 leading-relaxed">{cluster.characteristics}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 text-[11px] font-medium text-primary flex items-center justify-between">
              <span>View cluster samples</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
