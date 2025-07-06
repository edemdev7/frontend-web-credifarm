import React, { useState } from 'react';

const HarvestCalendarPage = () => {
  const [mockHarvestCalendar, setMockHarvestCalendar] = useState([
    { id: 1, bassin: 'Bassin A', poisson: 'Tilapia', date: '2024-06-25', quantite: 500, statut: 'À venir' },
    { id: 2, bassin: 'Bassin B', poisson: 'Silure', date: new Date().toISOString().slice(0, 10), quantite: 300, statut: 'Aujourd\'hui' },
    { id: 3, bassin: 'Bassin C', poisson: 'Carpe', date: '2024-05-01', quantite: 200, statut: 'Terminé' },
    { id: 4, bassin: 'Bassin D', poisson: 'Tilapia', date: '2024-07-10', quantite: 600, statut: 'À venir' },
    { id: 5, bassin: 'Bassin E', poisson: 'Silure', date: '2024-06-01', quantite: 350, statut: 'Terminé' },
    { id: 6, bassin: 'Bassin F', poisson: 'Carpe', date: '2024-06-15', quantite: 400, statut: 'À venir' },
    { id: 7, bassin: 'Bassin G', poisson: 'Tilapia', date: '2024-06-20', quantite: 450, statut: 'À venir' },
    { id: 8, bassin: 'Bassin H', poisson: 'Silure', date: '2024-06-10', quantite: 320, statut: 'Terminé' },
    { id: 9, bassin: 'Bassin I', poisson: 'Carpe', date: '2024-06-18', quantite: 210, statut: 'À venir' },
    { id: 10, bassin: 'Bassin J', poisson: 'Tilapia', date: '2024-06-19', quantite: 510, statut: 'À venir' },
    { id: 11, bassin: 'Bassin K', poisson: 'Silure', date: '2024-06-17', quantite: 330, statut: 'À venir' },
    { id: 12, bassin: 'Bassin L', poisson: 'Carpe', date: '2024-06-16', quantite: 220, statut: 'À venir' },
  ]);

  const handleDeleteHarvest = (id) => {
    setMockHarvestCalendar(prev => prev.filter(item => item.id !== id));
  };
  const handleFinishHarvest = (id) => {
    setMockHarvestCalendar(prev => prev.map(item => item.id === id ? { ...item, statut: 'Terminé', date: new Date().toISOString().slice(0, 10) } : item));
  };

  return (
    <div className="bg-white rounded shadow p-4 overflow-x-auto flex flex-col items-center w-full">
      <h2 className="text-lg font-bold mb-4 text-center w-full">Calendrier de récoltes</h2>
      <div className="w-full flex justify-center mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow text-base"
          // onClick={() => ...} // à relier à un modal si besoin
        >
          Ajouter une récolte
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200 max-w-4xl mx-auto">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Bassin</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Type de poisson</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Date prévue</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Quantité prévue (kg)</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Statut</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockHarvestCalendar.map((item, idx) => {
            const today = new Date().toISOString().slice(0, 10);
            let color = '';
            let statutLabel = item.statut;
            if (item.date > today && item.statut !== 'Terminé') { color = 'bg-red-100 text-red-800'; statutLabel = 'À venir'; }
            else if (item.date === today && item.statut !== 'Terminé') { color = 'bg-yellow-100 text-yellow-800'; statutLabel = "Aujourd'hui"; }
            else if (item.statut === 'Terminé') { color = 'bg-green-100 text-green-800'; statutLabel = 'Terminé'; }
            if (statutLabel === 'À venir') color = 'bg-red-100 text-red-800';
            else if (statutLabel === "Aujourd'hui") color = 'bg-yellow-100 text-yellow-800';
            else if (statutLabel === 'Terminé') color = 'bg-green-100 text-green-800';
            return (
              <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 font-semibold">{item.bassin}</td>
                <td className="px-4 py-2">{item.poisson}</td>
                <td className="px-4 py-2">{new Date(item.date).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-2">{item.quantite}</td>
                <td className="px-4 py-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${color}`}>{statutLabel}</span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleFinishHarvest(item.id)} className="text-green-700 hover:text-white hover:bg-green-500 border border-green-500 p-1 rounded-full transition" title="Marquer comme fini">
                    ✓
                  </button>
                  <button onClick={() => handleDeleteHarvest(item.id)} className="text-red-700 hover:text-white hover:bg-red-500 border border-red-500 p-1 rounded-full transition" title="Supprimer">
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HarvestCalendarPage; 