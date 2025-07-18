import { useEffect } from 'react';
import { useRouter } from 'next/router';
import CourrierDepart from '../components/CourrierDepart';

export default function CourrierDepartPage() {
  const router = useRouter();

  useEffect(() => {
    // Empêcher les redirections automatiques
    const handleRouteChange = (url) => {
      if (url !== '/courrier-depart' && router.asPath === '/courrier-depart') {
        // Annuler la navigation si elle n'est pas intentionnelle
        return false;
      }
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return <CourrierDepart />;
}