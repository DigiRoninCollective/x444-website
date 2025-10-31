import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HoneycombBackground from './components/HoneycombBackground';
import Footer from './components/Footer';
import ZCVoiceAssistant from './components/ZCVoiceAssistant';
import { ToastProvider } from './components/ToastContainer';
import { VoiceProvider } from './context/VoiceContext';
import { ChatProvider } from './context/ChatContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import ChatWindow from './components/ChatWindow';
import PageTracker from './components/PageTracker';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ProtocolPage = lazy(() => import('./pages/ProtocolPage'));
const TokenPage = lazy(() => import('./pages/TokenPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const DocsPage = lazy(() => import('./pages/DocsPage'));
const WidgetDemoPage = lazy(() => import('./pages/WidgetDemoPage'));
const WidgetShowcasePage = lazy(() => import('./pages/WidgetShowcasePage'));
const TechnicalPage = lazy(() => import('./pages/TechnicalPage'));
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-slate-400">Loading...</div>
  </div>
);

export default function App() {
  return (
    <AnalyticsProvider>
      <ToastProvider>
        <VoiceProvider>
          <ChatProvider>
            <Router>
              <PageTracker />
              <div className="min-h-screen bg-slate-950 relative overflow-hidden">
                <HoneycombBackground />
                <div className="relative z-10">
                  <Navigation />
                  <main className="min-h-[calc(100vh-120px)]">
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/protocol" element={<ProtocolPage />} />
                        <Route path="/technical" element={<TechnicalPage />} />
                        <Route path="/token" element={<TokenPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="/docs" element={<DocsPage />} />
                        <Route path="/widget" element={<WidgetDemoPage />} />
                        <Route path="/widget-showcase" element={<WidgetShowcasePage />} />
                        <Route path="/dashboard" element={<CreatorDashboard />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
                {/* ZC Voice Assistant - Available on all pages */}
                <ZCVoiceAssistant />

                {/* CZ Chat Window - Available on all pages */}
                <ChatWindow />
              </div>
            </Router>
          </ChatProvider>
        </VoiceProvider>
      </ToastProvider>
    </AnalyticsProvider>
  );
}
