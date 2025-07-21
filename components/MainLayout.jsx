import { useState } from 'react';
import SidebarMenu from './SidebarMenu.jsx';
import BottomNav from './BottomNav.jsx';
import Dashboard from './Dashboard.jsx';
import CourrierArrive from './CourrierArrive.jsx';
import CourrierDepart from './CourrierDepart.jsx';
import Partenaires from './Partenaires.jsx';
import Parametres from './Parametres.jsx';

export default function MainLayout({ children }) {
  const [currentView, setCurrentView] = useState('accueil');
  
  // Empêcher les changements de vue non intentionnels
  const handleViewChange = (newView) => {
    // Empêcher les changements de vue automatiques
    if (newView && newView !== currentView && typeof newView === 'string') {
      // S'assurer qu'on reste sur la même URL
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', window.location.pathname);
      }
      setCurrentView(newView);
    }
  };
  
  return (
    <div className="min-h-screen flex bg-[#F7F8FA] text-gray-900">
      <SidebarMenu currentView={currentView} setCurrentView={handleViewChange} />
      <div className="flex-1 flex flex-col min-h-screen pl-[80px] md:pl-[120px] transition-all duration-300 pb-16">
        <main className="flex-1 w-full py-4 px-4 pr-6">
          {currentView === 'accueil' && <Dashboard />}
          {currentView === 'arrive' && <CourrierArrive />}
          {currentView === 'depart' && <CourrierDepart />}
          {currentView === 'partenaires' && <Partenaires />}
          {currentView === 'parametres' && <Parametres />}
          {children}
        </main>
        <BottomNav currentView={currentView} setCurrentView={handleViewChange} />
      </div>
    </div>
  );
}
