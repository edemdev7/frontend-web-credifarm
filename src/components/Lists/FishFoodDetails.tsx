import { FC } from 'react';
import { IFishFood } from '../types/fish';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Image,
  Chip,
  ChipProps,
  Progress,
} from "@heroui/react";
import { Package, DollarSign, Scale, Zap, Clock, Target } from 'lucide-react';

interface FishFoodDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  food: IFishFood | null;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
  ACTIF: "success",
  INACTIF: "danger",
  RUPTURE: "warning",
};

const typeColorMap: Record<string, ChipProps["color"]> = {
  GRANULES: "primary",
  FLOCONS: "secondary",
  PAILLETTES: "success",
  PATE: "warning",
  VIANDE: "danger",
};

const FishFoodDetails: FC<FishFoodDetailsProps> = ({ isOpen, onClose, food }) => {
  if (!food) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalHeader>Détails de l'aliment</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src={food.image_url || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop"}
                alt={food.nom}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-bold">{food.nom}</h3>
                <p className="text-gray-600">{food.marque}</p>
                <div className="flex gap-2 mt-2">
                  <Chip color={typeColorMap[food.type]} size="sm">
                    {food.type}
                  </Chip>
                  <Chip color={statusColorMap[food.statut]} size="sm">
                    {food.statut}
                  </Chip>
                  <Chip color="default" size="sm">
                    {food.stade_vie}
                  </Chip>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3">Informations nutritionnelles</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Protéines</span>
                      <span className="font-medium">{food.proteines}%</span>
                    </div>
                    <Progress 
                      value={food.proteines} 
                      className="w-full" 
                      color={food.proteines > 35 ? "success" : food.proteines > 25 ? "warning" : "danger"}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Lipides</span>
                      <span className="font-medium">{food.lipides}%</span>
                    </div>
                    <Progress 
                      value={food.lipides} 
                      className="w-full" 
                      color={food.lipides > 15 ? "success" : food.lipides > 8 ? "warning" : "danger"}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Glucides</span>
                      <span className="font-medium">{food.glucides}%</span>
                    </div>
                    <Progress 
                      value={food.glucides} 
                      className="w-full" 
                      color={food.glucides > 40 ? "success" : food.glucides > 25 ? "warning" : "danger"}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fibres</span>
                      <span className="font-medium">{food.fibres}%</span>
                    </div>
                    <Progress 
                      value={food.fibres} 
                      className="w-full" 
                      color={food.fibres > 5 ? "success" : food.fibres > 2 ? "warning" : "danger"}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Énergie: <strong>{food.energie} kcal/100g</strong></span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Informations commerciales</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>Prix: <strong>{food.prix_unitaire.toLocaleString()} FCFA/kg</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-500" />
                    <span>Stock: <strong>{food.stock_disponible} kg</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-500" />
                    <span>Type: <strong>{food.type}</strong></span>
                  </div>
                  {food.taille_granule && (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      <span>Taille: <strong>{food.taille_granule}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Recommandations d'utilisation</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Fréquence: <strong>{food.frequence_alimentation}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>Quantité: <strong>{food.quantite_recommandee}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-500" />
                    <span>Stade: <strong>{food.stade_vie}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Composition</h4>
              <p className="text-gray-700 leading-relaxed">{food.composition}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700 leading-relaxed">{food.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Créé le: {new Date(food.date_creation).toLocaleDateString('fr-FR')}</span>
              {food.updated_at && (
                <span>Modifié le: {new Date(food.updated_at).toLocaleDateString('fr-FR')}</span>
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FishFoodDetails; 