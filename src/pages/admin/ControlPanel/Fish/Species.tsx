import React from 'react';
import FishSpeciesList from '../../../components/Lists/FishSpeciesList';
import { Fish } from 'lucide-react';

const FishSpeciesPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Fish className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des espèces de poissons</h1>
          <p className="text-gray-600">Gérez les espèces de poissons disponibles dans votre système</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <FishSpeciesList />
      </div>
    </div>
  );
};

export default FishSpeciesPage; 