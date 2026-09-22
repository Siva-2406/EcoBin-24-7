import React from 'react';
import { Trash2, Heart, Cpu, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                EcoBin<span className="text-emerald-400"> 24×7</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              Smart Waste Monitoring &amp; Overflow Alert System
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Designed as an IoT-based engineering college project. Continuously monitors municipal and campus bin fill levels using an HC-SR04 ultrasonic sensor and ESP8266 NodeMCU to eliminate manual checks and prevent unhygienic waste overflows.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-emerald-400 font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>SENSE → PROCESS → CALCULATE → DISPLAY → ALERT → COLLECT</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Application Pages
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('history')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Historical Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Overflow Alerts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('devices')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  IoT Devices &amp; Bins
                </button>
              </li>
            </ul>
          </div>

          {/* Project & Tech */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Project Reference
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  About the Project
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  User Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Panel</span>
                </button>
              </li>
              <li className="pt-2 text-xs text-slate-500 font-mono">
                Hardware: NodeMCU + HC-SR04
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} EcoBin 24×7. Built as an IoT-based engineering project.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Smart Waste Monitoring. Cleaner Communities.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
