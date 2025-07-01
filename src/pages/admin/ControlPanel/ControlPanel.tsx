import React, { useState, ChangeEvent } from 'react';
import { Plus, Pencil, Trash2, Eye, Search, ChevronLeft, ChevronRight, Filter, ArrowLeft, 
  Building, User, Map, Leaf, Settings, Droplet } from 'lucide-react';
import { isSuperAdmin } from "../../../api/services/admin/adminService";
import { useEffect } from 'react';
import AdminList  from './Admin/List';
import RegionList from './Region/List';
import DepartmentList from './Department/List';
import EntryList from './Entries/List';
import CropList from './Crop/List';
import MemberList from '../../../components/Lists/MemberList';
import BassinList from '../../../components/Lists/BassinList';
import FishFarmerList from '../../../components/Lists/FishFarmerList';
import FishSpeciesList from '../../../components/Lists/FishSpeciesList';
import FishFoodList from '../../../components/Lists/FishFoodList';

interface Table {
  id: number;
  name: string;
  icon: React.ReactNode;
}

interface FormData {
  name: string;
  email: string;
  role: string;
  status: string;
  phone: string;
  address: string;
}

const ControlPanel = () => {
  // Données d'exemple
  const [superAdmin, setSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete', 'view'
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: '',
    status: '',
    phone: '',
    address: '',
  });
  const [viewMode, setViewMode] = useState(false);
  const [currentView, setCurrentView] = useState<any | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    async function checkAdmin() {
      try {
        const isAdmin = await isSuperAdmin();
        setSuperAdmin(isAdmin);
      } catch (error) {
        console.error("Failed to check admin status:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAdmin();
  }, []);

  const tables: Table[] = [
    superAdmin && { id: 1, name: 'Administrateurs', icon: <Eye /> },
    { id: 2, name: 'Bassins d\'eau', icon: <Droplet /> },
    { id: 3, name: 'Pisciculteurs', icon: <User /> },
    { id: 4, name: 'Régions', icon: <Map /> },
    { id: 5, name: 'Départements', icon: <Map /> },
    { id: 6, name: 'Espèces de poissons', icon: <Leaf /> },
    { id: 7, name: 'Aliments pour poissons', icon: <Settings /> },
  ].filter(Boolean) as Table[];
  
  const [userData, setUserData] = useState([
    { 
      id: 1, 
      name: 'Jean Dupont', 
      email: 'jean@exemple.fr', 
      role: 'Administrateur', 
      status: 'Actif',
      phone: '06 12 34 56 78',
      address: '123 Rue Principale, Paris, 75001',
      joinDate: '12/05/2023',
      lastLogin: '28/02/2025',
      permissions: ['utilisateurs:gérer', 'contenu:éditer', 'paramètres:tous']
    },
    { 
      id: 2, 
      name: 'Marie Leroy', 
      email: 'marie@exemple.fr', 
      role: 'Éditeur', 
      status: 'Actif',
      phone: '06 23 45 67 89',
      address: '456 Avenue des Champs, Lyon, 69000',
      joinDate: '15/08/2023',
      lastLogin: '01/03/2025',
      permissions: ['contenu:éditer', 'média:télécharger']
    },
    { 
      id: 3, 
      name: 'Pierre Martin', 
      email: 'pierre@exemple.fr', 
      role: 'Visiteur', 
      status: 'Inactif',
      phone: '06 34 56 78 90',
      address: '789 Boulevard du Pin, Marseille, 13000',
      joinDate: '20/01/2024',
      lastLogin: '15/01/2025',
      permissions: ['contenu:voir']
    },
    { 
      id: 4, 
      name: 'Sophie Blanc', 
      email: 'sophie@exemple.fr', 
      role: 'Éditeur', 
      status: 'Actif',
      phone: '06 45 67 89 01',
      address: '321 Rue des Lilas, Toulouse, 31000',
      joinDate: '10/02/2024',
      lastLogin: '27/02/2025',
      permissions: ['contenu:éditer', 'média:télécharger', 'utilisateurs:voir']
    },
    { 
      id: 5, 
      name: 'Sophie Blanc', 
      email: 'sophie@exemple.fr', 
      role: 'Éditeur', 
      status: 'Actif',
      phone: '06 45 67 89 01',
      address: '321 Rue des Lilas, Toulouse, 31000',
      joinDate: '10/02/2024',
      lastLogin: '27/02/2025',
      permissions: ['contenu:éditer', 'média:télécharger', 'utilisateurs:voir']
    },
    { 
      id: 6, 
      name: 'Sophie Blanc', 
      email: 'sophie@exemple.fr', 
      role: 'Éditeur', 
      status: 'Actif',
      phone: '06 45 67 89 01',
      address: '321 Rue des Lilas, Toulouse, 31000',
      joinDate: '10/02/2024',
      lastLogin: '27/02/2025',
      permissions: ['contenu:éditer', 'média:télécharger', 'utilisateurs:voir']
    },
    { 
      id: 7, 
      name: 'Sophie Blanc', 
      email: 'sophie@exemple.fr', 
      role: 'Éditeur', 
      status: 'Actif',
      phone: '06 45 67 89 01',
      address: '321 Rue des Lilas, Toulouse, 31000',
      joinDate: '10/02/2024',
      lastLogin: '27/02/2025',
      permissions: ['contenu:éditer', 'média:télécharger', 'utilisateurs:voir']
    },
    { 
      id: 8, 
      name: 'Sophie Blanc', 
      email: 'sophie@exemple.fr', 
      role: 'Éditeur', 
      status: 'Actif',
      phone: '06 45 67 89 01',
      address: '321 Rue des Lilas, Toulouse, 31000',
      joinDate: '10/02/2024',
      lastLogin: '27/02/2025',
      permissions: ['contenu:éditer', 'média:télécharger', 'utilisateurs:voir']
    },
    { 
      id: 9, 
      name: 'Sophie Blanc', 
      email: 'sophie@exemple.fr', 
      role: 'Éditeur', 
      status: 'Actif',
      phone: '06 45 67 89 01',
      address: '321 Rue des Lilas, Toulouse, 31000',
      joinDate: '10/02/2024',
      lastLogin: '27/02/2025',
      permissions: ['contenu:éditer', 'média:télécharger', 'utilisateurs:voir']
    },
    { 
      id: 10, 
      name: 'Sophie Blanc', 
      email: 'sophie@exemple.fr', 
      role: 'Éditeur', 
      status: 'Actif',
      phone: '06 45 67 89 01',
      address: '321 Rue des Lilas, Toulouse, 31000',
      joinDate: '10/02/2024',
      lastLogin: '27/02/2025',
      permissions: ['contenu:éditer', 'média:télécharger', 'utilisateurs:voir']
    },

  ]);
  
  useEffect(() => {
    if (tables.length > 0 && !selectedTable) {
      // On cherche l'onglet Administrateurs (id:1), sinon on prend le premier
      const adminTable = tables.find((t) => t.id === 1);
      setSelectedTable(adminTable || tables[0]);
    }
  }, [tables, selectedTable]);
  
  // Gestion d'état
  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setSelectedItem(null);
    setIsMobileMenuOpen(false);
  };
  
  // Ouvrir modal pour créer un nouvel élément
  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      name: '',
      email: '',
      role: '',
      status: '',
      phone: '',
      address: '',
    });
    setIsModalOpen(true);
  };
  
  // Ouvrir modal pour modifier un élément
  const handleEdit = (item: any) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      name: item.name,
      email: item.email,
      role: item.role,
      status: item.status,
      phone: item.phone || '',
      address: item.address || '',
    });
    setIsModalOpen(true);
  };
  
  // Ouvrir modal pour supprimer un élément
  const handleDelete = (item: any) => {
    setModalMode('delete');
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  
  // Voir les détails d'un élément
  const handleView = (item: any) => {
    setCurrentView(item);
    setViewMode(true);
  };
  
  // Retour depuis la vue détaillée
  const handleBackFromView = () => {
    setViewMode(false);
    setCurrentView(null);
  };
  
  // Gestion des changements de formulaire
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Soumission du formulaire
  const handleSubmit = () => {
    if (modalMode === 'create') {
      const newItem = {
        id: userData.length + 1,
        ...formData,
        joinDate: new Date().toLocaleDateString('fr-FR'),
        lastLogin: new Date().toLocaleDateString('fr-FR'),
        permissions: ['contenu:voir']
      };
      setUserData([...userData, newItem]);
    } else if (modalMode === 'edit') {
      setUserData(userData.map(item => 
        item.id === selectedItem.id ? { ...item, ...formData } : item
      ));
    } else if (modalMode === 'delete') {
      setUserData(userData.filter(item => item.id !== selectedItem.id));
    }
    
    setIsModalOpen(false);
  };
  
  // Composant Modal
  const Modal = () => {
    if (!isModalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {modalMode === 'create' && `Créer un nouveau ${selectedTable?.name.slice(0, -1).toLowerCase()}`}
            {modalMode === 'edit' && `Modifier le ${selectedTable?.name.slice(0, -1).toLowerCase()}`}
            {modalMode === 'delete' && `Supprimer le ${selectedTable?.name.slice(0, -1).toLowerCase()}`}
            {modalMode === 'view' && `Détails du ${selectedTable?.name.slice(0, -1).toLowerCase()}`}
          </h2>
          
          {modalMode === 'delete' ? (
            <p>Êtes-vous sûr de vouloir supprimer {selectedItem.name} ?</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Rôle</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Éditeur">Éditeur</option>
                  <option value="Visiteur">Visiteur</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 text-white rounded-md transition-colors ${
                modalMode === 'delete' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {modalMode === 'create' && 'Créer'}
              {modalMode === 'edit' && 'Enregistrer'}
              {modalMode === 'delete' && 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Composant vue détaillée
  const DetailView = () => {
    if (!currentView) return null;
    
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
            <button 
              onClick={handleBackFromView} 
              className="mr-3 p-2 rounded-full hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold">{currentView.name}</h2>
            
            <div className="md:ml-auto flex space-x-2">
              <button
                onClick={() => handleEdit(currentView)}
                className="px-3 py-2 flex items-center text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Pencil size={16} className="mr-1" />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(currentView)}
                className="px-3 py-2 flex items-center text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} className="mr-1" />
                Supprimer
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Informations de base</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="block text-sm text-gray-500">Nom</span>
                      <span className="block mt-1 text-sm font-medium">{currentView.name}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Email</span>
                      <span className="block mt-1 text-sm font-medium">{currentView.email}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Téléphone</span>
                      <span className="block mt-1 text-sm font-medium">{currentView.phone || 'Non renseigné'}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Adresse</span>
                      <span className="block mt-1 text-sm font-medium">{currentView.address || 'Non renseignée'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Statut du compte</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="block text-sm text-gray-500">Rôle</span>
                      <span className="block mt-1 text-sm font-medium">{currentView.role}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Statut</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentView.status === 'Actif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {currentView.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Détails du compte</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="block text-sm text-gray-500">Date d'inscription</span>
                      <span className="block mt-1 text-sm font-medium">{currentView.joinDate}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Dernière connexion</span>
                      <span className="block mt-1 text-sm font-medium">{currentView.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Permissions</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {currentView.permissions && currentView.permissions.map((permission, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Journal d'activité</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="w-1 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <span className="block text-xs text-gray-500">01/03/2025 09:15</span>
                        <span className="block text-sm">Connexion réussie</span>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <span className="block text-xs text-gray-500">28/02/2025 14:22</span>
                        <span className="block text-sm">Mise à jour des informations de profil</span>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1 bg-yellow-500 rounded-full mr-3"></div>
                      <div>
                        <span className="block text-xs text-gray-500">27/02/2025 11:05</span>
                        <span className="block text-sm">Mot de passe modifié</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Composant vue tableau
  const TableView = () => {
    return (
      <>
        <header className="bg-white shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-xl font-semibold">{selectedTable?.name}</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full"
                />
              </div>
              <button className="flex items-center justify-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                <Filter size={16} className="mr-1" />
                Filtrer
              </button>
              <button
                onClick={handleCreate}
                className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                Créer
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userData.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-gray-500 md:hidden text-sm">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-gray-500">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'Actif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleView(user)}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                            title="Voir les détails"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        
        {/* <footer className="bg-white p-4 border-t">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-500">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">4</span> sur <span className="font-medium">4</span> résultats
            </div>
            <div className="flex-1 flex justify-end">
              <nav className="flex space-x-2" aria-label="Pagination">
                <button className="p-2 rounded-md border hover:bg-gray-50">
                  <ChevronLeft size={16} />
                </button>
                <button className="px-3 py-2 rounded-md border bg-blue-50 text-blue-600 border-blue-500">
                  1
                </button>
                <button className="p-2 rounded-md border hover:bg-gray-50">
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </footer> */}
      </>
    );
  };

  // Composant barre latérale mobile
  const MobileSidebar = () => {
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="w-64 h-full bg-white" onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b">
            <h1 className="text-base font-bold uppercase">RÉFÉRENTIEL</h1>
          </div>
          <nav className="p-2">
            {tables.map(table => (
              <button
                key={table.id}
                onClick={() => handleTableSelect(table)}
                className={`w-full text-left p-3 rounded-md mb-1 flex items-center ${
                  selectedTable?.id === table.id
                    ? 'bg-green-100 text-green-700'
                    : 'hover:bg-green-100'
                }`}
              >
                <span className="mr-2">{table.icon}</span>
                {table.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    );
  };
  
  const renderTable = () => {
    if (!selectedTable) return null;

    switch (selectedTable.id) {
      case 1:
        return <AdminList />;
      case 2:
        return <BassinList />;
      case 3:
        return <FishFarmerList />;
      case 4:
        return <RegionList />;
      case 5:
        return <DepartmentList />;
      case 6:
        return <FishSpeciesList />;
      case 7:
        return <FishFoodList />;
      default:
        return null;
    }
  };
  
  return (
    <main className="pt-[70px] pb-5 ~px-3/10">
    <main className="min-h-[150px] bg-gray-100">
      {/* En-tête mobile */}
      <div className="md:hidden bg-white p-4 shadow-md flex justify-between items-center">
        <button 
          className="p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-bold">{selectedTable?.name}</h1>
        <div className="w-6 h-6"></div> {/* Élément vide pour équilibrer l'en-tête */}
      </div>
      
      {/* Panneau mobile */}
      <MobileSidebar />
      
      <div className="flex flex-col md:flex-row md:h-[75vh]">
        {/* Barre latérale (cachée sur mobile) */}
        <div className="hidden md:block md:w-64 bg-white shadow-md">
          <div className="p-4 border-b">
            <h1 className="text-base font-bold uppercase">RÉFÉRENTIEL</h1>
          </div>
          <nav className="p-2">
            {tables.map(table => (
              <button
                key={table.id}
                onClick={() => handleTableSelect(table)}
                className={`w-full text-left p-3 rounded-md mb-1 flex items-center ${
                  selectedTable?.id === table.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{table.icon}</span>
                {table.name}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1 overflow-hidden flex flex-col p-2">
          {renderTable()}
        </div>
        
        {/* Modal */}
        <Modal />
      </div>
    </main>
    </main>
  );
};

export default ControlPanel;