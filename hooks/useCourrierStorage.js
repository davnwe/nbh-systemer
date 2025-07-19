import { useState, useEffect } from 'react';

export function useCourrierStorage(type) {
  const [courriers, setCourriers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourriers();
  }, [type]);

  const loadCourriers = () => {
    try {
      setLoading(true);
      const key = type === 'ARRIVE' ? 'courriers-arrive' : 'courriers-depart';
      const stored = localStorage.getItem(key);
      const data = stored ? JSON.parse(stored) : [];
      setCourriers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des courriers:', error);
      setCourriers([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCourriers = (data) => {
    const key = type === 'ARRIVE' ? 'courriers-arrive' : 'courriers-depart';
    localStorage.setItem(key, JSON.stringify(data));
  };

  const generateAutoNumber = (existingCourriers) => {
    try {
      const existingNumbers = existingCourriers
        .map(c => c.numero)
        .filter(n => n && n.match(/^\d{5}$/))
        .map(n => parseInt(n))
        .filter(n => !isNaN(n));

      const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      return String(nextNumber).padStart(5, '0');
    } catch (error) {
      console.error('Erreur génération numéro:', error);
      return '00001';
    }
  };

  const addCourrier = (courrier) => {
    try {
      const autoNumber = generateAutoNumber(courriers);
      const newCourrier = {
        ...courrier,
        id: Date.now().toString(),
        numero: courrier.numero || autoNumber,
        dateCreation: new Date().toISOString(),
        type: type
      };
      const updatedCourriers = [newCourrier, ...courriers];
      setCourriers(updatedCourriers);
      saveCourriers(updatedCourriers);
      return newCourrier;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du courrier:', error);
      throw error;
    }
  };

  const updateCourrier = (id, updatedData) => {
    try {
      const updatedCourriers = courriers.map(c => 
        c.id === id ? { ...c, ...updatedData } : c
      );
      setCourriers(updatedCourriers);
      saveCourriers(updatedCourriers);
      return updatedCourriers.find(c => c.id === id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du courrier:', error);
      throw error;
    }
  };

  const updateStatus = (id, newStatus) => {
    try {
      return updateCourrier(id, { statut: newStatus });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  };

  const deleteCourrier = (id) => {
    try {
      const updatedCourriers = courriers.filter(c => c.id !== id);
      setCourriers(updatedCourriers);
      saveCourriers(updatedCourriers);
    } catch (error) {
      console.error('Erreur lors de la suppression du courrier:', error);
      throw error;
    }
  };

  return {
    courriers,
    loading,
    addCourrier,
    updateCourrier,
    updateStatus,
    deleteCourrier,
    loadCourriers
  };
}