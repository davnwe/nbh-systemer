import { useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../components/MainLayout';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Désactiver complètement les redirections automatiques
    const preventRedirection = (url) => {
      // Empêcher toute redirection non intentionnelle
      if (url !== router.asPath && !url.startsWith('/dashboard') && !url.startsWith('/login') && !url.startsWith('/register')) {
        return false;
      }
    };
    
    router.events.on('routeChangeStart', preventRedirection);
    
    return () => {
      router.events.off('routeChangeStart', preventRedirection);
    };
  }, [router]);
  
  return <MainLayout />;
}
