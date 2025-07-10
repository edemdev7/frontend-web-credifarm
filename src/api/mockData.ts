import { IMember } from "../components/types/member";
import { IBassin, ICalendrierRecolte, ICalendrierIntrants } from "../components/types/waterBasin";
import { IFishSpecies, IFishFood } from "../components/types/fish";

// Données mockées pour simuler les réponses API
export const mockData = {
  admin: {
    profile: {
      id: 1,
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      role: "ADM",
      phoneNumber: "1234567890",
      regionId: 1,
      departmentId: 1,
      cooperativeId: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    admins: [
      {
        id: 1,
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        role: "ADM"
      }
    ]
  },
  members: [
    {
      id: 1,
      name: "John Doe",
      phone: "1234567890",
      region: {
        id: 1,
        nom: "Region 1"
      },
      department: {
        id: 1,
        nom: "Department 1"
      },
      village: "Village 1",
      dateOfBirth: new Date("1990-01-01"),
      gender: true,
      phoneType: 1,
      maritalStatus: 1,
      hasBankAccount: true,
      dependents: 2,
      educationLevel: 1,
      mainActivity: 1,
      otherMainActivity: "",
      secondaryActivities: [1, 2],
      otherSecondaryActivity: "",
      landExploitationType: 1,
      farmingExperience: 5,
      agriculturalTrainingType: 1,
      farmMonitoring: 1,
      joinedCooperativeAt: new Date("2020-01-01"),
      leftCooperativeAt: null,
      TotalAmountActiveLoans: 1000,
      TotalAmountPaidLoans: 500
    }
  ],
  regions: [
    { id: 1, nom: "Region 1" },
    { id: 2, nom: "Region 2" }
  ],
  departments: [
    { id: 1, nom: "Department 1", region_id: 1 },
    { id: 2, nom: "Department 2", region_id: 1 },
    { id: 3, nom: "Department 3", region_id: 2 },
    { id: 4, nom: "Department 4", region_id: 2 }
  ],
  cooperatives: [
    {
      id: 1,
      name: "Cooperative 1",
      email: "coop1@example.com",
      phone: "1234567890"
    }
  ],
  crops: [
    {
      id: "1",
      name: "Crop 1",
      description: "Description 1",
      image: "https://via.placeholder.com/150"
    }
  ],
  entries: [
    {
      id: "1",
      name: "Entry 1",
      description: "Description 1",
      price: 1000,
      image: "https://via.placeholder.com/150",
      creationDate: new Date()
    }
  ],
  waterBasins: [
    {
      id: 1,
      name: "Bassin de l'Est",
      description: "Grand bassin d'irrigation principal",
      surfaceArea: 150,
      capacity: 500000,
      depth: 5,
      region: {
        id: 1,
        nom: "Region 1"
      },
      department: {
        id: 1,
        nom: "Department 1"
      },
      location: "Zone Est",
      constructionDate: new Date("2020-01-01"),
      lastMaintenanceDate: new Date("2023-12-01"),
      status: "ACTIVE",
      waterQuality: "GOOD",
      usage: ["Irrigation", "Pêche"],
      coordinates: {
        latitude: 12.3456,
        longitude: -1.2345
      },
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150"
      ],
      ferme: "Ferme de l'Est"
    },
    {
      id: 2,
      name: "Bassin du Nord",
      description: "Bassin de stockage secondaire",
      surfaceArea: 80,
      capacity: 250000,
      depth: 3,
      region: {
        id: 1,
        nom: "Region 1"
      },
      department: {
        id: 2,
        nom: "Department 2"
      },
      location: "Zone Nord",
      constructionDate: new Date("2021-03-15"),
      lastMaintenanceDate: new Date("2024-01-15"),
      status: "MAINTENANCE",
      waterQuality: "MODERATE",
      usage: ["Irrigation"],
      coordinates: {
        latitude: 12.4567,
        longitude: -1.3456
      },
      images: [
        "https://via.placeholder.com/150"
      ],
      ferme: "Ferme du Nord"
    }
  ]
};

// Mock data pour les espèces de poissons
export const mockFishSpecies: IFishSpecies[] = [
  {
    id: 1,
    nom: "Tilapia du Nil",
    nom_scientifique: "Oreochromis niloticus",
    famille: "Cichlidae",
    taille_moyenne: 30,
    poids_moyen: 500,
    duree_vie: 8,
    temperature_optimale: { min: 22, max: 30 },
    ph_optimal: { min: 6.5, max: 8.5 },
    description: "Espèce très populaire en pisciculture, résistante et à croissance rapide. Excellente pour les débutants.",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    statut: "ACTIF",
    date_creation: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    nom: "Carpes communes",
    nom_scientifique: "Cyprinus carpio",
    famille: "Cyprinidae",
    taille_moyenne: 40,
    poids_moyen: 800,
    duree_vie: 20,
    temperature_optimale: { min: 18, max: 28 },
    ph_optimal: { min: 6.0, max: 9.0 },
    description: "Espèce rustique et adaptable, très appréciée pour sa résistance aux conditions difficiles.",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    statut: "ACTIF",
    date_creation: "2024-01-20T14:30:00Z"
  },
  {
    id: 3,
    nom: "Silure africain",
    nom_scientifique: "Clarias gariepinus",
    famille: "Clariidae",
    taille_moyenne: 50,
    poids_moyen: 1200,
    duree_vie: 15,
    temperature_optimale: { min: 20, max: 32 },
    ph_optimal: { min: 6.0, max: 8.0 },
    description: "Poisson-chat africain très résistant, capable de respirer l'air atmosphérique.",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    statut: "ACTIF",
    date_creation: "2024-02-05T09:15:00Z"
  },
  {
    id: 4,
    nom: "Poisson-chat",
    nom_scientifique: "Ictalurus punctatus",
    famille: "Ictaluridae",
    taille_moyenne: 35,
    poids_moyen: 600,
    duree_vie: 12,
    temperature_optimale: { min: 16, max: 26 },
    ph_optimal: { min: 6.5, max: 8.5 },
    description: "Espèce américaine très populaire, excellente qualité de chair.",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    statut: "ACTIF",
    date_creation: "2024-02-10T11:45:00Z"
  },
  {
    id: 5,
    nom: "Truite arc-en-ciel",
    nom_scientifique: "Oncorhynchus mykiss",
    famille: "Salmonidae",
    taille_moyenne: 25,
    poids_moyen: 300,
    duree_vie: 7,
    temperature_optimale: { min: 10, max: 20 },
    ph_optimal: { min: 6.5, max: 7.5 },
    description: "Espèce d'eau froide, très appréciée pour sa chair délicate.",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    statut: "INACTIF",
    date_creation: "2024-02-15T16:20:00Z"
  }
];

