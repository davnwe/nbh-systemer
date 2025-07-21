# NBH Mail System

Système complet de gestion de courriers développé avec **Next.js 14**, **React 18**, **Tailwind CSS** et **SQLite**. Une solution moderne offrant une interface intuitive pour la gestion des courriers entrants et sortants avec stockage persistant.

## 🚀 Fonctionnalités principales

### 📧 Gestion des courriers
- **Courriers arrivés** : Enregistrement, suivi et traitement des courriers entrants avec numérotation automatique (ARR-00001, ARR-00002...)
- **Courriers départs** : Création et suivi des courriers sortants avec numérotation automatique (DEP-00001, DEP-00002...)
- **Modification de statut** : Changement de statut en temps réel (En attente, En cours, Traité, Archivé)
- **Recherche avancée** : Filtrage par objet, expéditeur, destinataire
- **Gestion des pièces jointes** : Upload et prévisualisation de fichiers

### 🎯 Interface utilisateur
- **Design responsive** : Adaptation mobile, tablette et desktop
- **Navigation adaptative** : Sidebar desktop, bottom navigation mobile
- **Thème moderne** : Interface claire avec couleurs harmonieuses (#15514f)
- **Animations fluides** : Transitions et micro-interactions
- **Modales interactives** : Affichage détaillé des courriers avec modification de statut

### 📊 Tableau de bord
- **Dashboard interactif** avec vue d'ensemble
- **Gestion des partenaires** : Carnet d'adresses intégré avec invitation par email
- **Système d'authentification** : Connexion sécurisée avec rôles (Admin, Employé, RH, Manager)
- **Notifications toast** : Retours visuels pour toutes les actions

### 🔍 Fonctionnalités avancées
- **Tri dynamique** : Par date, expéditeur, destinataire, statut
- **Pagination** : Navigation par pages (10 éléments par page)
- **Expansion de contenu** : Affichage tronqué avec boutons d'extension
- **Stockage hybride** : LocalStorage + API pour la persistance
- **Génération automatique** : Numéros d'enregistrement séquentiels

## 🏗️ Architecture technique

### Structure du projet
```
nbh-mail-system/
├── components/              # Composants React réutilisables
│   ├── CourrierArrive.jsx  # Gestion courriers arrivés
│   ├── CourrierDepart.jsx  # Gestion courriers départs
│   ├── CourrierForm.jsx    # Formulaire de saisie
│   ├── MailTable.js        # Tableau avec tri/pagination
│   ├── MailModal.js        # Modale de détails
│   ├── Partenaires.jsx     # Gestion des partenaires
│   ├── ToastContainer.jsx  # Système de notifications
│   └── ...
├── pages/                  # Pages Next.js
│   ├── api/               # API routes
│   │   ├── courrier-arrive.js
│   │   ├── courrier-depart.js
│   │   ├── partenaires.js
│   │   └── send-email.js
│   ├── dashboard/         # Pages du tableau de bord
│   └── ...
├── hooks/                 # Hooks personnalisés
│   ├── useCourrierStorage.js  # Gestion stockage courriers
│   ├── useMailList.js         # Gestion listes de courriers
│   └── useTranslation.js      # Internationalisation
├── models/                # Modèles Sequelize
│   └── Courrier.js        # Modèle courrier
├── config/                # Configuration base de données
├── locales/               # Traductions FR/EN
├── utils/                 # Utilitaires
└── styles/                # Styles globaux
```

### Technologies utilisées
- **Framework** : Next.js 14 (React 18)
- **Base de données** : SQLite avec Sequelize ORM
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icons** : Heroicons, React Icons
- **Formulaires** : React Hook Form avec Zod
- **Email** : Nodemailer pour l'envoi d'emails
- **Tests** : Jest avec React Testing Library

## 🗄️ Gestion des données

### Modèle de données
Le système utilise un modèle unifié pour les courriers :
```javascript
{
  id: Number,
  numero: String,           // ARR-00001 ou DEP-00001
  dateReception: Date,
  dateSignature: Date,
  objet: String,
  canal: String,            // Physique, E-mail, En ligne
  expediteur: String,
  destinataire: String,
  reference: String,
  delai: String,
  statut: String,           // En attente, En cours, Traité, Archivé
  observations: Text,
  files: Text,              // JSON des fichiers joints
  type: String,             // ARRIVE ou DEPART
  createdAt: Date,
  updatedAt: Date
}
```

### Stockage hybride
- **SQLite** : Base de données principale avec Sequelize
- **LocalStorage** : Cache côté client pour performance
- **API Routes** : Endpoints RESTful pour CRUD operations

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd nbh-mail-system

# Installer les dépendances
npm install

# Synchroniser la base de données
node sync-db.js

# Lancer en développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Scripts disponibles
```bash
npm run dev      # Démarrage développement
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Vérification ESLint
npm run test     # Tests Jest
```

## 📱 Interface utilisateur

### Composants principaux
- **MailTable** : Tableau avec tri, pagination, recherche et actions
- **CourrierForm** : Formulaire multi-étapes pour saisie
- **MailModal** : Modale de détails avec modification de statut
- **Partenaires** : Gestion complète des partenaires avec invitation
- **ToastContainer** : Système de notifications contextuelles

### Navigation
- **Desktop** : Sidebar fixe avec navigation principale
- **Mobile** : Bottom navigation responsive
- **Accessibilité** : Navigation clavier, ARIA labels, contraste optimisé

## 🔐 Authentification et sécurité

### Système d'authentification
- **Pages** : Login, Register, Reset Password
- **Stockage** : LocalStorage pour simulation (prêt pour JWT)
- **Rôles** : Admin, Employé, RH, Manager
- **Protection** : Routes protégées par rôle

### Exemple d'utilisation
```javascript
// Connexion utilisateur
const { user, login, logout } = useAuth();

// Protection par rôle
<RoleGuard allowedRoles={['admin', 'employee']}>
  <ProtectedComponent />
</RoleGuard>
```

## 📊 Fonctionnalités du tableau

### MailTable.js
- **Tri dynamique** : Clic sur colonnes pour trier
- **Pagination** : Navigation par pages (10 items/page)
- **Recherche** : Filtrage temps réel multi-critères
- **Expansion** : Boutons [...] pour contenu tronqué
- **Actions** : Voir (modale), modifier, supprimer
- **Responsive** : Vue mobile optimisée avec cartes

### Statuts et couleurs
```javascript
const STATUS_COLORS = {
  'en attente': 'bg-yellow-500/20 text-yellow-400',
  'en cours': 'bg-blue-500/20 text-blue-400',
  'traité': 'bg-green-500/20 text-green-400',
  'archivé': 'bg-gray-500/20 text-gray-300'
};
```

## 🌐 Internationalisation

Support multilingue avec `useTranslation` hook :
- **Français** (défaut)
- **Anglais**

Configuration dans `/locales/[langue]/common.json`

## 📧 Système d'email

### Configuration Nodemailer
```javascript
// Configuration SMTP Gmail
const transporter = nodemailer.createTransporter({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

### Fonctionnalités email
- **Invitation partenaires** : Envoi automatique d'invitations
- **Templates HTML** : Emails formatés avec style
- **Gestion d'erreurs** : Retry et fallback

## 🧪 Tests et qualité

### Tests inclus
- **Composants** : React Testing Library
- **Accessibilité** : Tests axe-core automatisés
- **Navigation** : Tests clavier et ARIA

### Lancement des tests
```bash
npm test                    # Tests unitaires
npm run lint               # Vérification code
```

## 🔄 API Routes

### Endpoints disponibles
- `GET/POST /api/courrier-arrive` : Courriers entrants
- `GET/POST /api/courrier-depart` : Courriers sortants  
- `GET/POST /api/partenaires` : Gestion partenaires
- `POST /api/send-email` : Envoi emails

### Exemple d'utilisation
```javascript
// Ajouter un courrier
const response = await fetch('/api/courrier-arrive', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(courrierData)
});
```

## 🎨 Personnalisation

### Thème Tailwind
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#15514f',
          dark: '#0f3e3c',
          light: '#1a5f5c',
        },
        accent: '#f59e42',
        success: '#22c55e',
        warning: '#fbbf24',
        danger: '#ef4444',
      }
    }
  }
}
```

