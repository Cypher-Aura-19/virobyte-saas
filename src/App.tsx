import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SimpleDashboard } from './components/SimpleDashboard';
import { SimpleAssistantTester } from './components/SimpleAssistantTester';
import { SimpleBusinessSettings } from './components/SimpleBusinessSettings';
import { SimpleIntegrations } from './components/SimpleIntegrations';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="content-area">
      {(currentView === 'dashboard' || currentView === 'overview') && <SimpleDashboard />}
      {(currentView === 'tester' || currentView === 'simulator') && <SimpleAssistantTester />}
      {(currentView === 'business' || currentView === 'services' || currentView === 'setup') && <SimpleBusinessSettings />}
      {(currentView === 'integrations' || currentView === 'connectors') && <SimpleIntegrations />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="app-container">
        <Header />
        <div className="main-wrapper">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
