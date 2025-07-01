import React from 'react';
import FishFoodList from '../../../components/Lists/FishFoodList';
import { Package } from 'lucide-react';

const FishFoodPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <Package className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des aliments pour poissons</h1>
          <p className="text-gray-600">Gérez les aliments et leur stock dans votre système</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <FishFoodList />
      </div>
    </div>
  );
};

export default FishFoodPage; 