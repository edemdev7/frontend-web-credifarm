import { FC } from 'react';
import { ICreatePecheControle } from '../types/waterBasin';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";

interface PecheControleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ICreatePecheControle) => void;
  bassinId: number;
  bassinName: string;
}

const PecheControleForm: FC<PecheControleFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bassinId,
  bassinName,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const values: ICreatePecheControle = {
      nombre_poissons_peches: Number(formData.get('nombre_poissons_peches')),
      poids_total_peche: Number(formData.get('poids_total_peche')),
      poids_moyen_poisson: Number(formData.get('poids_moyen_poisson')),
      taille_moyenne: Number(formData.get('taille_moyenne')),
      etat_sante: formData.get('etat_sante') as string,
      methode_peche: formData.get('methode_peche') as string,
      observations: formData.get('observations') as string,
    };
    onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            Ajouter une pêche de contrôle - {bassinName}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Nombre de poissons pêchés"
                name="nombre_poissons_peches"
                placeholder="Ex: 50"
                required
              />
              <Input
                type="number"
                label="Poids total de la pêche (kg)"
                name="poids_total_peche"
                placeholder="Ex: 25.0"
                step="0.1"
                required
              />
              <Input
                type="number"
                label="Poids moyen par poisson (kg)"
                name="poids_moyen_poisson"
                placeholder="Ex: 0.5"
                step="0.01"
                required
              />
              <Input
                type="number"
                label="Taille moyenne (cm)"
                name="taille_moyenne"
                placeholder="Ex: 15.5"
                step="0.1"
              />
              <Select
                label="État de santé"
                name="etat_sante"
                required
              >
                <SelectItem key="Bon" value="Bon">Bon</SelectItem>
                <SelectItem key="Moyen" value="Moyen">Moyen</SelectItem>
                <SelectItem key="Mauvais" value="Mauvais">Mauvais</SelectItem>
              </Select>
              <Select
                label="Méthode de pêche"
                name="methode_peche"
              >
                <SelectItem key="Filet" value="Filet">Filet</SelectItem>
                <SelectItem key="Épuisette" value="Épuisette">Épuisette</SelectItem>
                <SelectItem key="Ligne" value="Ligne">Ligne</SelectItem>
                <SelectItem key="Autre" value="Autre">Autre</SelectItem>
              </Select>
            </div>
            <div className="mt-4">
              <Textarea
                label="Observations"
                name="observations"
                placeholder="Observations sur la pêche de contrôle..."
                rows={3}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Annuler
            </Button>
            <Button color="primary" type="submit">
              Ajouter la pêche de contrôle
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default PecheControleForm; 