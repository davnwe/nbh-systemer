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
        addToast(`✅ Statut mis à jour : ${newStatus}`, 'success');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      addToast('❌ Erreur lors de la mise à jour du statut', 'error');
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
    
    let parsedFiles = [];
    try {
      if (typeof mail.files === 'string') {
        parsedFiles = JSON.parse(mail.files);
      } else if (Array.isArray(mail.files)) {
        parsedFiles = mail.files;
      }
    } catch (error) {
      console.error('Erreur parsing fichiers:', error);
      return null;
    }
    
    return (
      <div className="space-y-2">
        {parsedFiles.map((file, index) => (
          <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg border">
            <div className="flex-shrink-0 w-6 h-6 bg-[#15514f] rounded flex items-center justify-center mr-2">
              <span className="text-white text-xs">📎</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {file.name || file.originalFilename || 'Fichier sans nom'}
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto relative">
        {/* Header compact */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#15514f] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📧</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Détails du courrier</h2>
                <p className="text-xs text-gray-500">{mail.numero}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content compact */}
        <div className="p-4 space-y-4">
          {/* Statut avec modification */}
          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-[#15514f]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-700">Statut actuel</label>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCurrentStatusConfig().color}`}>
                {currentStatus}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {STATUTS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={isUpdating || currentStatus === status.value}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    currentStatus === status.value
                      ? 'bg-[#15514f] text-white cursor-default'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-[#15514f] hover:text-[#15514f]'
                  } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUpdating && currentStatus !== status.value ? (
                    <div className="w-3 h-3 border border-gray-300 border-t-[#15514f] rounded-full animate-spin"></div>
                  ) : (
                    status.label
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Informations principales - 2 par 2 */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Objet</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded border text-xs">{mail.objet}</p>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Canal</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded border text-xs">{mail.canal || 'Non spécifié'}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Expéditeur</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded border text-xs">{mail.expediteur || 'Non spécifié'}</p>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Destinataire</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded border text-xs">{mail.destinataire || 'Non spécifié'}</p>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date de réception</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded border text-xs">{formatDate(mail.dateReception || mail.date)}</p>
            </div>
            
            {mail.reference && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Référence</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded border text-xs">{mail.reference}</p>
              </div>
            )}
          </div>

          {/* Délai */}
          {mail.delai && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Délai de réponse</label>
              <div className="bg-gray-50 p-2 rounded border">
                <p className="text-gray-900 text-xs">{mail.delai}</p>
              </div>
            </div>
          )}

          {/* Observations */}
          {mail.observations && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Observations</label>
              <div className="bg-gray-50 p-2 rounded border">
                <p className="text-gray-900 whitespace-pre-wrap text-xs">{mail.observations}</p>
              </div>
            </div>
          )}

          {/* Pièces jointes */}
          {mail.files && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pièces jointes</label>
              {renderFiles()}
            </div>
          )}
        </div>

        {/* Footer compact */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
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