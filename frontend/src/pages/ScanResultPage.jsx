import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Cpu,
  Activity,
  CloudRain,
  Bot,
  AlertTriangle,
  CheckCircle2,
  BookmarkPlus,
  Eye,
  Info,
  ShieldCheck,
  BookOpen,
  X
} from 'lucide-react';
import { scanService } from '../services/api';
import { ConfidenceRing, ProgressBar } from '../components/common/ConfidenceRing';
import { SeverityBadge, Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const ScanResultPage = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVisionTab, setActiveVisionTab] = useState('overlay'); // original, segmentation, gradcam, overlay
  const [showSourcesModal, setShowSourcesModal] = useState(false);

  useEffect(() => {
    const fetchScanData = async () => {
      try {
        const data = await scanService.getScan(scanId || 'scan-98421');
        setScan(data);
      } catch (err) {
        console.error('Failed to load scan diagnostics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScanData();
  }, [scanId]);

  if (loading || !scan) {
    return <LoadingSpinner label="Compiling multi-spectral diagnosis..." />;
  }

  const {
    plantName = 'Botanical Specimen',
    plantScientific,
    disease = 'Undetermined Condition',
    pathogen,
    confidence = 0,
    confidenceLevel,
    topPredictions = [],
    segmentation = {},
    severity = 'Undetermined',
    severityThresholdRange,
    severityDisclaimer = 'Image-based severity estimate',
    explainability = {},
    environmentalContext = {},
    aiHealthReport = {},
    rag = {},
    metadata = {},
    imageUrl,
    modelVersion = 'MobileNetV3-Small (PlantVillage 38-class)',
    status = 'success',
    message = null,
    modelStatus = scan.model_status || null,
    isSupported = scan.is_supported !== undefined ? scan.is_supported : true
  } = scan;

  const isModelUnavailable = status === 'model_unavailable' || modelStatus?.mode === 'model_unavailable';
  const isUnsupportedPlant = !isSupported || status === 'unsupported_or_low_confidence' ||
    plantName.toLowerCase().includes('unknown') ||
    plantName.toLowerCase().includes('not supported') ||
    disease.toLowerCase().includes('not supported');
  const isLowConfidence = confidence < 0.50;
  const isModerateConfidence = confidence >= 0.50 && confidence < 0.80;
  const isDemoMode = metadata?.mode === 'demo';

  return (
    <div className="space-y-8 text-left pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="primary" dot size="sm">DIAGNOSTIC REPORT</Badge>
            <span className="text-text-dark font-mono">•</span>
            <span className="font-mono text-xs text-text-muted">ID: {scanId}</span>
            <span className="text-text-dark font-mono">•</span>
            {isModelUnavailable ? (
              <Badge variant="warning" size="sm">MODEL OFFLINE</Badge>
            ) : isUnsupportedPlant ? (
              <Badge variant="outline" size="sm">OUT-OF-DOMAIN SPECIMEN</Badge>
            ) : isDemoMode ? (
              <Badge variant="warning" size="sm">DEMO BENCHMARK</Badge>
            ) : (
              <Badge variant="success" size="sm">LIVE PRODUCTION MODEL</Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight mt-1">
            Plant Health Intelligence Summary
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            icon={BookmarkPlus}
            onClick={() => addToast({ title: 'Specimen Saved', message: 'Added to your monitored plant catalog.', type: 'success' })}
          >
            Save Specimen
          </Button>

          <Button
            size="sm"
            variant="primary"
            icon={Bot}
            onClick={() => navigate('/assistant', { state: { scanContext: scan } })}
            className="font-heading font-semibold"
          >
            Ask AI Assistant
          </Button>
        </div>
      </div>

      {/* Model Not Configured Banner (Section 3) */}
      {isModelUnavailable && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 text-xs text-amber-200 shadow-lg">
          <AlertTriangle className="w-6 h-6 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="warning" size="sm">MODEL NOT CONFIGURED</Badge>
              <span className="font-heading font-bold text-sm text-text-primary">PyTorch Checkpoint Required</span>
            </div>
            <p className="text-text-muted leading-relaxed">
              Connect a trained Plant Disease Classification model to enable real inference. Fake or simulated predictions are strictly disabled.
            </p>
          </div>
        </div>
      )}

      {/* Unsupported Species Banner (Section 2) */}
      {!isModelUnavailable && isUnsupportedPlant && (
        <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-3.5 text-xs text-sky-200 shadow-lg">
          <Info className="w-6 h-6 shrink-0 text-sky-400 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="info" size="sm">SPECIES OUT OF DOMAIN</Badge>
              <span className="font-heading font-bold text-sm text-text-primary">Plant / Specimen Not Supported by Current Model</span>
            </div>
            <p className="text-text-muted leading-relaxed">
              The uploaded foliar specimen does not match any of the 38 agricultural crop classes supported by this model (Supported: Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato). Non-indexed flora such as Guava cannot be reliably identified by this model. To maintain scientific integrity, arbitrary disease predictions and chemical advisories are suppressed.
            </p>
          </div>
        </div>
      )}

      {/* Confidence Warning Banners (Section 4 & 18) */}
      {!isModelUnavailable && !isUnsupportedPlant && isLowConfidence && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <span className="font-semibold block text-sm">Low Model Confidence ({(confidence * 100).toFixed(1)}%)</span>
            <p className="mt-0.5 leading-relaxed">
              Model confidence is below the 50% diagnostic threshold. Low confidence — species or condition uncertain. PlantIQ strictly adheres to scientific integrity and does not force an artificial disease classification. Please re-scan with a clearer, well-lit image isolating the leaf margin.
            </p>
          </div>
        </div>
      )}

      {!isModelUnavailable && !isUnsupportedPlant && isModerateConfidence && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-300">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold block text-sm">Moderate Confidence Diagnosis ({(confidence * 100).toFixed(1)}%)</span>
            <p className="mt-0.5 leading-relaxed">
              Prediction confidence is between 50% and 80%. Visual symptoms overlap with related foliar conditions. Inspect the Grad-CAM saliency map and environmental risk factors below for corroborating evidence.
            </p>
          </div>
        </div>
      )}

      {/* TOP SUMMARY CARDS (Section 19) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Plant & Pathogen Card */}
        <div className="md:col-span-4 rounded-3xl border border-border bg-surface p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-mono text-text-muted uppercase">Detected Specimen</span>
            <h2 className="text-2xl font-heading font-bold text-text-primary mt-1">{plantName}</h2>
            <p className="text-xs text-text-muted font-mono mt-0.5">
              {plantScientific || `${plantName} specimen`}
            </p>

            <div className="mt-6 pt-5 border-t border-border/50">
              <span className="text-[11px] font-mono text-text-muted uppercase">Primary Diagnosis</span>
              <div className="flex items-center gap-2 mt-1">
                <h3 className={`text-xl font-heading font-bold ${disease.toLowerCase().includes('healthy') ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {disease}
                </h3>
              </div>
              <p className="text-xs text-text-muted italic mt-0.5">
                {pathogen && pathogen !== 'None'
                  ? pathogen
                  : (disease.toLowerCase().includes('healthy') ? 'No pathogen detected (healthy tissue)' : 'Pathogen taxonomy unconfirmed')}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs text-text-muted">Model Backbone</span>
            <span className="text-xs font-mono text-primary font-semibold">{modelStatus?.model_name || modelVersion}</span>
          </div>
        </div>

        {/* Confidence Ring Card (Section 4: Model confidence, not certainty) */}
        <div className="md:col-span-4 rounded-3xl border border-border bg-surface p-6 flex flex-col items-center justify-center shadow-sm">
          <ConfidenceRing
            value={confidence}
            size={140}
            strokeWidth={12}
            label="Model confidence"
            sublabel={isLowConfidence ? "Low confidence — species or condition uncertain" : `${confidenceLevel || 'Normal'} Softmax Probability`}
          />
        </div>

        {/* Top Predictions Multi-Bar Card (Section 18) */}
        <div className="md:col-span-4 rounded-3xl border border-border bg-surface p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-heading font-semibold text-text-primary">Top Softmax Predictions</h4>
              <span className="text-[10px] font-mono text-text-muted">K={topPredictions.length || 1}</span>
            </div>

            <div className="space-y-3.5">
              {topPredictions.length > 0 ? (
                topPredictions.map((pred, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-text-primary truncate max-w-[190px]">{pred.label}</span>
                      <span className="font-mono text-text-muted">{(pred.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <ProgressBar
                      value={pred.confidence * 100}
                      color={i === 0 ? (disease.toLowerCase().includes('healthy') ? "bg-emerald-400" : "bg-primary") : "bg-purple-500/70"}
                      height="h-1.5"
                    />
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted font-mono">No alternative candidates evaluated.</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-text-dark">
            Probabilities calculated from model output logits via Softmax.
          </div>
        </div>
      </div>

      {/* MODEL STATUS (TECHNICAL INFO CARD - Section 7) */}
      <div className="rounded-3xl border border-border/80 bg-surface/90 p-5 sm:p-6 shadow-md backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-sm sm:text-base text-text-primary">
                  Model Status & Diagnostic Telemetry
                </h3>
                <span className={`w-2 h-2 rounded-full ${isModelUnavailable ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
              </div>
              <p className="text-[11px] text-text-muted">
                Live neural network verification and pipeline runtime metrics
              </p>
            </div>
          </div>
          <Badge variant={isModelUnavailable ? "warning" : "success"} size="sm">
            {isModelUnavailable ? "Disconnected" : "Connected / Running"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-xs">
          <div className="p-3 rounded-xl bg-surface-light border border-border/50">
            <span className="text-[10px] font-mono text-text-muted block uppercase">Model Name</span>
            <span className="font-mono font-semibold text-text-primary mt-0.5 block truncate">
              {modelStatus?.model_name || "MobileNetV3-PlantVillage"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-light border border-border/50">
            <span className="text-[10px] font-mono text-text-muted block uppercase">Model Version</span>
            <span className="font-mono font-semibold text-primary mt-0.5 block">
              {modelStatus?.model_version || "v1.0.0"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-light border border-border/50">
            <span className="text-[10px] font-mono text-text-muted block uppercase">Inference Mode</span>
            <span className="font-mono font-semibold text-text-primary mt-0.5 block truncate">
              {modelStatus?.inference_type || "Real inference / PyTorch"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-light border border-border/50">
            <span className="text-[10px] font-mono text-text-muted block uppercase">Status</span>
            <span className={`font-mono font-semibold ${isModelUnavailable ? 'text-amber-400' : 'text-emerald-400'} mt-0.5 block`}>
              {isModelUnavailable ? "Offline / Not Configured" : "Connected / Running"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-light border border-border/50 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-text-muted block uppercase">Classes</span>
            <span className="font-mono font-semibold text-text-primary mt-0.5 block">
              {modelStatus?.classes_count || 38} crop disease classes
            </span>
          </div>
        </div>
      </div>

      {/* MULTI-SPECTRAL VISION STUDIO (Sections 20, 21, 22) */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/50 gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-1">Computer Vision Suite</Badge>
            <h3 className="text-xl font-heading font-bold text-text-primary">
              Visual Intelligence Studio
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Inspect multi-channel inference outputs: original foliage, U-Net semantic lesion mask, and Grad-CAM saliency.
            </p>
          </div>

          {/* Vision mode selector tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-light border border-border flex-wrap">
            {[
              { id: 'overlay', label: 'Overlay Composite' },
              { id: 'original', label: 'Original' },
              { id: 'segmentation', label: 'U-Net Mask' },
              { id: 'gradcam', label: 'Grad-CAM XAI' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveVisionTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeVisionTab === tab.id
                    ? 'bg-primary text-black font-semibold shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
          {/* Main Visual Display */}
          <div className="lg:col-span-7 relative aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden border border-border/80 bg-black/60 shadow-2xl flex items-center justify-center">
            {activeVisionTab === 'original' && (
              <img
                src={imageUrl}
                alt="Leaf Specimen"
                className="w-full h-full object-cover"
              />
            )}

            {activeVisionTab === 'segmentation' && (
              segmentation.maskUrl ? (
                <img
                  src={segmentation.maskUrl}
                  alt="Semantic Segmentation Mask"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <Layers className="w-10 h-10 text-text-muted stroke-[1.5]" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Segmentation Mask Unavailable</p>
                    <p className="text-xs text-text-muted mt-1 max-w-sm">
                      Semantic foliar segmentation could not isolate necrotic margins on this image.
                    </p>
                  </div>
                </div>
              )
            )}

            {activeVisionTab === 'gradcam' && (
              explainability.heatmapUrl ? (
                <img
                  src={explainability.heatmapUrl}
                  alt="Grad-CAM Saliency Map"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <Sparkles className="w-10 h-10 text-text-muted stroke-[1.5]" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Explainability Heatmap Unavailable</p>
                    <p className="text-xs text-text-muted mt-1 max-w-sm">
                      Saliency gradient tensor was not captured for this inference run.
                    </p>
                  </div>
                </div>
              )
            )}

            {activeVisionTab === 'overlay' && (
              segmentation.overlayUrl ? (
                <img
                  src={segmentation.overlayUrl}
                  alt="Foliar Overlay"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={imageUrl}
                  alt="Leaf Specimen"
                  className="w-full h-full object-cover"
                />
              )
            )}

            {/* Channel HUD Overlay */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs font-mono text-text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>CHANNEL: {activeVisionTab.toUpperCase()}</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs font-mono text-primary">
              RESOLUTION: 512×512 TENSOR
            </div>
          </div>

          {/* Right Metrics Panel */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* Affected Area / Severity Box (Section 20 & 21) */}
            <div className="p-5 rounded-2xl bg-surface-light border border-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-text-muted">Image-Based Severity</span>
                <SeverityBadge severity={severity} />
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-heading font-bold text-text-primary">
                    {segmentation.affectedPercentage !== null && segmentation.affectedPercentage !== undefined
                      ? `${Number(segmentation.affectedPercentage).toFixed(1)}%`
                      : 'N/A'}
                  </span>
                  <span className="text-xs text-text-muted">affected foliar surface</span>
                </div>
                <p className="text-[11px] text-text-dark font-mono mt-0.5">
                  Threshold standard: {severityThresholdRange || 'Adaptive tier'} ({severity} tier)
                </p>
              </div>

              <div className="pt-3 border-t border-border/50 text-[11px] text-text-muted space-y-1">
                <div className="flex justify-between">
                  <span>Necrotic Lesion Pixels:</span>
                  <span className="font-mono text-text-primary">
                    {segmentation.affectedPixels !== null && segmentation.affectedPixels !== undefined
                      ? `${segmentation.affectedPixels.toLocaleString()} px`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Analysed Leaf Pixels:</span>
                  <span className="font-mono text-text-primary">
                    {segmentation.totalLeafPixels !== null && segmentation.totalLeafPixels !== undefined
                      ? `${segmentation.totalLeafPixels.toLocaleString()} px`
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-text-dark italic pt-1 border-t border-border/40">
                Formula: (Affected Pixels / Total Leaf Pixels) × 100. {severityDisclaimer}
              </div>
            </div>

            {/* Explainable AI Note (Section 22) */}
            <div className="p-4 rounded-2xl bg-surface-light/40 border border-border text-xs space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Why did AI make this prediction?</span>
              </div>
              <p className="text-text-muted leading-relaxed text-[11px]">
                {explainability.summary || "Grad-CAM activation highlights distinctive morphological patterns and chlorotic/necrotic lesions across the leaf surface contributing to the classifier's prediction."}
              </p>
              <div className="text-[10px] text-text-dark italic">
                Notice: Visual saliency reflects feature correlation in penultimate layer ({explainability.targetLayer || 'features.stage7.unit1'}), not biological causation.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENVIRONMENTAL CONTEXT (Section 23) */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <CloudRain className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-heading font-semibold text-base text-text-primary">Environmental Microclimate Context</h3>
              <p className="text-xs text-text-muted">
                {environmentalContext.available
                  ? 'Retrieved meteorological parameters synchronized during leaf capture'
                  : 'Environmental telemetry unavailable for this specimen'}
              </p>
            </div>
          </div>
          <Badge variant={environmentalContext.available ? "info" : "outline"} size="sm">
            {environmentalContext.available ? "Weather Synchronized" : "Telemetry Unavailable"}
          </Badge>
        </div>

        {environmentalContext.available ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-surface-light border border-border/60">
                <span className="text-[10px] font-mono text-text-muted block">AMBIENT TEMP</span>
                <span className="text-2xl font-bold font-mono text-text-primary">
                  {environmentalContext.temperatureC !== null && environmentalContext.temperatureC !== undefined
                    ? `${environmentalContext.temperatureC}°C`
                    : '--'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-light border border-border/60">
                <span className="text-[10px] font-mono text-text-muted block">RELATIVE HUMIDITY</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {environmentalContext.humidityPercent !== null && environmentalContext.humidityPercent !== undefined
                    ? `${environmentalContext.humidityPercent}%`
                    : '--'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-light border border-border/60">
                <span className="text-[10px] font-mono text-text-muted block">RECENT RAINFALL</span>
                <span className="text-2xl font-bold font-mono text-text-primary">
                  {environmentalContext.rainfallMm !== null && environmentalContext.rainfallMm !== undefined
                    ? `${environmentalContext.rainfallMm} mm`
                    : '0.0 mm'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-light border border-border/60">
                <span className="text-[10px] font-mono text-text-muted block">CANOPY WIND</span>
                <span className="text-2xl font-bold font-mono text-text-primary">
                  {environmentalContext.windKmh !== null && environmentalContext.windKmh !== undefined
                    ? `${environmentalContext.windKmh} km/h`
                    : '--'}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-surface-light/40 border border-border text-xs text-text-muted flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <span className="font-semibold text-text-primary">Epidemiological Context: </span>
                {environmentalContext.riskFactor || "Ambient conditions evaluated against disease sporulation thresholds."}
              </p>
            </div>
          </>
        ) : (
          <div className="mt-6 p-6 rounded-2xl bg-surface-light/30 border border-border/60 text-center space-y-2">
            <p className="text-xs text-text-muted">
              Meteorological telemetry was not recorded during leaf capture. Ambient temperature, relative humidity, and rainfall sporulation risks require GPS coordinates or on-site station telemetry.
            </p>
            <div className="flex items-center justify-center gap-6 pt-2 font-mono text-xs text-text-dark">
              <span>TEMP: --</span>
              <span>HUMIDITY: --</span>
              <span>RAIN: --</span>
              <span>WIND: --</span>
            </div>
          </div>
        )}
      </div>

      {/* GROUNDED RAG AI HEALTH REPORT (Section 24 & 25) */}
      <div className="rounded-3xl border border-secondary/30 bg-[#0d1017] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/50 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-purple-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg text-text-primary">Grounded AI Agronomic Advisory</h3>
                <Badge variant={rag?.sources?.length > 0 ? "secondary" : "outline"} size="sm">
                  {rag?.sources?.length > 0 ? "RAG Knowledge Base" : "General Agronomy"}
                </Badge>
              </div>
              <p className="text-xs text-text-muted">
                {rag?.sources?.length > 0
                  ? `Synthesized using ${rag.sources.length} retrieved agronomic source(s)`
                  : 'Grounded in standard plant pathology disease management guidelines'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {rag?.sources?.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                icon={BookOpen}
                onClick={() => setShowSourcesModal(true)}
              >
                View Sources ({rag.sources.length})
              </Button>
            )}

            <Button
              size="sm"
              variant="secondary"
              icon={Bot}
              onClick={() => navigate('/assistant', { state: { scanContext: scan } })}
            >
              Chat with Assistant
            </Button>
          </div>
        </div>

        {/* 6 Report Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface/70 border border-border">
              <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-primary mb-1">
                1. What was detected?
              </h4>
              <p className="text-xs text-text-primary leading-relaxed">
                {aiHealthReport.detectedCondition || `${disease} identified on ${plantName}.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface/70 border border-border">
              <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-purple-300 mb-1">
                2. Visible Symptoms
              </h4>
              {aiHealthReport.visibleSymptoms && aiHealthReport.visibleSymptoms.length > 0 ? (
                <ul className="list-disc list-inside text-xs text-text-muted space-y-1">
                  {aiHealthReport.visibleSymptoms.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-text-muted">No localized visible symptoms specified.</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-surface/70 border border-border">
              <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-amber-300 mb-1">
                3. Contributing Environmental Conditions
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                {aiHealthReport.contributingFactors || "Environmental parameters evaluated during specimen capture."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface/70 border border-border">
              <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-primary mb-1">
                4. General Management Recommendations
              </h4>
              {aiHealthReport.managementGuidelines && aiHealthReport.managementGuidelines.length > 0 ? (
                <ul className="list-disc list-inside text-xs text-text-muted space-y-1">
                  {aiHealthReport.managementGuidelines.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-text-muted">Maintain standard crop care and hygienic cultivation protocols.</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-surface/70 border border-border">
              <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-emerald-400 mb-1">
                5. Preventative Measures
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                {aiHealthReport.prevention || "Implement preventative cultural practices, optimal plant spacing, and monitored irrigation."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface/70 border border-border">
              <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-rose-400 mb-1">
                6. When to Seek Expert Advice
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                {aiHealthReport.expertAdvisory || "Seek intervention from a local agronomy extension officer if foliar lesions spread across more than 25% of canopy."}
              </p>
            </div>
          </div>
        </div>

        {/* Ethical RAG Disclaimer (Section 2 & 24) */}
        <div className="mt-6 pt-4 border-t border-border/50 text-[11px] text-text-dark flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-purple-300">Scientific Distinction: </span>
            This AI-generated narrative synthesizes neural network predictions and retrieved pathology documents. It does not replace on-site plant pathology tissue culture or molecular lab diagnostics.
          </p>
        </div>
      </div>

      {/* RAG Sources Modal */}
      {showSourcesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0d1017] border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary/20 text-purple-300 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-text-primary">
                    Retrieved Pathology Knowledge Sources
                  </h3>
                  <p className="text-xs text-text-muted font-mono">
                    {rag?.sources?.length || 0} document chunk(s) retrieved via vector similarity
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSourcesModal(false)}
                className="text-text-muted hover:text-text-primary text-xl font-bold p-1 rounded-lg hover:bg-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {(rag?.sources || []).map((source, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-surface/70 border border-border space-y-2 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-text-primary">
                        {source.title}
                      </h4>
                      <p className="text-xs text-text-muted mt-0.5">
                        Source: <span className="text-purple-300 font-medium">{source.source}</span>
                      </p>
                    </div>
                    {source.similarity && (
                      <Badge variant="primary" size="sm" className="shrink-0 font-mono">
                        {(source.similarity * 100).toFixed(0)}% match
                      </Badge>
                    )}
                  </div>
                  {source.document_id && (
                    <span className="inline-block text-[10px] font-mono text-text-dark bg-surface px-2 py-0.5 rounded border border-border">
                      ID: {source.document_id}
                    </span>
                  )}
                  {source.content_excerpt && (
                    <p className="text-xs text-text-muted bg-surface-light/40 p-3 rounded-xl border border-border/50 leading-relaxed font-sans italic">
                      "{source.content_excerpt}"
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                variant="primary"
                onClick={() => setShowSourcesModal(false)}
              >
                Close Sources
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
