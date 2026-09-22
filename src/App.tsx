import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { EcoBinProvider } from './context/EcoBinContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { AlertsPage } from './pages/AlertsPage';
import { DevicesPage } from './pages/DevicesPage';
import { AboutPage } from './pages/AboutPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { QrCodeModal } from './components/QrCodeModal';
import { HardwarePinoutModal } from './components/HardwarePinoutModal';
import { DeviceSimulatorModal } from './components/DeviceSimulatorModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPinoutModalOpen, setIsPinoutModalOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);

  return (
    <AuthProvider>
      <EcoBinProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
          {/* Navigation Bar */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenQrModal={() => setIsQrModalOpen(true)}
            onOpenPinoutModal={() => setIsPinoutModalOpen(true)}
            onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {activeTab === 'dashboard' && (
              <DashboardPage
                setActiveTab={setActiveTab}
                onOpenPinoutModal={() => setIsPinoutModalOpen(true)}
                onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
              />
            )}
            {activeTab === 'history' && <HistoryPage />}
            {activeTab === 'alerts' && <AlertsPage />}
            {activeTab === 'devices' && (
              <DevicesPage
                setActiveTab={setActiveTab}
                onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
              />
            )}
            {activeTab === 'about' && (
              <AboutPage onOpenPinoutModal={() => setIsPinoutModalOpen(true)} />
            )}
            {activeTab === 'feedback' && <FeedbackPage />}
            {activeTab === 'admin' && <AdminPage setActiveTab={setActiveTab} />}
            {activeTab === 'login' && <LoginPage setActiveTab={setActiveTab} />}
          </main>

          {/* Footer */}
          <Footer setActiveTab={setActiveTab} />

          {/* Global Modals */}
          <QrCodeModal
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
          />
          <HardwarePinoutModal
            isOpen={isPinoutModalOpen}
            onClose={() => setIsPinoutModalOpen(false)}
          />
          <DeviceSimulatorModal
            isOpen={isSimulatorModalOpen}
            onClose={() => setIsSimulatorModalOpen(false)}
          />
        </div>
      </EcoBinProvider>
    </AuthProvider>
  );
}
