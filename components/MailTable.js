
import { useState, useRef, useEffect } from 'react';
import StatusBadge from './StatusBadge';

export default function MailTable({ 
  mails, 
  onRemove, 
  onView, 
  onEdit, 
  lastAddedId, 
  onStatusUpdate 
}) {
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    if (lastAddedId) {
      const element = document.querySelector(`[data-courrier-id="${lastAddedId}"]`);
      if (element) {
        element.classList.add('highlight-new');
        setTimeout(() => {
          element.classList.remove('highlight-new');
        }, 3000);
      }
    }
  }, [lastAddedId]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedMails = [...mails].sort((a, b) => {
    if (!sortBy) return 0;
    
    let aVal = a[sortBy] || '';
    let bVal = b[sortBy] || '';
    
    if (sortBy === 'dateReception' || sortBy === 'dateCreation') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return '-';
    }
  };

  const handleStatusChange = (id, newStatus) => {
    onStatusUpdate(id, newStatus);
  };

  if (mails.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-lg">Aucun courrier trouvé</p>
        <p className="text-sm mt-2">Commencez par ajouter un nouveau courrier</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('objet')}
              >
                Objet {sortBy === 'objet' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('expediteur')}
              >
                Expéditeur {sortBy === 'expediteur' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('dateReception')}
              >
                Date {sortBy === 'dateReception' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('statut')}
              >
                Statut {sortBy === 'statut' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedMails.map((mail) => (
              <tr 
                key={mail.id}
                data-courrier-id={mail.id}
                className={`hover:bg-gray-50 transition-colors ${
                  mail.id === lastAddedId ? 'bg-green-50' : ''
                }`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {mail.objet || 'Sans objet'}
                  </div>
                  {mail.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {mail.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {mail.expediteur || '-'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(mail.dateReception || mail.dateCreation)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <select
                    value={mail.statut || 'En attente'}
                    onChange={(e) => handleStatusChange(mail.id, e.target.value)}
                    className="text-xs px-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Traité">Traité</option>
                    <option value="Archivé">Archivé</option>
                  </select>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(mail)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Voir les détails"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => onEdit(mail)}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onRemove(mail.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
