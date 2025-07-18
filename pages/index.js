import { useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../components/MainLayout';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Empêcher les redirections automatiques vers la page d'accueil
    // sauf si c'est une navigation intentionnelle
    const handleRouteChange = (url) => {
      if (url === '/' && router.asPath !== '/') {
        // Si on essaie de rediriger vers l'accueil depuis une autre page
        // on annule la redirection
        router.replace(router.asPath);
      }
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);
  
  return <MainLayout />;
}
