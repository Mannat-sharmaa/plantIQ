import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  History,
  Search,
  Filter,
  Eye,
  Calendar,
  ArrowUpDown,
  Download,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { scanService } from '../services/api';
import { SeverityBadge, Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { LoadingSpinner, EmptyState } from '../components/common/LoadingSpinner';

export const HistoryPage = () => {
  const navigate = useNavigate();

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, healthy, diseased, high_severity

  useEffect(() => {
    const fetchScans = async () => {
      setLoading(true);
      try {
        const data = await scanService.getScans(activeFilter);
        setScans(data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, [activeFilter]);

  const filteredScans = scans.filter((scan) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      scan.plantName.toLowerCase().includes(query) ||
      scan.disease.toLowerCase().includes(query) ||
      (scan.id && scan.id.toLowerCase().includes(query))
    );
  });

  const filterTabs = [
    { id: 'all', label: 'All Scans' },
    { id: 'healthy', label: 'Healthy Baseline' },
    { id: 'diseased', label: 'Diseased Foliage' },
    { id: 'high_severity', label: 'High & Critical' },
  ];

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
              Foliar Scan History
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Historical diagnostic records, model predictions, and segmented severity data.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          icon={Download}
          onClick={() => alert('Exporting CSV historical log...')}
        >
          Export CSV
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-light border border-border w-full md:w-auto overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-primary text-black font-semibold shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Search by plant or disease..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scans Table (Section 27) */}
      {loading ? (
        <LoadingSpinner label="Fetching records from database..." />
      ) : filteredScans.length === 0 ? (
        <EmptyState
          title="No scan records found"
          description="Try selecting a different filter or run a new plant scan."
          actionLabel="Scan New Plant"
          onAction={() => navigate('/scan')}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-light/80 border-b border-border/60 text-text-muted font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Date / Time</th>
                  <th className="py-3.5 px-4">Specimen Leaf</th>
                  <th className="py-3.5 px-4">Plant Species</th>
                  <th className="py-3.5 px-4">Predicted Pathogen</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Affected Area</th>
                  <th className="py-3.5 px-4">Severity Tier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredScans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-surface-light/40 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/scan-result/${scan.id}`)}
                  >
                    <td className="py-3.5 px-4 font-mono text-text-muted">
                      {new Date(scan.createdAt).toLocaleDateString()}{' '}
                      <span className="text-[10px] text-text-dark block">
                        {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-border/60 bg-black/40">
                        <img
                          src={scan.imageUrl}
                          alt={scan.plantName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-text-primary">
                      {scan.plantName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={scan.disease.toLowerCase() === 'healthy' ? 'text-primary font-semibold' : 'text-rose-400 font-semibold'}>
                        {scan.disease}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-text-primary">
                      {((scan.confidence || 0.94) * 100).toFixed(1)}%
                    </td>

                    <td className="py-3.5 px-4 font-mono text-text-muted">
                      {scan.segmentation?.affectedPercentage || 0}%
                    </td>

                    <td className="py-3.5 px-4">
                      <SeverityBadge severity={scan.severity} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="subtle"
                        icon={Eye}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/scan-result/${scan.id}`);
                        }}
                      >
                        Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
