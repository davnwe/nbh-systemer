import { useState, useRef } from 'react';
import { useCourrierStorage } from '../hooks/useCourrierStorage';
import CourrierForm from './CourrierForm.jsx';
import MailTable from './MailTable';
import CourrierDetailModal from './CourrierDetailModal';
import { useToast } from './ToastContainer';

export default function CourrierDepart() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();
  const containerRef = useRef(null);
  const [selectedMail, setSelectedMail] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);

  // Utiliser le hook de stockage
  const { 
    courriers: localMails, 
    loading, 
    addCourrier, 
    updateStatus, 
    deleteCourrier 
  } = useCourrierStorage('DEPART');

  const handleAddMail = (mail) => {
    try {
      const newMail = addCourrier(mail);
      setLastAddedId(newMail.id);
      setShowForm(false);
      addToast('✅ Courrier départ enregistré avec succès !', 'success');
      
      // Scroll vers le nouveau courrier après un court délai
      setTimeout(() => {
        const newRow = document.querySelector(`[data-courrier-id="${newMail.id}"]`);
        if (newRow) {
          newRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return newMail;
    } catch (error) {
      addToast('❌ Erreur lors de l\'enregistrement', 'error');
      return null;
    }
  };

  const handleRemove = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce courrier ?')) {
      try {
        deleteCourrier(id);
        addToast('🗑️ Courrier supprimé avec succès', 'success');
      } catch (error) {
        addToast('❌ Erreur lors de la suppression', 'error');
      }
    }
  };

  const handleView = (mail) => {
    // Empêcher toute navigation
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setSelectedMail(mail);
    setModalType('view');
  };

  const handleEdit = (mail) => {
    // Empêcher toute navigation
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setSelectedMail(mail);
    setModalType('edit');
  };

  const handleCloseModal = () => {
    setSelectedMail(null);
    setModalType(null);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const updatedCourrier = updateStatus(id, newStatus);
      if (updatedCourrier) {
        addToast(`📋 Statut mis à jour : ${newStatus}`, 'success');
        // Forcer la mise à jour de l'affichage sans navigation
        setSelectedMail(prev => prev ? { ...prev, statut: newStatus } : null);
      }
    } catch (error) {
      addToast('❌ Erreur lors de la mise à jour du statut', 'error');
    }
  };

  const handleUpdateMail = (updatedMail) => {
    try {
      // Mise à jour via le hook de stockage
      const updated = updateCourrier(updatedMail.id, updatedMail);
      if (updated) {
        addToast('✏️ Courrier modifié avec succès', 'success');
        handleCloseModal();
      }
    } catch (error) {
      addToast('❌ Erreur lors de la modification', 'error');
    }
  };

  // Utiliser localMails au lieu de mails pour le filtrage
  const filteredMails = localMails.filter(mail => {
    const q = search.toLowerCase();
    return (
      (mail.objet || '').toLowerCase().includes(q) ||
      (mail.expediteur || '').toLowerCase().includes(q) ||
      (mail.destinataire || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement des courriers...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-[100dvh] flex flex-col bg-main text-main">
      {/* Titre avec logo */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-[#15514f] flex items-center gap-3">
          <span className="text-3xl">📤</span>
          Courrier Départ
        </h1>
      </div>

      {/* Barre d'outils avec recherche, tri et ajouter */}
      <div className="flex items-center gap-4 mb-4 px-4">
        <input
          type="text"
          placeholder="Rechercher par objet, destinataire..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 bg-[#FCFCFC] border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#15514f] shadow-sm"
        />
        <select className="px-4 py-3 bg-[#FCFCFC] border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#15514f] shadow-sm min-w-[140px]">
          <option value="">Trier par</option>
          <option value="date">Date</option>
          <option value="destinataire">Destinataire</option>
          <option value="objet">Objet</option>
          <option value="statut">Statut</option>
        </select>
        <button
          onClick={() => setShowForm(f => !f)}
          className="px-6 py-3 bg-[#15514f] text-white rounded-lg hover:bg-[#0f3e3c] transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
        >
          <span>➕</span>
          Ajouter un nouveau courrier départ
        </button>
      </div>

      {/* Formulaire réduit */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2">
          <div className="w-full max-w-md bg-[#FCFCFC] rounded-xl shadow-lg overflow-y-auto border border-primary" style={{ minHeight: '250px', maxHeight: '80vh' }}>
            <div
              tabIndex={-1}
              ref={formRef}
              aria-label="Formulaire d'ajout de courrier"
              className="p-3"
            >
              <CourrierForm 
                type="DEPART" 
                onClose={() => setShowForm(false)} 
                onAddMail={handleAddMail} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal vue */}
      {modalType === 'view' && selectedMail && (
        <CourrierDetailModal 
          courrier={selectedMail} 
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
          type="DEPART"
        />
      )}

      {/* Modal édition */}
      {modalType === 'edit' && selectedMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#FCFCFC] rounded-xl shadow-lg p-4 overflow-y-auto border border-primary relative" style={{ minHeight: '320px', maxHeight: '85vh' }}>
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-600 hover:text-primary text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-primary">Éditer le courrier</h2>
            <CourrierForm
              type="DEPART"
              onClose={handleCloseModal}
              onAddMail={handleUpdateMail}
              initialValues={selectedMail}
            />
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-4">
        <MailTable
          mails={filteredMails}
          onRemove={handleRemove}
          search={search}
          setSearch={setSearch}
          onView={handleView}
          onEdit={handleEdit}
          lastAddedId={lastAddedId}
        />
      </div>
    </div>
  );
}