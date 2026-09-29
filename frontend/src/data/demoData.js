/**
 * PlantIQ Development & Demo Data
 * Clearly designated mock datasets for local testing and presentation.
 * In production (VITE_DEMO_MODE=false), this data is replaced by live FastAPI responses.
 */

export const DEMO_PLANTS = [
  {
    id: "plant-tomato-01",
    name: "Tomato Plant #01",
    species: "Solanum lycopersicum",
    firstScan: "2026-09-01",
    latestScan: "2026-09-21",
    totalScans: 4,
    latestDisease: "Late Blight",
    latestSeverity: "Moderate",
    latestAffectedArea: 23.7,
    status: "diseased",
    photoUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80",
    notes: "Main greenhouse test batch #3. Monitored for Phytophthora infestans development."
  },
  {
    id: "plant-corn-04",
    name: "Field Corn #04",
    species: "Zea mays",
    firstScan: "2026-09-10",
    latestScan: "2026-09-25",
    totalScans: 3,
    latestDisease: "Healthy",
    latestSeverity: "None",
    latestAffectedArea: 0.0,
    status: "healthy",
    photoUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
    notes: "North quadrant block B. Nitrogen fertilizer applied."
  },
  {
    id: "plant-apple-02",
    name: "Apple Orchard Tree #02",
    species: "Malus domestica",
    firstScan: "2026-08-15",
    latestScan: "2026-09-18",
    totalScans: 5,
    latestDisease: "Apple Scab",
    latestSeverity: "High",
    latestAffectedArea: 38.2,
    status: "critical",
    photoUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=600&q=80",
    notes: "East perimeter row 4. Venturia inaequalis detected."
  },
  {
    id: "plant-bellpepper-01",
    name: "Bell Pepper Bed A",
    species: "Capsicum annuum",
    firstScan: "2026-09-12",
    latestScan: "2026-09-26",
    totalScans: 2,
    latestDisease: "Bacterial Spot",
    latestSeverity: "Low",
    latestAffectedArea: 6.4,
    status: "recovering",
    photoUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80",
    notes: "Under trial drip irrigation. Copper fungicide spray applied."
  }
];

