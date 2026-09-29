import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Globe, Calendar, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input, Select } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'Aarav Sharma',
    email: user?.email || 'aarav.sharma@agritech.in',
    role: user?.role || 'ADMIN',
    preferredLanguage: user?.preferredLanguage || 'English',
    bio: 'Lead Agricultural Data Specialist focused on Solanaceae crop pathogen detection.'
  });

  const handleSave = (e) => {
    e.preventDefault();
    addToast({
      title: 'Profile Updated',
      message: 'Your profile settings have been persisted successfully.',
      type: 'success'
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-border/50">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
          Researcher Profile
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Manage your personal credentials, assigned roles, and preferred communication language.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
        {/* User Card Top */}
        <div className="flex items-center gap-4 pb-6 border-b border-border/50">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-2xl font-bold text-primary shadow-neon-green/20">
            {formData.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-heading font-bold text-text-primary">{formData.name}</h3>
              <Badge variant="primary" size="sm">{formData.role}</Badge>
            </div>
            <p className="text-xs text-text-muted font-mono">{formData.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            icon={User}
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            disabled
            helperText="Email is bound to your primary authentication token."
            icon={Mail}
          />

          <Select
            label="Default Advisory Language"
            value={formData.preferredLanguage}
            onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
            options={[
              { value: 'English', label: 'English' },
              { value: 'Hindi', label: 'हिन्दी (Hindi)' },
              { value: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
            ]}
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-text-muted">Research / Agronomic Notes</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-surface-light border border-border/80 text-text-primary text-xs rounded-xl p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" icon={Save}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