### Composants réutilisables
- **Button** : Variantes et tailles multiples
- **Modal** : Fenêtres modales avec animations
- **Toast** : Notifications contextuelles
- **Badge** : Étiquettes de statut colorées

## 🔄 Hooks personnalisés

### useCourrierStorage
```javascript
const { 
  courriers, 
  loading, 
  addCourrier, 
  updateCourrier, 
  deleteCourrier 
} = useCourrierStorage('ARRIVE');
```

### useMailList
```javascript
const { 
  mails, 
  addMail, 
  updateMail, 
  deleteMail 
} = useMailList('arrive');
```

## 📋 Fonctionnalités détaillées

### Génération automatique des numéros
- **Format** : ARR-00001, ARR-00002... pour les arrivées
- **Format** : DEP-00001, DEP-00002... pour les départs
- **Logique** : Séquentiel basé sur les courriers existants
- **Gestion** : Padding automatique sur 5 chiffres

### Gestion des fichiers
- **Upload** : Drag & drop ou sélection
- **Types** : PDF, DOC, XLS, JPG, PNG
- **Taille** : Maximum 10 Mo par fichier
- **Prévisualisation** : Aperçu avec nom et taille

### Système de statuts
- **En attente** : Nouveau courrier non traité
- **En cours** : Courrier en cours de traitement
- **Traité** : Courrier complètement traité
- **Archivé** : Courrier archivé pour historique

## 🚀 Déploiement

### Variables d'environnement
```env
# Email configuration
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="NBH Mail System <noreply@nbh.com>"

# Database (optionnel pour SQLite)
DATABASE_URL=sqlite:./database.sqlite
```

### Build et déploiement
```bash
# Build production
npm run build

# Démarrer en production
npm start
```

## 🤝 Contribution

### Standards de développement
- **ESLint** : Configuration Next.js
- **Prettier** : Formatage automatique
- **Tests** : Couverture minimum recommandée
- **Accessibilité** : WCAG 2.1 AA

### Structure des composants
```jsx
import { useState } from 'react';
import { useToast } from './ToastContainer';

export default function Component({ props }) {
  const [state, setState] = useState();
  const { addToast } = useToast();
  
  return (
    <div className="component-styles">
      {/* Contenu */}
    </div>
  );
}
```

## 📞 Support et maintenance

- **Documentation** : Commentaires dans le code
- **Tests** : Exemples d'utilisation inclus
- **Logs** : Console détaillée pour debugging
- **Performance** : Optimisations React et Next.js

## 📄 Licence

Projet sous licence MIT.

---

> **NBH Mail System** - Solution complète de gestion de courriers avec interface moderne, fonctionnalités avancées et architecture scalable.

## 🔗 Liens utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Sequelize ORM](https://sequelize.org/docs)