import React, { useState } from 'react';
import {
  Recycle,
  Activity,
  History,
  Bell,
  Cpu,
  Info,
  MessageSquare,
  ShieldCheck,
  QrCode,
  Sliders,
  Menu,
  X,
  Wifi,
  Radio,
  Sparkles,
} from 'lucide-react';
import { useEcoBin } from '../context/EcoBinContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQrModal: () => void;
  onOpenPinoutModal: () => void;
  onOpenSimulatorModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQrModal,
  onOpenPinoutModal,
  onOpenSimulatorModal,
}) => {
  const { isDemoMode, toggleMode, unreadAlertCount, deviceHealth } = useEcoBin();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'history', label: 'History', icon: History },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadAlertCount },
    { id: 'devices', label: 'Devices', icon: Cpu },
    { id: 'about', label: 'About', icon: Info },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  }

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  EcoBin<span className="text-emerald-600"> 24×7</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  IoT Smart Waste
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                Real-Time Ultrasonic Monitoring
              </p>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Controls & Indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Mode / Live IoT Mode Switch */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                id="btn-demo-mode-toggle"
                onClick={toggleMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  isDemoMode
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={isDemoMode ? 'Running in simulated demo mode' : 'Switch to demo simulation'}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">DEMO</span>
              </button>
              <button
                type="button"
                id="btn-live-mode-toggle"
                onClick={toggleMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  !isDemoMode
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={!isDemoMode ? 'Listening for live ESP8266 data' : 'Switch to live IoT REST API mode'}
              >
                <Radio className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LIVE IoT</span>
              </button>
            </div>

            {/* Hardware Pinout Guide Button */}
            <button
              id="btn-open-pinouts"
              onClick={onOpenPinoutModal}
              title="ESP8266 & HC-SR04 Hardware Pinouts & Wiring"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors hidden sm:flex items-center justify-center border border-slate-200"
            >
              <Cpu className="w-4 h-4 text-emerald-600" />
            </button>

            {/* Test IoT Simulator Button */}
            <button
              id="btn-open-simulator"
              onClick={onOpenSimulatorModal}
              title="IoT Telemetry Packet Simulator (Test API)"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors hidden sm:flex items-center justify-center border border-slate-200"
            >
              <Sliders className="w-4 h-4 text-slate-700" />
            </button>

            {/* QR Code Button */}
            <button
              id="btn-open-qr-code"
              onClick={onOpenQrModal}
              title="Scan QR Code to open EcoBin 24×7"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* System Online Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <Wifi className="w-3 h-3 text-emerald-600" />
              <span>System Online</span>
            </div>

            {/* User Profile / Auth */}
            {user ? (
              <div
                className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer"
                onClick={() => setActiveTab('login')}
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                />
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onOpenPinoutModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hardware Wiring</span>
            </button>
            <button
              onClick={() => {
                onOpenSimulatorModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-700" />
              <span>Test Simulator</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
