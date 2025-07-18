import { useEffect } from 'react';
import { useRouter } from 'next/router';
import CourrierArrive from '../components/CourrierArrive';

export default function CourrierArrivePage() {
  const router = useRouter();

  useEffect(() => {
    // Empêcher les redirections automatiques
    const handleRouteChange = (url) => {
      if (url !== '/courrier-arrive' && router.asPath === '/courrier-arrive') {
        // Annuler la navigation si elle n'est pas intentionnelle
        return false;
      }
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return <CourrierArrive />;
}