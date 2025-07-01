import { FC, useState } from 'react';
import { ICreateCalendrierRecolte } from '../types/waterBasin';
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

interface CalendrierRecolteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ICreateCalendrierRecolte) => Promise<void>;
  bassinId: number;
  bassinName: string;
}

const CalendrierRecolteForm: FC<CalendrierRecolteFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bassinId,
  bassinName,
}) => {
  const [formData, setFormData] = useState<ICreateCalendrierRecolte>({
    date_recolte_prevue: '',
    quantite_prevue: 0,
    type_poisson: '',
    observations: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.date_recolte_prevue || !formData.type_poisson || formData.quantite_prevue <= 0) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        date_recolte_prevue: '',
        quantite_prevue: 0,
        type_poisson: '',
        observations: '',
      });
      toast.success('Calendrier de récolte ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du calendrier de récolte');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ICreateCalendrierRecolte, value: any) => {
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
            Ajouter un calendrier de récolte - {bassinName}
          </h3>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date de récolte prévue"
              type="date"
              value={formData.date_recolte_prevue}
              onChange={(e) => handleChange('date_recolte_prevue', e.target.value)}
              required
            />
            <Input
              label="Quantité prévue (kg)"
              type="number"
              value={formData.quantite_prevue}
              onChange={(e) => handleChange('quantite_prevue', parseFloat(e.target.value) || 0)}
              required
              min="0"
              step="0.1"
            />
          </div>
          
          <Select
            label="Type de poisson"
            value={formData.type_poisson}
            onChange={(e) => handleChange('type_poisson', e.target.value)}
            required
          >
            <SelectItem key="tilapia" value="Tilapia">Tilapia</SelectItem>
            <SelectItem key="carpe" value="Carpe">Carpe</SelectItem>
            <SelectItem key="silure" value="Silure">Silure</SelectItem>
            <SelectItem key="poisson-chat" value="Poisson-chat">Poisson-chat</SelectItem>
            <SelectItem key="autre" value="Autre">Autre</SelectItem>
          </Select>

          <Textarea
            label="Observations"
            value={formData.observations}
            onChange={(e) => handleChange('observations', e.target.value)}
            placeholder="Observations sur la récolte prévue..."
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

export default CalendrierRecolteForm; 