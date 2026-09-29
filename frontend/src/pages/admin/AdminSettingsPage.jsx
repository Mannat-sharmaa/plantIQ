import React from 'react';
import { Settings, ShieldCheck, Key, Database, RefreshCw } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const AdminSettingsPage = () => {
  return (
    <div className="space-y-6 text-left pb-12 max-w-4xl">
      <div className="pb-2 border-b border-secondary/20">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Administrative Global Settings
          </h1>
        </div>
        <p className="text-xs text-text-muted mt-1">Configure security keys, database replication, and audit logging.</p>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-2xl bg-[#0e0f18] border border-secondary/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-sm text-white">Database Health (MongoDB)</span>
            <Badge variant="primary" dot size="sm">Connected</Badge>
          </div>
          <p className="text-xs text-text-muted">Primary replica active. In-memory fallback available during local development.</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e0f18] border border-secondary/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-sm text-white">RAG Vector Store (ChromaDB / FAISS)</span>
            <Badge variant="secondary" size="sm">Indexed (1,240 Chunks)</Badge>
          </div>
          <p className="text-xs text-text-muted">Knowledge base vectors synced with disease pathology markdown repository.</p>
          <Button size="sm" variant="subtle" icon={RefreshCw}>Rebuild Vector Embeddings</Button>
        </div>
      </div>
    </div>
  );
};
