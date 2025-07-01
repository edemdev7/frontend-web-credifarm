import { FC } from 'react';
import { ICreatePerformance } from '../types/waterBasin';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@heroui/react";

interface PerformanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ICreatePerformance) => void;
  bassinId: number;
  bassinName: string;
}

const PerformanceForm: FC<PerformanceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bassinId,
  bassinName,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const values: ICreatePerformance = {
      nombre_poissons: Number(formData.get('nombre_poissons')),
      poids_total: Number(formData.get('poids_total')),
      poids_moyen: Number(formData.get('poids_moyen')),
      taux_mortalite: Number(formData.get('taux_mortalite')),
      taux_croissance: Number(formData.get('taux_croissance')),
      taux_conversion_alimentaire: Number(formData.get('taux_conversion_alimentaire')),
      observations: formData.get('observations') as string,
    };
    onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            Ajouter une performance - {bassinName}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Nombre de poissons"
                name="nombre_poissons"
                placeholder="Ex: 800"
                required
              />
              <Input
                type="number"
                label="Poids total (kg)"
                name="poids_total"
                placeholder="Ex: 400.0"
                step="0.1"
                required
              />
              <Input
                type="number"
                label="Poids moyen par poisson (kg)"
                name="poids_moyen"
                placeholder="Ex: 0.5"
                step="0.01"
                required
              />
              <Input
                type="number"
                label="Taux de mortalité (%)"
                name="taux_mortalite"
                placeholder="Ex: 5.0"
                step="0.1"
                required
              />
              <Input
                type="number"
                label="Taux de croissance (%)"
                name="taux_croissance"
                placeholder="Ex: 15.0"
                step="0.1"
                required
              />
              <Input
                type="number"
                label="Taux de conversion alimentaire"
                name="taux_conversion_alimentaire"
                placeholder="Ex: 1.8"
                step="0.1"
              />
            </div>
            <div className="mt-4">
              <Textarea
                label="Observations"
                name="observations"
                placeholder="Observations sur la performance..."
                rows={3}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Annuler
            </Button>
            <Button color="primary" type="submit">
              Ajouter la performance
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default PerformanceForm; 