export const DEMO_SCANS = [
  {
    id: "scan-98421",
    userId: "usr-demo-01",
    plantId: "plant-tomato-01",
    plantName: "Tomato (Solanum lycopersicum)",
    disease: "Late Blight",
    pathogen: "Phytophthora infestans",
    confidence: 0.942,
    topPredictions: [
      { label: "Late Blight", confidence: 0.942 },
      { label: "Early Blight", confidence: 0.041 },
      { label: "Septoria Leaf Spot", confidence: 0.012 },
      { label: "Healthy", confidence: 0.005 }
    ],
    segmentation: {
      affectedPixels: 142200,
      totalLeafPixels: 600000,
      affectedPercentage: 23.7,
      maskUrl: null, // Generated dynamically via canvas or backend
      overlayUrl: null
    },
    severity: "Moderate",
    severityThresholdRange: "10% – 25%",
    explainability: {
      method: "Grad-CAM (Gradient-weighted Class Activation Mapping)",
      targetLayer: "features.stage7.unit1 (EfficientNet-B4)",
      summary: "Grad-CAM activation highlights dark necrotic lesions along the leaf margin and water-soaked patches near vascular veins, indicating strong feature attribution for Late Blight."
    },
    environmentalContext: {
      location: "Ludhiana Agricultural Belt, Punjab",
      latitude: 30.9010,
      longitude: 75.8573,
      temperatureC: 24.2,
      humidityPercent: 88,
      rainfallMm: 4.8,
      windKmh: 12.5,
      weatherCondition: "High Humidity & Light Rain",
      riskFactor: "Optimal environmental conditions for Phytophthora zoospore germination (>85% RH and 18-24°C). Note: Environmental conditions provide epidemiological context, not biological proof."
    },
    aiHealthReport: {
      detectedCondition: "Late Blight (Phytophthora infestans) with moderate foliar necrosis.",
      visibleSymptoms: [
        "Irregular dark brown water-soaked lesions expanding inward from leaf tips",
        "Pale green to yellow halos surrounding necrotized patches",
        "Subtle whitish sporulation visible under high humidity margins"
      ],
      contributingFactors: "Relative humidity of 88% combined with 24°C ambient temperature substantially lowers the threshold for secondary infection cycles.",
      managementGuidelines: [
        "Prune and remove severely infected lower foliage immediately using sterilized shears.",
        "Transition immediately from overhead sprinklers to subsurface drip irrigation to prevent free water on leaf surfaces.",
        "Consider preventative application of protectant fungicides (e.g., Mancozeb or Copper hydroxide) on surrounding healthy foliage."
      ],
      prevention: "Implement 3-year crop rotation away from Solanaceae family (potato, eggplant). Ensure minimum 45cm spacing between plants for adequate canopy airflow.",
      expertAdvisory: "If lesion progression exceeds 40% leaf surface within 48 hours, seek on-site consultation from your regional Agricultural Extension Officer."
    },
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-09-27T10:15:00Z",
    modelVersion: "EfficientNet-B4_v2.1"
  },
  {
    id: "scan-98420",
    userId: "usr-demo-01",
    plantId: "plant-apple-02",
    plantName: "Apple (Malus domestica)",
    disease: "Apple Scab",
    pathogen: "Venturia inaequalis",
    confidence: 0.915,
    topPredictions: [
      { label: "Apple Scab", confidence: 0.915 },
      { label: "Cedar Apple Rust", confidence: 0.058 },
      { label: "Healthy", confidence: 0.027 }
    ],
    segmentation: {
      affectedPixels: 229200,
      totalLeafPixels: 600000,
      affectedPercentage: 38.2,
      maskUrl: null,
      overlayUrl: null
    },
    severity: "High",
    severityThresholdRange: "25% – 50%",
    explainability: {
      method: "Grad-CAM",
      targetLayer: "features.stage7.unit1",
      summary: "High activation focus on olive-green velvety lesions near midrib and puckered leaf distortions."
    },
    environmentalContext: {
      location: "Shimla District, HP",
      latitude: 31.1048,
      longitude: 77.1734,
      temperatureC: 18.5,
      humidityPercent: 78,
      rainfallMm: 2.1,
      windKmh: 8.0,
      weatherCondition: "Overcast / Wet Canopy",
      riskFactor: "Extended leaf wetness duration exceeding 9 hours enables Venturia ascospore penetration."
    },
    aiHealthReport: {
      detectedCondition: "Apple Scab (Venturia inaequalis) with high leaf area disruption.",
      visibleSymptoms: ["Circular olive-green to dark brown lesions with velvety fungal texture"],
      contributingFactors: "Cool wet springtime canopy persistence.",
      managementGuidelines: ["Rake and shred fallen leaves in autumn to disrupt overwintering pseudothecia."],
      prevention: "Select scab-resistant cultivars and apply protective bio-fungicide sprays.",
      expertAdvisory: "High severity scan. Examine fruit clusters for corky brown scab lesions."
    },
    imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-09-26T14:20:00Z",
    modelVersion: "EfficientNet-B4_v2.1"
  },
  {
    id: "scan-98419",
    userId: "usr-demo-01",
    plantId: "plant-corn-04",
    plantName: "Corn (Zea mays)",
    disease: "Healthy",
    pathogen: "None (Physiological baseline)",
    confidence: 0.981,
    topPredictions: [
      { label: "Healthy", confidence: 0.981 },
      { label: "Common Rust", confidence: 0.012 },
      { label: "Northern Leaf Blight", confidence: 0.007 }
    ],
    segmentation: {
      affectedPixels: 0,
      totalLeafPixels: 600000,
      affectedPercentage: 0.0,
      maskUrl: null,
      overlayUrl: null
    },
    severity: "Low",
    severityThresholdRange: "0% – 10%",
    explainability: {
      method: "Grad-CAM",
      targetLayer: "features.stage7.unit1",
      summary: "Evenly distributed activation across uniform green chlorophyll pigmentation with no concentrated focal lesions."
    },
    environmentalContext: {
      location: "Ludhiana Agricultural Belt, Punjab",
      latitude: 30.9010,
      longitude: 75.8573,
      temperatureC: 28.0,
      humidityPercent: 55,
      rainfallMm: 0.0,
      windKmh: 14.0,
      weatherCondition: "Clear Sun",
      riskFactor: "Low fungal disease pressure under current ambient humidity."
    },
    aiHealthReport: {
      detectedCondition: "Healthy plant specimen. No observable pathogenic symptoms.",
      visibleSymptoms: ["Vibrant uniform green coloration, intact leaf margins, crisp venation."],
      contributingFactors: "Well-balanced macro-nutrients and optimal sunlight exposure.",
      managementGuidelines: ["Maintain scheduled watering and standard scouting routine."],
      prevention: "Continue balanced soil fertilization and weed management.",
      expertAdvisory: "Specimen is healthy. Re-scan in 10-14 days for routine surveillance."
    },
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-09-25T09:00:00Z",
    modelVersion: "EfficientNet-B4_v2.1"
  }
];

