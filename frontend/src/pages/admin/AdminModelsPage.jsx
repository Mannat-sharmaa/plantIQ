import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { adminService } from '../../services/api';

export const AdminModelsPage = () => {
  const { addToast } = useToast();

  const [models, setModels] = useState([
    {
      id: 'mdl-v2-1',
      name: 'EfficientNet-B4_Classifier',
      version: 'v2.1.0',
      dataset: 'PlantVillage_v4.2 (54k images)',
      accuracy: '95.4%',
      f1Score: '0.949',
      status: 'ACTIVE',
      validationState: 'PASSED'
    },
    {
      id: 'mdl-v2-2-rc1',
      name: 'ResNet50_TransferClassifier',
      version: 'v2.2.0-rc1',
      dataset: 'Expanded Field Dataset (62k images)',
      accuracy: '96.1%',
      f1Score: '0.957',
      status: 'STAGED',
      validationState: 'PENDING_VALIDATION'
    }
  ]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedModelForDeploy, setSelectedModelForDeploy] = useState(null);

  const handleValidate = async (modelId) => {
    setIsValidating(true);
    try {
      await adminService.validateModel(modelId);
      setModels(models.map(m => m.id === modelId ? { ...m, validationState: 'PASSED' } : m));
      addToast({
        title: 'Validation Complete',
        message: 'Model passed test benchmark checks. Ready for deployment.',
        type: 'success'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleDeploy = async () => {
    if (!selectedModelForDeploy) return;
    setIsDeploying(true);
    try {
      await adminService.deployModel(selectedModelForDeploy.id);
      setModels(models.map(m => ({
        ...m,
        status: m.id === selectedModelForDeploy.id ? 'ACTIVE' : 'DEPRECATED'
      })));
      addToast({
        title: 'Model Activated in Production',
        message: `${selectedModelForDeploy.name} is now handling live inference requests.`,
        type: 'success'
      });
      setSelectedModelForDeploy(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-secondary/20">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Model Registry & MLOps Deployment
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Validate, benchmark, and deploy PyTorch neural weights to edge inference workers.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          icon={UploadCloud}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload New Model
        </Button>
      </div>

      {/* Model Lifecycle Pipeline Banner (Section 40) */}
      <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-between text-xs text-purple-200">
        <span className="font-semibold">Deployment Safety Workflow:</span>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-purple-300">1. Uploaded</span>
          <span>→</span>
          <span className="text-purple-300">2. Validate</span>
          <span>→</span>
          <span className="text-purple-300">3. Evaluate</span>
          <span>→</span>
          <span className="text-primary font-bold">4. Approve & Deploy</span>
        </div>
      </div>

      {/* Models Table */}
      <div className="rounded-2xl border border-secondary/20 bg-[#0e0f18] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-secondary/20 flex items-center justify-between">
          <h3 className="font-heading font-semibold text-sm text-white">Registered Inference Models</h3>
          <Badge variant="secondary" size="sm">{models.length} Versions</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151726] border-b border-secondary/20 text-purple-300 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Model Architecture</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Training Dataset</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Validation Status</th>
                <th className="py-3 px-4">Runtime State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/15">
              {models.map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{m.name}</td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">{m.version}</td>
                  <td className="py-3.5 px-4 text-text-muted">{m.dataset}</td>
                  <td className="py-3.5 px-4 font-mono text-primary font-bold">{m.accuracy}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={m.validationState === 'PASSED' ? 'success' : 'warning'} size="sm">
                      {m.validationState}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={m.status === 'ACTIVE' ? 'primary' : 'default'} dot size="sm">
                      {m.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {m.validationState !== 'PASSED' && (
                      <Button
                        size="sm"
                        variant="subtle"
                        isLoading={isValidating}
                        onClick={() => handleValidate(m.id)}
                      >
                        Run Validation
                      </Button>
                    )}
                    {m.status !== 'ACTIVE' && m.validationState === 'PASSED' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setSelectedModelForDeploy(m)}
                      >
                        Deploy
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deploy Confirmation Modal (Section 40) */}
      <Modal
        isOpen={!!selectedModelForDeploy}
        onClose={() => setSelectedModelForDeploy(null)}
        title="Confirm Production Deployment"
        subtitle="Caution: This will redirect live inference traffic to the new neural architecture."
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-400 inline mr-1" />
            <span className="font-semibold">Warning: </span>
            Deployment requires validated benchmark checks. Are you sure you want to promote{' '}
            <strong className="text-white">{selectedModelForDeploy?.name} ({selectedModelForDeploy?.version})</strong> to Active status?
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setSelectedModelForDeploy(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={isDeploying}
              onClick={handleDeploy}
            >
              Promote to Production
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Model Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload PyTorch Weights (.pt / .onnx)"
        subtitle="Register model metadata and weights for automated pipeline validation."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsUploadModalOpen(false);
            addToast({
              title: 'Weights Uploaded',
              message: 'Model artifact placed in /ml/models staging for validation.',
              type: 'info'
            });
          }}
          className="space-y-4 text-xs"
        >
          <Input label="Model Name" placeholder="e.g. SegFormer_B2_Foliar" required />
          <Input label="Semantic Version" placeholder="e.g. v2.3.0" required />
          <Input label="Training Dataset Identifier" placeholder="e.g. PlantVillage_Expanded_2026" required />
          
          <div className="p-4 border-2 border-dashed border-secondary/30 rounded-xl text-center cursor-pointer hover:border-secondary transition-colors">
            <UploadCloud className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <span className="text-text-muted">Select .pt, .pth, or .onnx weights file (Max 500MB)</span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary">
              Upload for Staging
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
