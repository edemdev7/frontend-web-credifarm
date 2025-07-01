import { IFishSpecies, ICreateFishSpecies, IUpdateFishSpecies, IFishFood, ICreateFishFood, IUpdateFishFood } from '../../components/types/fish';
import { mockFishSpecies, mockFishFood } from '../mockData';
import { toast } from 'react-hot-toast';

// Simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Service pour les espèces de poissons
export const fishSpeciesService = {
  // Récupérer toutes les espèces
  async getAllFishSpecies(): Promise<IFishSpecies[]> {
    await delay(800);
    return [...mockFishSpecies];
  },

  // Récupérer une espèce par ID
  async getFishSpeciesById(id: number): Promise<IFishSpecies | null> {
    await delay(500);
    const species = mockFishSpecies.find(s => s.id === id);
    return species || null;
  },

  // Créer une nouvelle espèce
  async createFishSpecies(data: ICreateFishSpecies): Promise<IFishSpecies> {
    await delay(1000);
    
    // Simuler l'upload d'image
    let imageUrl = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop";
    if (data.image) {
      // En réalité, on uploaderait l'image vers un serveur
      imageUrl = URL.createObjectURL(data.image);
    }

    const newSpecies: IFishSpecies = {
      id: Math.max(...mockFishSpecies.map(s => s.id)) + 1,
      nom: data.nom,
      nom_scientifique: data.nom_scientifique,
      famille: data.famille,
      taille_moyenne: data.taille_moyenne,
      poids_moyen: data.poids_moyen,
      duree_vie: data.duree_vie,
      temperature_optimale: data.temperature_optimale,
      ph_optimal: data.ph_optimal,
      description: data.description,
      image_url: imageUrl,
      statut: 'ACTIF',
      date_creation: new Date().toISOString()
    };

    mockFishSpecies.push(newSpecies);
    toast.success('Espèce de poisson ajoutée avec succès');
    return newSpecies;
  },

  // Mettre à jour une espèce
  async updateFishSpecies(id: number, data: IUpdateFishSpecies): Promise<IFishSpecies> {
    await delay(1000);
    
    const index = mockFishSpecies.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Espèce non trouvée');
    }

    // Simuler l'upload d'image si une nouvelle image est fournie
    if (data.image) {
      const imageUrl = URL.createObjectURL(data.image);
      mockFishSpecies[index].image_url = imageUrl;
    }

    // Mettre à jour les autres champs
    Object.assign(mockFishSpecies[index], {
      ...data,
      updated_at: new Date().toISOString()
    });

    toast.success('Espèce de poisson modifiée avec succès');
    return mockFishSpecies[index];
  },

  // Supprimer une espèce
  async deleteFishSpecies(id: number): Promise<void> {
    await delay(800);
    
    const index = mockFishSpecies.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Espèce non trouvée');
    }

    mockFishSpecies.splice(index, 1);
    toast.success('Espèce de poisson supprimée avec succès');
  },

  // Changer le statut d'une espèce
  async toggleFishSpeciesStatus(id: number): Promise<IFishSpecies> {
    await delay(500);
    
    const species = mockFishSpecies.find(s => s.id === id);
    if (!species) {
      throw new Error('Espèce non trouvée');
    }

    species.statut = species.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF';
    species.updated_at = new Date().toISOString();
    
    toast.success(`Statut de l'espèce ${species.nom} modifié avec succès`);
    return species;
  }
};