export const DEMO_PLANT_TIMELINE = [
  {
    day: "Day 1",
    date: "2026-09-01",
    scanId: "scan-98301",
    stage: "Baseline Check",
    status: "Healthy",
    affectedPercentage: 0.0,
    severity: "None",
    notes: "Initial seedling scan post-transplant. Uniform foliage."
  },
  {
    day: "Day 7",
    date: "2026-09-08",
    scanId: "scan-98345",
    stage: "Early Detection",
    status: "Early Symptoms",
    affectedPercentage: 8.0,
    severity: "Low",
    notes: "Small chlorotic speckling observed on bottom-tier leaflets."
  },
  {
    day: "Day 14",
    date: "2026-09-15",
    scanId: "scan-98399",
    stage: "Progression Phase",
    status: "Moderate Blight",
    affectedPercentage: 17.0,
    severity: "Moderate",
    notes: "Lesions coalesce into dark necrotic zones following humid rain event."
  },
  {
    day: "Day 21",
    date: "2026-09-22",
    scanId: "scan-98421",
    stage: "Current State",
    status: "Active Late Blight",
    affectedPercentage: 23.7,
    severity: "Moderate",
    notes: "Marginal necrosis reaches 23.7% of leaf area. Intervention triggered."
  }
];

export const DEMO_ANALYTICS = {
  stats: {
    totalScans: 1428,
    healthyPlants: 812,
    diseasedPlants: 616,
    avgAffectedArea: 16.4,
    scanAccuracyRate: 94.6,
    activeMonitoredPlants: 86
  },
  diseaseDistribution: [
    { name: "Late Blight", count: 184, color: "#ff4d6d" },
    { name: "Early Blight", count: 142, color: "#ffb020" },
    { name: "Leaf Spot", count: 98, color: "#8b5cf6" },
    { name: "Powdery Mildew", count: 110, color: "#38bdf8" },
    { name: "Bacterial Spot", count: 82, color: "#f43f5e" },
    { name: "Healthy Baseline", count: 812, color: "#00ff88" }
  ],
  severityDistribution: [
    { name: "None (Healthy)", percentage: 56.8, count: 812, color: "#00ff88" },
    { name: "Low (0-10%)", percentage: 18.2, count: 260, color: "#38bdf8" },
    { name: "Moderate (10-25%)", percentage: 14.5, count: 207, color: "#ffb020" },
    { name: "High (25-50%)", percentage: 7.8, count: 111, color: "#f97316" },
    { name: "Critical (>50%)", percentage: 2.7, count: 38, color: "#ff4d6d" }
  ],
  scanTrends: [
    { month: "Apr", scans: 112, diseased: 42, avgTemp: 22 },
    { month: "May", scans: 168, diseased: 60, avgTemp: 28 },
    { month: "Jun", scans: 215, diseased: 88, avgTemp: 33 },
    { month: "Jul", scans: 290, diseased: 145, avgTemp: 31 },
    { month: "Aug", scans: 345, diseased: 178, avgTemp: 29 },
    { month: "Sep", scans: 298, diseased: 103, avgTemp: 26 }
  ],
  environmentalCorrelation: [
    { humidity: 45, avgAffected: 3.2, label: "Dry (<50% RH)" },
    { humidity: 55, avgAffected: 5.8, label: "Moderate (50-60%)" },
    { humidity: 68, avgAffected: 12.4, label: "Humid (60-75%)" },
    { humidity: 82, avgAffected: 24.1, label: "Very Humid (75-85%)" },
    { humidity: 92, avgAffected: 34.6, label: "Saturated (>85% RH)" }
  ]
};

