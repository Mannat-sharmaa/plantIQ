import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, MapPin, Sparkles, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { ImageUploader } from '../components/common/ImageUploader';
import { ImagePreview } from '../components/common/ImagePreview';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import { scanService } from '../services/api';

export const ScanPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState('requesting'); // requesting, granted, denied
  const [coordinates, setCoordinates] = useState(null);

  // Request browser location permission on mount (Section 1 & 23)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationStatus('granted');
          setCoordinates({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        (err) => {
          setLocationStatus('denied');
        },
        { timeout: 8000 }
      );
    } else {
      setLocationStatus('unsupported');
    }
  }, []);

  const handleImageSelected = (imageData) => {
    setSelectedImage(imageData);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      if (selectedImage.file) {
        formData.append('file', selectedImage.file);
      }
      if (coordinates) {
        formData.append('latitude', coordinates.latitude);
        formData.append('longitude', coordinates.longitude);
      }

      const response = await scanService.uploadAndScan(formData);
      const scanId = response.scanId || response.id || 'scan-98421';

      addToast({
        title: 'Image Uploaded Successfully',
        message: 'Neural inference and segmentation pipeline started.',
        type: 'success'
      });

      // Redirect to the 8-step animated analysis process page (Section 15 & 17)
      navigate(`/analysis/${scanId}`);
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Inference submission failed. Please verify the image file.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Page Header */}
      <div className="space-y-1 pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Badge variant="primary" dot size="sm">Foliar Computer Vision</Badge>
          <span className="text-text-dark font-mono">•</span>
          <span className="text-xs font-mono text-text-muted">PyTorch Inference Stack</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
          Analyze Your Plant
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
          Upload a high-resolution leaf photo. The multi-stage pipeline will segment diseased margins, compute necrotic surface percentage, generate Grad-CAM attributions, and synthesize an agronomic report.
        </p>
      </div>

      {/* Environmental Location Sensor Banner (Section 23) */}
      <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-surface-light border border-border text-cyan-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-text-primary block">Environmental Context Provider</span>
            <span className="text-text-muted">
              {locationStatus === 'granted' && coordinates
                ? `GPS Coordinates acquired (${coordinates.latitude.toFixed(2)}°, ${coordinates.longitude.toFixed(2)}°). Real-time weather attached.`
                : locationStatus === 'denied'
                ? 'Location permission denied. Microclimate weather will fallback to regional weather station.'
                : 'Acquiring device geolocation for localized temperature & humidity sync...'}
            </span>
          </div>
        </div>

        <Badge
          variant={locationStatus === 'granted' ? 'success' : locationStatus === 'denied' ? 'default' : 'info'}
          size="sm"
        >
          {locationStatus === 'granted' ? 'Context Synced' : locationStatus === 'denied' ? 'Manual Default' : 'Acquiring'}
        </Badge>
      </div>

      {/* Error alert if any */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-xl bg-status-error/10 border border-status-error/30 flex items-start gap-3 text-xs text-status-error"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Validation Failed</span>
              <p>{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload or Preview Section */}
      <div>
        {!selectedImage ? (
          <ImageUploader
            onImageSelected={handleImageSelected}
            onError={(msg) => setErrorMessage(msg)}
          />
        ) : (
          <ImagePreview
            imageData={selectedImage}
            onRemove={() => setSelectedImage(null)}
            onAnalyze={handleAnalyze}
            isAnalyzing={isSubmitting}
          />
        )}
      </div>

      {/* Scientific Notice (Section 2) */}
      <div className="p-4 rounded-2xl border border-border/60 bg-surface/40 flex items-start gap-3 text-[11px] text-text-muted leading-relaxed">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-text-primary">Important Scientific Precaution:</span>
          <p className="mt-0.5">
            PlantIQ detects visible foliar disease phenotypes from leaf surfaces. Internal vascular blockages, soil pH, exact NPK levels, and root health cannot be accurately determined from surface imagery alone.
          </p>
        </div>
      </div>
    </div>
  );
};