// Service pour les aliments pour poissons
export const fishFoodService = {
  // Récupérer tous les aliments
  async getAllFishFood(): Promise<IFishFood[]> {
    await delay(800);
    return [...mockFishFood];
  },

  // Récupérer un aliment par ID
  async getFishFoodById(id: number): Promise<IFishFood | null> {
    await delay(500);
    const food = mockFishFood.find(f => f.id === id);
    return food || null;
  },

  // Créer un nouvel aliment
  async createFishFood(data: ICreateFishFood): Promise<IFishFood> {
    await delay(1000);
    
    // Simuler l'upload d'image
    let imageUrl = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop";
    if (data.image) {
      imageUrl = URL.createObjectURL(data.image);
    }

    const newFood: IFishFood = {
      id: Math.max(...mockFishFood.map(f => f.id)) + 1,
      nom: data.nom,
      marque: data.marque,
      type: data.type,
      taille_granule: data.taille_granule,
      composition: data.composition,
      proteines: data.proteines,
      lipides: data.lipides,
      glucides: data.glucides,
      fibres: data.fibres,
      cendres: data.cendres,
      humidite: data.humidite,
      energie: data.energie,
      especes_compatibles: data.especes_compatibles,
      stade_vie: data.stade_vie,
      frequence_alimentation: data.frequence_alimentation,
      quantite_recommandee: data.quantite_recommandee,
      prix_unitaire: data.prix_unitaire,
      stock_disponible: data.stock_disponible,
      description: data.description,
      image_url: imageUrl,
      statut: 'ACTIF',
      date_creation: new Date().toISOString()
    };

    mockFishFood.push(newFood);
    toast.success('Aliment pour poissons ajouté avec succès');
    return newFood;
  },

  // Mettre à jour un aliment
  async updateFishFood(id: number, data: IUpdateFishFood): Promise<IFishFood> {
    await delay(1000);
    
    const index = mockFishFood.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('Aliment non trouvé');
    }

    // Simuler l'upload d'image si une nouvelle image est fournie
    if (data.image) {
      const imageUrl = URL.createObjectURL(data.image);
      mockFishFood[index].image_url = imageUrl;
    }

    // Mettre à jour les autres champs
    Object.assign(mockFishFood[index], {
      ...data,
      updated_at: new Date().toISOString()
    });

    toast.success('Aliment pour poissons modifié avec succès');
    return mockFishFood[index];
  },

  // Supprimer un aliment
  async deleteFishFood(id: number): Promise<void> {
    await delay(800);
    
    const index = mockFishFood.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('Aliment non trouvé');
    }

    mockFishFood.splice(index, 1);
    toast.success('Aliment pour poissons supprimé avec succès');
  },

  // Changer le statut d'un aliment
  async updateFishFoodStatus(id: number, statut: 'ACTIF' | 'INACTIF' | 'RUPTURE'): Promise<IFishFood> {
    await delay(500);
    
    const food = mockFishFood.find(f => f.id === id);
    if (!food) {
      throw new Error('Aliment non trouvé');
    }

    food.statut = statut;
    food.updated_at = new Date().toISOString();
    
    toast.success(`Statut de l'aliment ${food.nom} modifié avec succès`);
    return food;
  },

  // Mettre à jour le stock
  async updateFishFoodStock(id: number, newStock: number): Promise<IFishFood> {
    await delay(500);
    
    const food = mockFishFood.find(f => f.id === id);
    if (!food) {
      throw new Error('Aliment non trouvé');
    }

    food.stock_disponible = newStock;
    
    // Mettre à jour le statut automatiquement
    if (newStock === 0) {
      food.statut = 'RUPTURE';
    } else if (food.statut === 'RUPTURE') {
      food.statut = 'ACTIF';
    }
    
    food.updated_at = new Date().toISOString();
    
    toast.success(`Stock de ${food.nom} mis à jour avec succès`);
    return food;
  },

  // Récupérer les aliments par type
  async getFishFoodByType(type: string): Promise<IFishFood[]> {
    await delay(500);
    return mockFishFood.filter(f => f.type === type);
  },

  // Récupérer les aliments par stade de vie
  async getFishFoodByLifeStage(stade: string): Promise<IFishFood[]> {
    await delay(500);
    return mockFishFood.filter(f => f.stade_vie === stade);
  },

  // Récupérer les aliments compatibles avec une espèce
  async getFishFoodBySpecies(speciesId: number): Promise<IFishFood[]> {
    await delay(500);
    return mockFishFood.filter(f => f.especes_compatibles.includes(speciesId));
  }
}; 