// Mock data pour les aliments pour poissons
export const mockFishFood: IFishFood[] = [
  {
    id: 1,
    nom: "Premium Tilapia Growth",
    marque: "AquaFeed Pro",
    type: "GRANULES",
    taille_granule: "2-4mm",
    composition: "Farine de poisson, soja, maïs, vitamines et minéraux",
    proteines: 32,
    lipides: 8,
    glucides: 45,
    fibres: 3,
    cendres: 8,
    humidite: 4,
    energie: 320,
    especes_compatibles: [1, 2, 3],
    stade_vie: "JUVENILES",
    frequence_alimentation: "2-3 fois par jour",
    quantite_recommandee: "3-5% du poids corporel",
    prix_unitaire: 2500,
    stock_disponible: 500,
    description: "Aliment premium pour la croissance optimale des tilapias et carpes",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    statut: "ACTIF",
    date_creation: "2024-01-10T08:00:00Z"
  },
  {
    id: 2,
    nom: "Alevins Starter",
    marque: "FishCare",
    type: "PAILLETTES",
    composition: "Plancton, farine de poisson, levure, vitamines",
    proteines: 45,
    lipides: 12,
    glucides: 25,
    fibres: 2,
    cendres: 10,
    humidite: 6,
    energie: 380,
    especes_compatibles: [1, 2, 3, 4],
    stade_vie: "ALEVINS",
    frequence_alimentation: "4-6 fois par jour",
    quantite_recommandee: "10-15% du poids corporel",
    prix_unitaire: 3500,
    stock_disponible: 200,
    description: "Aliment spécialement formulé pour les alevins de toutes espèces",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    statut: "ACTIF",
    date_creation: "2024-01-15T10:30:00Z"
  },
  {
    id: 3,
    nom: "Reproducteurs Plus",
    marque: "BreedMaster",
    type: "GRANULES",
    taille_granule: "4-6mm",
    composition: "Farine de poisson, krill, vitamines E et C, acides gras oméga-3",
    proteines: 38,
    lipides: 15,
    glucides: 35,
    fibres: 2,
    cendres: 6,
    humidite: 4,
    energie: 350,
    especes_compatibles: [1, 2, 3, 4],
    stade_vie: "REPRODUCTEURS",
    frequence_alimentation: "1-2 fois par jour",
    quantite_recommandee: "2-3% du poids corporel",
    prix_unitaire: 4200,
    stock_disponible: 150,
    description: "Aliment enrichi pour optimiser la reproduction et la qualité des œufs",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    statut: "ACTIF",
    date_creation: "2024-01-20T14:15:00Z"
  },
  {
    id: 4,
    nom: "Flocons Universels",
    marque: "AquaMix",
    type: "FLOCONS",
    composition: "Farine de poisson, algues, céréales, vitamines",
    proteines: 28,
    lipides: 6,
    glucides: 50,
    fibres: 4,
    cendres: 8,
    humidite: 4,
    energie: 300,
    especes_compatibles: [1, 2, 3, 4, 5],
    stade_vie: "TOUS",
    frequence_alimentation: "2-3 fois par jour",
    quantite_recommandee: "3-4% du poids corporel",
    prix_unitaire: 1800,
    stock_disponible: 0,
    description: "Aliment polyvalent pour toutes les espèces et tous les stades",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    statut: "RUPTURE",
    date_creation: "2024-02-01T09:45:00Z"
  },
  {
    id: 5,
    nom: "Pâte de Nourriture",
    marque: "HandFeed",
    type: "PATE",
    composition: "Farine de poisson, farine de viande, céréales, huile de poisson",
    proteines: 35,
    lipides: 10,
    glucides: 40,
    fibres: 3,
    cendres: 8,
    humidite: 4,
    energie: 330,
    especes_compatibles: [3, 4],
    stade_vie: "ADULTES",
    frequence_alimentation: "1 fois par jour",
    quantite_recommandee: "2-3% du poids corporel",
    prix_unitaire: 2800,
    stock_disponible: 100,
    description: "Pâte nutritive pour les poissons-chats et silures",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    statut: "ACTIF",
    date_creation: "2024-02-05T11:20:00Z"
  }
]; 