export const DEMO_CLUSTERING = {
  description: "Unsupervised K-Means clustering (K=4) projected onto 2D PCA feature space from penultimate layer representations of 500 scanned plant leaves. Identifies exploratory morphological groupings.",
  clusters: [
    {
      id: "cluster-0",
      name: "Uniform Pigmentation",
      label: "Healthy-looking",
      color: "#00ff88",
      pointsCount: 214,
      characteristics: "High green-channel dominance, low localized edge density, intact vascular pattern.",
      points: [
        { x: -3.2, y: 1.8, sampleId: "SMP-101", confidence: 0.98, status: "Healthy" },
        { x: -2.8, y: 2.4, sampleId: "SMP-104", confidence: 0.97, status: "Healthy" },
        { x: -3.5, y: 0.9, sampleId: "SMP-112", confidence: 0.99, status: "Healthy" },
        { x: -2.1, y: 1.5, sampleId: "SMP-119", confidence: 0.95, status: "Healthy" },
        { x: -3.0, y: 2.1, sampleId: "SMP-125", confidence: 0.98, status: "Healthy" }
      ]
    },
    {
      id: "cluster-1",
      name: "Punctate Discoloration",
      label: "Spot Patterns",
      color: "#8b5cf6",
      pointsCount: 118,
      characteristics: "High localized circular gradients, moderate contrast spots (e.g. Cercospora, Septoria).",
      points: [
        { x: 1.2, y: 2.9, sampleId: "SMP-204", confidence: 0.92, status: "Leaf Spot" },
        { x: 0.8, y: 3.4, sampleId: "SMP-209", confidence: 0.89, status: "Septoria" },
        { x: 1.7, y: 2.5, sampleId: "SMP-218", confidence: 0.94, status: "Bacterial Spot" },
        { x: 1.4, y: 3.8, sampleId: "SMP-222", confidence: 0.91, status: "Leaf Spot" }
      ]
    },
    {
      id: "cluster-2",
      name: "Extensive Foliar Necrosis",
      label: "Blight-like",
      color: "#ff4d6d",
      pointsCount: 132,
      characteristics: "Large contiguous dark patches, high boundary irregularity, margin invasion.",
      points: [
        { x: 3.8, y: -1.2, sampleId: "SMP-301", confidence: 0.95, status: "Late Blight" },
        { x: 4.2, y: -0.7, sampleId: "SMP-305", confidence: 0.93, status: "Early Blight" },
        { x: 3.1, y: -2.1, sampleId: "SMP-312", confidence: 0.91, status: "Late Blight" },
        { x: 4.5, y: -1.8, sampleId: "SMP-320", confidence: 0.96, status: "Late Blight" }
      ]
    },
    {
      id: "cluster-3",
      name: "Outlier Morphologies",
      label: "Unusual / Atypical",
      color: "#ffb020",
      pointsCount: 36,
      characteristics: "Mixed patterns, severe mechanical damage, nutritional chlorosis, or atypical leaf shapes.",
      points: [
        { x: -0.5, y: -3.2, sampleId: "SMP-401", confidence: 0.74, status: "Nutritional Deficiency" },
        { x: 0.2, y: -3.8, sampleId: "SMP-408", confidence: 0.68, status: "Atypical Lesion" },
        { x: -1.1, y: -2.9, sampleId: "SMP-415", confidence: 0.71, status: "Mechanical Tear" }
      ]
    }
  ]
};

