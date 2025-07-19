import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from './ToastContainer';
import LoadingSpinner from './LoadingSpinner';

const CourrierDetailModal = ({ courrier, isOpen, onClose, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { addToast } = useToast();

  if (!isOpen || !courrier) return null;

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(courrier.id, newStatus);
      addToast('Statut mis à jour avec succès', 'success');
      onClose();
    } catch (error) {
      addToast('Erreur lors de la mise à jour du statut', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'traite':
        return 'bg-green-100 text-green-800';
      case 'archive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Détails du courrier
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objet
              </label>
              <p className="text-gray-900 font-medium">{courrier.objet}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(courrier.statut)}`}>
                {courrier.statut?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expéditeur
              </label>
              <p className="text-gray-900">{courrier.expediteur || 'Non spécifié'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destinataire
              </label>
              <p className="text-gray-900">{courrier.destinataire || 'Non spécifié'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de création
              </label>
              <p className="text-gray-900">{formatDate(courrier.dateCreation)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'échéance
              </label>
              <p className="text-gray-900">{formatDate(courrier.dateEcheance)}</p>
            </div>
          </div>

          {courrier.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                {courrier.description}
              </p>
            </div>
          )}

          {courrier.fichiers && courrier.fichiers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichiers joints
              </label>
              <div className="space-y-2">
                {courrier.fichiers.map((fichier, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-900">{fichier.nom}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {fichier.taille ? `${(fichier.taille / 1024).toFixed(1)} KB` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions de mise à jour du statut */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Changer le statut
            </label>
            <div className="flex flex-wrap gap-2">
              {['en_attente', 'traite', 'archive'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={isUpdating || courrier.statut === status}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    courrier.statut === status
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                  }`}
                >
                  {isUpdating ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    status.replace('_', ' ').toUpperCase()
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourrierDetailModal;