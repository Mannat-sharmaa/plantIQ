"""
PlantIQ - Latent Vector Clustering & PCA Projection
Unsupervised morphological clustering using K-Means (K=4)
"""

import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

def run_clustering_on_embeddings(embeddings_matrix: np.ndarray, n_clusters: int = 4):
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init="auto")
    cluster_labels = kmeans.fit_predict(embeddings_matrix)

    pca = PCA(n_components=2)
    coords_2d = pca.fit_transform(embeddings_matrix)

    return cluster_labels, coords_2d, kmeans.cluster_centers_

if __name__ == "__main__":
    synthetic_features = np.random.randn(200, 1792)  # 1792-D EfficientNet-B4 features
    labels, coords, centers = run_clustering_on_embeddings(synthetic_features)
    print("🌱 PlantIQ: K-Means Clustering on 1792-D feature vectors complete.")
    print(f"Projected 2D coordinates shape: {coords.shape}")
