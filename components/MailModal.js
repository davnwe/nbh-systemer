import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from './ToastContainer';

const STATUTS = [
  { value: 'En attente', label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'En cours', label: 'En cours', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'Traité', label: 'Traité', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'Archivé', label: 'Archivé', color: 'bg-gray-100 text-gray-800 border-gray-200' }
];

export function MailModalDetail({ mail, onClose, onStatusUpdate, isOpen = true }) {
  const [currentStatus, setCurrentStatus] = useState(mail?.statut || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const { addToast } = useToast();

  if (!isOpen || !mail) return null;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(mail.id, newStatus);
        setCurrentStatus(newStatus);
        addToast(`Statut mis à jour : ${newStatus}`, 'success');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      addToast('Erreur lors de la mise à jour du statut', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const getCurrentStatusConfig = () => {
    return STATUTS.find(s => s.value === currentStatus) || STATUTS[0];
  };

  const renderFiles = () => {
    if (!mail.files || mail.files.length === 0) return null;
    
    return (
      <div className="space-y-2">
        {mail.files.map((file, index) => (
          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border">
            <div className="flex-shrink-0 w-8 h-8 bg-[#15514f] rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">📎</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name || 'Fichier sans nom'}
              </p>
              {file.size && (
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#15514f] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📧</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Détails du courrier</h2>
                <p className="text-sm text-gray-500">{mail.numero}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Statut avec modification */}
          <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#15514f]">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">Statut actuel</label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCurrentStatusConfig().color}`}>
                {currentStatus}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUTS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={isUpdating || currentStatus === status.value}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    currentStatus === status.value
                      ? 'bg-[#15514f] text-white cursor-default'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-[#15514f] hover:text-[#15514f]'
                  } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUpdating && currentStatus !== status.value ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[#15514f] rounded-full animate-spin"></div>
                  ) : (
                    status.label
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Objet</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{mail.objet}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Expéditeur</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{mail.expediteur || 'Non spécifié'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Canal</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{mail.canal || 'Non spécifié'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Destinataire</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{mail.destinataire || 'Non spécifié'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date de réception</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{formatDate(mail.dateReception || mail.date)}</p>
              </div>
              
              {mail.reference && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Référence</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{mail.reference}</p>
                </div>
              )}
            </div>
          </div>

          {/* Observations */}
          {mail.observations && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Observations</label>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-900 whitespace-pre-wrap">{mail.observations}</p>
              </div>
            </div>
          )}

          {/* Pièces jointes */}
          {mail.files && mail.files.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pièces jointes ({mail.files.length})</label>
              {renderFiles()}
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Informations système</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Créé le :</span>
                <span className="ml-2 text-gray-900">{formatDate(mail.createdAt)}</span>
              </div>
              {mail.updatedAt && mail.updatedAt !== mail.createdAt && (
                <div>
                  <span className="text-gray-500">Modifié le :</span>
                  <span className="ml-2 text-gray-900">{formatDate(mail.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MailModal({ mail, onClose, onStatusUpdate }) {
  return (
    <MailModalDetail 
      mail={mail} 
      isOpen={true}
      onClose={onClose} 
      onStatusUpdate={onStatusUpdate}
    />
  );
}