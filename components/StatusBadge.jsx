import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    switch (statusLower) {
      case 'en attente':
      case 'en_attente':
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⏳',
          label: 'En attente'
        };
      case 'en cours':
      case 'en_cours':
      case 'in_progress':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '🔄',
          label: 'En cours'
        };
      case 'traité':
      case 'traite':
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '✅',
          label: 'Traité'
        };
      case 'archivé':
      case 'archive':
      case 'archived':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '📁',
          label: 'Archivé'
        };
      case 'rejeté':
      case 'rejete':
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '❌',
          label: 'Rejeté'
        };
      case 'nouveau':
      case 'new':
        return {
          color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          icon: '🆕',
          label: 'Nouveau'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '❓',
          label: status || 'Inconnu'
        };
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const config = getStatusConfig(status);

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-medium border
      ${config.color}
      ${sizeClasses[size]}
    `}>
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default StatusBadge;