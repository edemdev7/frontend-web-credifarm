import { FC } from 'react';
import { IFishSpecies } from '../types/fish';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Image,
  Chip,
  ChipProps,
} from "@heroui/react";
import { Thermometer, Droplets, Ruler, Weight, Calendar, Fish } from 'lucide-react';

interface FishSpeciesDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  species: IFishSpecies | null;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
  ACTIF: "success",
  INACTIF: "danger",
};

const FishSpeciesDetails: FC<FishSpeciesDetailsProps> = ({ isOpen, onClose, species }) => {
  if (!species) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        <ModalHeader>Détails de l'espèce</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src={species.image_url || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop"}
                alt={species.nom}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-bold">{species.nom}</h3>
                <p className="text-gray-600 italic">{species.nom_scientifique}</p>
                <p className="text-gray-700">{species.famille}</p>
                <div className="flex gap-2 mt-2">
                  <Chip color={statusColorMap[species.statut]} size="sm">
                    {species.statut}
                  </Chip>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Caractéristiques physiques</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-500" />
                    <span>Taille moyenne: <strong>{species.taille_moyenne} cm</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Weight className="w-4 h-4 text-green-500" />
                    <span>Poids moyen: <strong>{species.poids_moyen} g</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>Durée de vie: <strong>{species.duree_vie} années</strong></span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Conditions optimales</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <span>Température: <strong>{species.temperature_optimale.min}°C - {species.temperature_optimale.max}°C</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>pH optimal: <strong>{species.ph_optimal.min} - {species.ph_optimal.max}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700 leading-relaxed">{species.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Créé le: {new Date(species.date_creation).toLocaleDateString('fr-FR')}</span>
              {species.updated_at && (
                <span>Modifié le: {new Date(species.updated_at).toLocaleDateString('fr-FR')}</span>
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FishSpeciesDetails; 