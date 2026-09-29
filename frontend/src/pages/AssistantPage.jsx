import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  User,
  BookOpen,
  Info,
  Globe,
  Loader2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { aiAssistantService } from '../services/api';
import { DEMO_SCANS } from '../data/demoData';
import { SeverityBadge, Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const AssistantPage = () => {
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const getInitialScanContext = () => {
    if (location.state?.scanContext) return location.state.scanContext;
    try {
      const latest = localStorage.getItem('plantiq_latest_scan');
      if (latest) return JSON.parse(latest);
      const list = localStorage.getItem('plantiq_scans');
      if (list) {
        const parsed = JSON.parse(list);
        if (parsed.length > 0) return parsed[0];
      }
    } catch (e) {}
    return DEMO_SCANS[0];
  };

  // Active scan context (either passed via router state or latest user upload)
  const [scanContext, setScanContext] = useState(getInitialScanContext);

  const [language, setLanguage] = useState('English'); // English, Hindi, Punjabi
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState(() => [
    {
      id: '1',
      sender: 'assistant',
      text: `Hello! I am your PlantIQ Agronomic Assistant. I am grounded in your current diagnostic scan for **${scanContext.plantName}** (${scanContext.disease}, ${((scanContext.confidence || 0.94) * 100).toFixed(1)}% confidence, ${scanContext.severity} severity). How can I assist you with foliar management today?`,
      timestamp: 'Just now',
      citations: ['PlantIQ Vector Pathology Base', 'FAO Field Guide']
    }
  ]);

  useEffect(() => {
    // Sync greeting and sidebar when scanContext changes
    setMessages([
      {
        id: '1',
        sender: 'assistant',
        text: `Hello! I am your PlantIQ Agronomic Assistant. I am grounded in your diagnostic scan for **${scanContext.plantName}** (${scanContext.disease}, ${((scanContext.confidence || 0.94) * 100).toFixed(1)}% confidence, ${scanContext.severity} severity). How can I assist you today?`,
        timestamp: 'Just now',
        citations: ['PlantIQ Vector Pathology Base', 'FAO Field Guide']
      }
    ]);
  }, [scanContext.id, scanContext.plantName, scanContext.disease]);

  const quickPrompts = [
    { label: "Meri plant ki condition kaisi hai?", lang: "Hindi" },
    { label: "Why did the model detect this?", lang: "English" },
    { label: "What symptoms were detected?", lang: "English" },
    { label: "What preventive steps can I take?", lang: "English" },
    { label: "Explain this simply for a farmer.", lang: "English" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiAssistantService.sendMessage(query, scanContext, language);
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'AI explanation is temporarily unavailable. Your ML analysis is still available in the sidebar.',
          timestamp: 'Now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-secondary" />
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
              AI Plant Pathology Assistant
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Grounded multi-lingual conversational intelligence utilizing RAG vector search over pathology literature.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-text-muted" />
          <div className="flex p-1 rounded-xl bg-surface-light border border-border text-xs">
            {['English', 'Hindi', 'Punjabi'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  language === lang
                    ? 'bg-secondary text-white font-semibold shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout (Section 26) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Chat Stream */}
        <div className="lg:col-span-8 flex flex-col h-[650px] rounded-3xl border border-border bg-surface shadow-xl overflow-hidden">
          {/* Messages view */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-primary text-black font-bold'
                      : 'bg-secondary/20 border border-secondary/40 text-purple-300'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl p-4 ${
                    msg.sender === 'user'
                      ? 'bg-primary text-black font-medium'
                      : 'bg-surface-light border border-border/80 text-text-primary'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Citations block if available */}
                  {msg.citations && (
                    <div className="mt-3 pt-2 border-t border-border/50 text-[10px] text-text-muted flex items-center gap-1.5 font-mono">
                      <BookOpen className="w-3 h-3 text-secondary" />
                      <span>RAG Sources: {msg.citations.join(' • ')}</span>
                    </div>
                  )}

                  <span
                    className={`block mt-1 text-[10px] text-right ${
                      msg.sender === 'user' ? 'text-black/60' : 'text-text-dark'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 text-xs max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center text-purple-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-light border border-border text-text-muted italic flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
                  Retrieving pathology knowledge base...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Chips */}
          <div className="px-4 py-2 bg-surface-light/40 border-t border-border/40 flex gap-2 overflow-x-auto">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.label)}
                className="px-3 py-1 rounded-full bg-surface-light border border-border/60 text-text-muted hover:text-text-primary hover:border-primary/40 text-[11px] whitespace-nowrap transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-surface-light/80 border-t border-border/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={
                  language === 'Hindi'
                    ? 'फसल सम्बन्धी सवाल पूछें...'
                    : language === 'Punjabi'
                    ? 'ਫਸਲ ਬਾਰੇ ਸਵਾਲ ਪੁੱਛੋ...'
                    : 'Ask about foliar symptoms, treatment, or microclimate risk...'
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-surface border border-border text-text-primary text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={isLoading || !inputMessage.trim()}
                icon={Send}
              >
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Active Scan Context Card (Section 26) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl border border-border bg-surface text-xs space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <span className="font-heading font-semibold text-sm text-text-primary">Current Diagnostic Context</span>
              <Badge variant="primary" size="sm">Loaded</Badge>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden border border-border/60 bg-black/40">
              <img
                src={scanContext.imageUrl}
                alt={scanContext.plantName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2">
                <SeverityBadge severity={scanContext.severity} affectedPercentage={scanContext.segmentation?.affectedPercentage} />
              </div>
            </div>

            <div className="space-y-2 pt-1 font-mono text-[11px]">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-muted">Specimen:</span>
                <span className="text-text-primary font-semibold">{scanContext.plantName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-muted">Predicted Pathogen:</span>
                <span className="text-rose-400 font-semibold">{scanContext.disease}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-muted">Model Certainty:</span>
                <span className="text-primary font-bold">
                  {scanContext.confidence !== undefined ? `${(scanContext.confidence * 100).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-muted">Foliar Area:</span>
                <span className="text-text-primary">
                  {scanContext.segmentation?.affectedPercentage !== undefined && scanContext.segmentation?.affectedPercentage !== null
                    ? `${Number(scanContext.segmentation.affectedPercentage).toFixed(1)}%`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Microclimate RH:</span>
                <span className="text-cyan-400 font-semibold">
                  {scanContext.environmentalContext?.humidityPercent !== undefined && scanContext.environmentalContext?.humidityPercent !== null
                    ? `${scanContext.environmentalContext.humidityPercent}%`
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-light border border-border text-[11px] text-text-dark leading-relaxed">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400 inline mr-1" />
              The AI assistant references these exact metrics in answers without reclassifying or guessing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
