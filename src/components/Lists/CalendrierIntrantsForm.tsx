import { FC, useState } from 'react';
import { ICreateCalendrierIntrants } from '../types/waterBasin';
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
import toast from 'react-hot-toast';

interface CalendrierIntrantsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ICreateCalendrierIntrants) => Promise<void>;
  bassinId: number;
  bassinName: string;
}

const CalendrierIntrantsForm: FC<CalendrierIntrantsFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bassinId,
  bassinName,
}) => {
  const [formData, setFormData] = useState<ICreateCalendrierIntrants>({
    date_avance_prevue: '',
    montant_avance: 0,
    type_intrant: '',
    quantite_intrant: 0,
    observations: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.date_avance_prevue || !formData.type_intrant || formData.montant_avance <= 0) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        date_avance_prevue: '',
        montant_avance: 0,
        type_intrant: '',
        quantite_intrant: 0,
        observations: '',
      });
      toast.success('Calendrier d\'intrants ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du calendrier d\'intrants');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ICreateCalendrierIntrants, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-semibold">
            Ajouter un calendrier d'avance sur intrants - {bassinName}
          </h3>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date d'avance prévue"
              type="date"
              value={formData.date_avance_prevue}
              onChange={(e) => handleChange('date_avance_prevue', e.target.value)}
              required
            />
            <Input
              label="Montant de l'avance (FCFA)"
              type="number"
              value={formData.montant_avance}
              onChange={(e) => handleChange('montant_avance', parseFloat(e.target.value) || 0)}
              required
              min="0"
              step="100"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Type d'intrant"
              value={formData.type_intrant}
              onChange={(e) => handleChange('type_intrant', e.target.value)}
              required
            >
              <SelectItem key="alimentation" value="Alimentation">Alimentation</SelectItem>
              <SelectItem key="alevins" value="Alevins">Alevins</SelectItem>
              <SelectItem key="medicaments" value="Médicaments">Médicaments</SelectItem>
              <SelectItem key="equipement" value="Équipement">Équipement</SelectItem>
              <SelectItem key="autre" value="Autre">Autre</SelectItem>
            </Select>
            
            <Input
              label="Quantité d'intrant"
              type="number"
              value={formData.quantite_intrant}
              onChange={(e) => handleChange('quantite_intrant', parseFloat(e.target.value) || 0)}
              required
              min="0"
              step="0.1"
            />
          </div>

          <Textarea
            label="Observations"
            value={formData.observations}
            onChange={(e) => handleChange('observations', e.target.value)}
            placeholder="Observations sur l'avance d'intrants..."
            rows={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Annuler
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Ajouter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CalendrierIntrantsForm; 