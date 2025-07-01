import React, { useState } from 'react';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  // Tab state management
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data - in a real app this would come from your API
  const [members, setMembers] = useState([
    { id: 1, name: "Maria Garcia", farm: "Bassin du Soleil", region: "Abidjan", status: "Actif", joined: "Jan 2023" },
    { id: 2, name: "John Smith", farm: "Écloserie de la Vallée", region: "Bouaké", status: "Actif", joined: "Mar 2023" },
    { id: 3, name: "Ahmed Hassan", farm: "Ferme Piscicole du Fleuve", region: "San Pedro", status: "Actif", joined: "May 2023" },
    { id: 4, name: "Elena Rodriguez", farm: "Bassins de la Montagne", region: "Yamoussoukro", status: "En attente", joined: "-" },
  ]);
  
  const [loans, setLoans] = useState([
    { id: 101, member: "Maria Garcia", amount: 5000, purpose: "Alevins et alimentation", status: "Actif", dueDate: "Déc 2025" },
    { id: 102, member: "John Smith", amount: 3500, purpose: "Équipement de pêche", status: "En attente", dueDate: "-" },
    { id: 103, member: "Ahmed Hassan", amount: 7500, purpose: "Système d'aération", status: "Actif", dueDate: "Août 2025" },
  ]);
  
  const [membershipRequests, setMembershipRequests] = useState([
    { id: 201, name: "Elena Rodriguez", farm: "Bassins de la Montagne", region: "Yamoussoukro", type: "Pisciculture intensive", date: "15 Fév 2025" },
    { id: 202, name: "Luis Fernandez", farm: "Ferme Aquacole des Collines", region: "Korhogo", type: "Pisciculture extensive", date: "20 Fév 2025" },
  ]);
  
  const [loanRequests, setLoanRequests] = useState([
    { id: 301, member: "John Smith", amount: 3500, purpose: "Alevins de tilapia", date: "18 Fév 2025" },
    { id: 302, member: "Sara Johnson", amount: 6000, purpose: "Système de filtration", date: "21 Fév 2025" },
  ]);
  
  const monthlyLoanData = [
    { month: 'Jan', amount: 12500 },
    { month: 'Fév', amount: 15000 },
    { month: 'Mar', amount: 13200 },
    { month: 'Avr', amount: 16500 },
    { month: 'Mai', amount: 14700 },
    { month: 'Juin', amount: 18000 },
    { month: 'Juil', amount: 16300 },
    { month: 'Août', amount: 17500 },
  ];
  
  const membersByRegion = [
    { region: 'Abidjan', count: 32 },
    { region: 'Bouaké', count: 15 },
    { region: 'Yamoussoukro', count: 12 },
    { region: 'Korhogo', count: 8 },
    { region: 'San Pedro', count: 14 },
    { region: 'Daloa', count: 7 },
    { region: 'Man', count: 9 },
    { region: 'Divo', count: 5 },
  ];
  
  // Function to approve/reject applications (would connect to backend in real app)
  const handleMembershipRequest = (id: number, approved: boolean) => {
    // Update UI immediately while backend processes would happen in real app
    setMembershipRequests(membershipRequests.filter(req => req.id !== id));
    if (approved) {
      const newMember = membershipRequests.find(req => req.id === id);
      if (newMember) {
        setMembers([...members, {
          id: members.length + 1,
          name: newMember.name,
          farm: newMember.farm,
          region: newMember.region,
          status: "Actif",
          joined: "Fév 2025"
        }]);
      }
    }
  };
  
  const handleLoanRequest = (id: number, approved: boolean) => {
    setLoanRequests(loanRequests.filter(req => req.id !== id));
    if (approved) {
      const newLoan = loanRequests.find(req => req.id === id);
      if (newLoan) {
        setLoans([...loans, {
          id: loans.length + 1,
          member: newLoan.member,
          amount: newLoan.amount,
          purpose: newLoan.purpose,
          status: "Actif",
          dueDate: "Fév 2026"
        }]);
      }
    }
  };
  
  // Simple Card component
  const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {children}
    </div>
  );
  
  // Simple Tab Button
  const TabButton = ({ label, value, active, onClick }: { label: string; value: string; active: boolean; onClick: (value: string) => void }) => (
    <button
      className={`px-4 py-2 rounded-t-lg ${active ? 'bg-white text-green-700 border-b-2 border-green-700' : 'bg-gray-100 text-gray-700'}`}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
  
  // Icons replacement
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
  
  const XOFIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Circular coin shape */}
      <circle cx="12" cy="12" r="10"></circle>
      {/* 'CFA' text representation */}
      <path d="M8 8c0 0 -1.5 0 -1.5 2s1.5 2 1.5 2"></path>
      <path d="M8 8h2"></path>
      <path d="M8 12h2"></path>
      <path d="M11 8v4h1.5c1 0 1.5 -0.5 1.5 -1v-2c0 -0.5 -0.5 -1 -1.5 -1z"></path>
      <path d="M16 8l-2 4"></path>
      <path d="M14 8l2 4"></path>
      {/* Small horizontal line below to indicate currency */}
      <path d="M9 15h6"></path>
    </svg>
  );
  
  const UserPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <line x1="20" y1="8" x2="20" y2="14"></line>
      <line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
  );
  
  const FishIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
      <path d="M6 9h12"></path>
    </svg>
  );
  
  const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
  
  // Render Ivory Coast map with member distribution
  const IvoryCoastMap = () => (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      {/* Simple outline of Ivory Coast */}
      <path d="M100,100 L150,70 L200,60 L250,80 L300,120 L320,180 L300,240 L250,270 L200,290 L150,270 L120,230 L100,180 Z" 
        fill="#E8F5E9" stroke="#2E7D32" strokeWidth="2" />
      
      {/* Cities with member counts - size based on count */}
      <circle cx="220" cy="260" r={32 / 2 + 5} fill="#1B5E20" opacity="0.7" /> {/* Abidjan */}
      <text x="220" y="260" textAnchor="middle" fill="white" fontSize="10">Abidjan (32)</text>
      
      <circle cx="180" cy="150" r={15 / 2 + 5} fill="#2E7D32" opacity="0.7" /> {/* Bouaké */}
      <text x="180" y="150" textAnchor="middle" fill="white" fontSize="9">Bouaké (15)</text>
      
      <circle cx="195" cy="180" r={12 / 2 + 5} fill="#388E3C" opacity="0.7" /> {/* Yamoussoukro */}
      <text x="195" y="180" textAnchor="middle" fill="white" fontSize="8">Yamoussoukro (12)</text>
      
      <circle cx="150" cy="120" r={8 / 2 + 5} fill="#43A047" opacity="0.7" /> {/* Korhogo */}
      <text x="150" y="120" textAnchor="middle" fill="white" fontSize="8">Korhogo (8)</text>
      
      <circle cx="280" cy="230" r={14 / 2 + 5} fill="#388E3C" opacity="0.7" /> {/* San Pedro */}
      <text x="280" y="230" textAnchor="middle" fill="white" fontSize="8">San Pedro (14)</text>
      
      <circle cx="140" cy="180" r={7 / 2 + 5} fill="#4CAF50" opacity="0.7" /> {/* Daloa */}
      <text x="140" y="180" textAnchor="middle" fill="white" fontSize="8">Daloa (7)</text>
      
      <circle cx="120" cy="200" r={9 / 2 + 5} fill="#43A047" opacity="0.7" /> {/* Man */}
      <text x="120" y="200" textAnchor="middle" fill="white" fontSize="8">Man (9)</text>
      
      <circle cx="190" cy="225" r={5 / 2 + 5} fill="#66BB6A" opacity="0.7" /> {/* Divo */}
      <text x="190" y="225" textAnchor="middle" fill="white" fontSize="8">Divo (5)</text>
      
      {/* Legend */}
      <rect x="100" y="300" width="200" height="40" fill="white" stroke="#ddd" />
      <text x="105" y="315" fontSize="10" fill="#333">Répartition des pisciculteurs</text>
      <circle cx="120" cy="330" r="3" fill="#1B5E20" opacity="0.7" />
      <text x="130" y="333" fontSize="9" fill="#333">1-10</text>
      <circle cx="160" cy="330" r="5" fill="#388E3C" opacity="0.7" />
      <text x="170" y="333" fontSize="9" fill="#333">11-20</text>
      <circle cx="200" cy="330" r="7" fill="#43A047" opacity="0.7" />
      <text x="210" y="333" fontSize="9" fill="#333">21-30</text>
      <circle cx="240" cy="330" r="9" fill="#4CAF50" opacity="0.7" />
      <text x="250" y="333" fontSize="9" fill="#333">31+</text>
    </svg>
  );
  
  // Render different tab content based on activeTab state
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <Card>
              <h2 className="text-lg font-semibold mb-1">Activité Récente</h2>
              <p className="text-sm text-gray-500 mb-4">Dernières actions et mises à jour de la pisciculture</p>
              <ul className="space-y-2">
                <li className="p-2 bg-gray-50 rounded flex items-center">
                  <span className="text-green-500 mr-2"><CheckCircleIcon /></span>
                  <span>Crédit #103 approuvé pour Ahmed Hassan - 7 500 FCFA (Système d'aération)</span>
                  <span className="ml-auto text-sm text-gray-500">Aujourd'hui</span>
                </li>
                <li className="p-2 bg-gray-50 rounded flex items-center">
                  <span className="text-blue-500 mr-2"><UserPlusIcon /></span>
                  <span>Nouvelle demande d'adhésion de Luis Fernandez (Pisciculture extensive)</span>
                  <span className="ml-auto text-sm text-gray-500">Hier</span>
                </li>
                <li className="p-2 bg-gray-50 rounded flex items-center">
                  <span className="text-yellow-500 mr-2"><XOFIcon /></span>
                  <span>Remboursement de crédit reçu de Maria Garcia - 500 FCFA (Alevins)</span>
                  <span className="ml-auto text-sm text-gray-500">Il y a 2 jours</span>
                </li>
                <li className="p-2 bg-gray-50 rounded flex items-center">
                  <span className="text-purple-500 mr-2"><FishIcon /></span>
                  <span>Nouvelle récolte de tilapia enregistrée - Bassin #12 (150 kg)</span>
                  <span className="ml-auto text-sm text-gray-500">Il y a 3 jours</span>
                </li>
              </ul>
            </Card>
            
          </div>
        );
        
      case 'members':
        return (
          <Card>
            <h2 className="text-lg font-semibold mb-1">Pisciculteurs de la Coopérative</h2>
            <p className="text-sm text-gray-500 mb-4">Voir et gérer tous les comptes des pisciculteurs membres</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2">Nom</th>
                    <th className="text-left p-2">Ferme Piscicole</th>
                    <th className="text-left p-2">Région</th>
                    <th className="text-left p-2">Statut</th>
                    <th className="text-left p-2">Inscrit</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{member.name}</td>
                      <td className="p-2">{member.farm}</td>
                      <td className="p-2">{member.region}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${member.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="p-2">{member.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
        
      case 'loans':
        return (
          <Card>
            <h2 className="text-lg font-semibold mb-1">Gestion des Crédits Piscicoles</h2>
            <p className="text-sm text-gray-500 mb-4">Suivre et gérer tous les crédits pour l'équipement et les intrants piscicoles</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Pisciculteur</th>
                    <th className="text-left p-2">Montant</th>
                    <th className="text-left p-2">Objet</th>
                    <th className="text-left p-2">Statut</th>
                    <th className="text-left p-2">Date d'échéance</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map(loan => (
                    <tr key={loan.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">#{loan.id}</td>
                      <td className="p-2">{loan.member}</td>
                      <td className="p-2">{loan.amount.toLocaleString()} FCFA</td>
                      <td className="p-2">{loan.purpose}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${loan.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="p-2">{loan.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
        
      case 'requests':
        return (
          <div className="space-y-4">
            <Card>
              <h2 className="text-lg font-semibold mb-1">Demandes d'Adhésion Piscicole</h2>
              <p className="text-sm text-gray-500 mb-4">Examiner et traiter les nouvelles demandes d'adhésion de pisciculteurs</p>
              {membershipRequests.length > 0 ? (
                <div className="space-y-4">
                  {membershipRequests.map(request => (
                    <div key={request.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-semibold">{request.name}</h4>
                        <span className="text-sm text-gray-500">Demande: {request.date}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                        <div>
                          <span className="text-xs text-gray-500">Ferme Piscicole</span>
                          <p>{request.farm}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Région</span>
                          <p>{request.region}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Type de pisciculture</span>
                          <p>{request.type}</p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleMembershipRequest(request.id, false)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Rejeter
                        </button>
                        <button 
                          onClick={() => handleMembershipRequest(request.id, true)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approuver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-gray-500">Aucune demande d'adhésion piscicole en attente</p>
              )}
            </Card>
            
            <Card>
              <h2 className="text-lg font-semibold mb-1">Demandes de Crédits Piscicoles</h2>
              <p className="text-sm text-gray-500 mb-4">Examiner et traiter les demandes de crédits des pisciculteurs pour l'équipement et les intrants</p>
              {loanRequests.length > 0 ? (
                <div className="space-y-4">
                  {loanRequests.map(request => (
                    <div key={request.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-semibold">{request.member}</h4>
                        <span className="text-sm text-gray-500">Demandé le: {request.date}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        <div>
                          <span className="text-xs text-gray-500">Montant</span>
                          <p className="font-semibold">{request.amount.toLocaleString()} FCFA</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Objet</span>
                          <p>{request.purpose}</p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleLoanRequest(request.id, false)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Rejeter
                        </button>
                        <button 
                          onClick={() => handleLoanRequest(request.id, true)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approuver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-gray-500">Aucune demande de crédit piscicole en attente</p>
              )}
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <main className="pt-[70px] pb-5 ~px-3/10 pl-5 pr-5">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="~text-base/lg font-bold uppercase mb-4">TABLEAU DE BORD PISCICOLE</h1>     
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="flex items-center">
            <span className="h-8 w-8 text-blue-500 mr-4"><UserIcon /></span>
            <div>
              <p className="text-sm text-gray-500">Total Pisciculteurs</p>
              <h3 className="text-2xl font-bold">{members.filter(m => m.status === "Actif").length}</h3>
            </div>
          </Card>
          
          <Card className="flex items-center">
            <span className="h-8 w-8 text-green-500 mr-4"><XOFIcon /></span>
            <div>
              <p className="text-sm text-gray-500">Crédits piscicoles actifs</p>
              <h3 className="text-2xl font-bold">{loans.filter(l => l.status === "Actif").length}</h3>
            </div>
          </Card>
          
          <Card className="flex items-center">
            <span className="h-8 w-8 text-yellow-500 mr-4"><UserPlusIcon /></span>
            <div>
              <p className="text-sm text-gray-500">Demandes d'adhésion</p>
              <h3 className="text-2xl font-bold">{membershipRequests.length}</h3>
            </div>
          </Card>
          
          <Card className="flex items-center">
            <span className="h-8 w-8 text-red-500 mr-4"><FishIcon /></span>
            <div>
              <p className="text-sm text-gray-500">Demandes de crédits</p>
              <h3 className="text-2xl font-bold">{loanRequests.length}</h3>
            </div>
          </Card>
        </div>
        
        {/* Main Dashboard */}
        <div className="space-y-4">
          <div className="flex space-x-1 border-b">
            <TabButton label="Aperçu" value="overview" active={activeTab === 'overview'} onClick={setActiveTab} />
            <TabButton label="Pisciculteurs" value="members" active={activeTab === 'members'} onClick={setActiveTab} />
            <TabButton label="Crédits" value="loans" active={activeTab === 'loans'} onClick={setActiveTab} />
            <TabButton label="Demandes en attente" value="requests" active={activeTab === 'requests'} onClick={setActiveTab} />
          </div>
          
          {renderTabContent()}
        </div>
    </div>
    </main>
  );
};

export default AdminDashboard;