import React from 'react';
import BassinList from '../../../components/Lists/BassinList';

const BassinListPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Bassins</h1>
        <p className="text-gray-600 mt-2">
          Gérez les bassins de pisciculture, leurs assignations et leurs performances
        </p>
      </div>
      
      <BassinList />
    </div>
  );
};

export default BassinListPage; 