export const DEMO_MODELS_INFO = [
  {
    id: "mdl-cls-01",
    name: "Disease Classifier Engine",
    type: "Image Classification",
    architecture: "EfficientNet-B4 (with Transfer Learning from ImageNet-1k)",
    framework: "PyTorch 2.3.1 + TorchVision",
    dataset: "PlantVillage + Expanded Field Validation Callset (54,305 curated leaves)",
    inputSize: "384 x 384 x 3",
    version: "v2.1.0-prod",
    status: "Active",
    metrics: {
      accuracy: 0.954,
      precision: 0.948,
      recall: 0.951,
      f1Score: 0.949,
      latencyMs: 42
    },
    confusionMatrix: [
      { predicted: "Healthy", actualHealthy: 982, actualEarlyBlight: 12, actualLateBlight: 6, actualLeafSpot: 0 },
      { predicted: "Early Blight", actualHealthy: 8, actualEarlyBlight: 934, actualLateBlight: 45, actualLeafSpot: 13 },
      { predicted: "Late Blight", actualHealthy: 4, actualEarlyBlight: 38, actualLateBlight: 948, actualLeafSpot: 10 },
      { predicted: "Leaf Spot", actualHealthy: 2, actualEarlyBlight: 14, actualLateBlight: 12, actualLeafSpot: 972 }
    ]
  },
  {
    id: "mdl-seg-01",
    name: "Foliar Region Segmenter",
    type: "Semantic Segmentation",
    architecture: "U-Net with ResNet-34 Feature Encoder",
    framework: "PyTorch + Albumentations",
    dataset: "Annotated Leaf Lesion Mask Benchmark (4,200 pixel-level masks)",
    inputSize: "512 x 512 x 3",
    version: "v1.4.2",
    status: "Active",
    metrics: {
      meanIoU: 0.824,
      diceScore: 0.897,
      pixelAccuracy: 0.961,
      latencyMs: 78
    }
  },
  {
    id: "mdl-clu-01",
    name: "Unsupervised Pattern Explorer",
    type: "Feature Clustering",
    architecture: "K-Means on penultimate layer latent vectors (K=4) + PCA reduction",
    framework: "scikit-learn 1.5.0",
    dataset: "Live inference embedding archive",
    inputSize: "1792-D feature vector -> 2D PCA",
    version: "v1.1.0",
    status: "Active",
    metrics: {
      silhouetteScore: 0.682,
      calinskiHarabasz: 1420.5
    }
  }
];

export const DEMO_ADMIN_USERS = [
  { id: "usr-01", name: "Aarav Sharma", email: "aarav.sharma@agritech.in", role: "ADMIN", scansCount: 142, status: "Active", joined: "2026-06-12" },
  { id: "usr-02", name: "Priya Patel", email: "priya.p@farmsense.org", role: "USER", scansCount: 88, status: "Active", joined: "2026-07-04" },
  { id: "usr-03", name: "Dr. Ramesh Gill", email: "rgill@pau.edu", role: "RESEARCHER", scansCount: 310, status: "Active", joined: "2026-05-18" },
  { id: "usr-04", name: "Kavita Rao", email: "kavita.agri@gmail.com", role: "USER", scansCount: 45, status: "Active", joined: "2026-08-22" },
  { id: "usr-05", name: "Demo User", email: "demo@plantiq.ai", role: "USER", scansCount: 24, status: "Active", joined: "2026-09-01" }
];
