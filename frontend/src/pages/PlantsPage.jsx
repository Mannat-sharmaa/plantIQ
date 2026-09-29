import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Plus, Calendar, Activity, ChevronRight, Clock } from 'lucide-react';
import { plantsService } from '../services/api';
import { SeverityBadge, Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const PlantsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlant, setNewPlant] = useState({ name: '', species: '', notes: '' });

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await plantsService.getPlants();
        setPlants(data);
      } catch (err) {
        console.error('Failed to load plant profiles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  const handleCreatePlant = async (e) => {
    e.preventDefault();
    if (!newPlant.name) return;

    try {
      const created = await plantsService.createPlant(newPlant);
      setPlants([...plants, created]);
      setIsAddModalOpen(false);
      setNewPlant({ name: '', species: '', notes: '' });
      addToast({
        title: 'Plant Profile Created',
        message: `${created.name} added to your monitored agricultural catalog.`,
        type: 'success'
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading monitored crops..." />;
  }

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
              Monitored Plant Profiles
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Organize individual crop batches, track progression over time, and compare multi-scan timelines.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
          className="font-heading font-semibold"
        >
          Add Monitored Plant
        </Button>
      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <motion.div
            key={plant.id}
            whileHover={{ y: -4 }}
            className="rounded-3xl border border-border bg-surface p-5 flex flex-col justify-between hover:border-primary/40 transition-all shadow-sm"
          >
            <div>
              {/* Photo & Status */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/60 bg-black/40 mb-4">
                <img
                  src={plant.photoUrl}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  <SeverityBadge severity={plant.latestSeverity} affectedPercentage={plant.latestAffectedArea} />
                </div>
              </div>

              {/* Title & Species */}
              <h3 className="font-heading font-bold text-base text-text-primary">{plant.name}</h3>
              <p className="text-xs font-mono text-text-muted italic">{plant.species}</p>
              {plant.notes && (
                <p className="text-xs text-text-dark mt-2 leading-relaxed line-clamp-2">{plant.notes}</p>
              )}

              {/* Scan Stats Bar (Section 28) */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-surface-light border border-border/50 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-text-muted block">FIRST SCAN</span>
                  <span className="font-mono text-text-primary">{plant.firstScan}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-text-muted block">LATEST SCAN</span>
                  <span className="font-mono text-text-primary">{plant.latestScan}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-text-muted block">TOTAL SCANS</span>
                  <span className="font-mono font-bold text-primary">{plant.totalScans}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-text-muted block">LATEST STATUS</span>
                  <span className="font-semibold text-text-primary truncate block">{plant.latestDisease}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between">
              <button
                onClick={() => navigate(`/plants/${plant.id}/timeline`)}
                className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Health Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <Button
                size="sm"
                variant="subtle"
                onClick={() => navigate('/scan')}
              >
                Scan Now
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Plant Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Plant Specimen"
        subtitle="Create a persistent profile to track foliar health over time."
      >
        <form onSubmit={handleCreatePlant} className="space-y-4">
          <Input
            label="Plant / Crop Identifier"
            placeholder="e.g. Tomato Greenhouse Bed #04"
            value={newPlant.name}
            onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
            required
          />

          <Input
            label="Scientific Species (Optional)"
            placeholder="e.g. Solanum lycopersicum"
            value={newPlant.species}
            onChange={(e) => setNewPlant({ ...newPlant, species: e.target.value })}
          />

          <Input
            label="Cultivation Notes / Location"
            placeholder="e.g. Row 2, North quadrant under drip irrigation"
            value={newPlant.notes}
            onChange={(e) => setNewPlant({ ...newPlant, notes: e.target.value })}
          />

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Plant
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
