import { FC, useEffect, useState } from 'react';
import { IBassin } from '../types/waterBasin';
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
  Spinner,
} from "@heroui/react";
import { fetchRegions } from '../../api/regions';
import { fetchDepartments } from '../../api/department';

interface WaterBasinFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  editingBasin: IBassin | null;
}

interface Region {
  id: number;
  nom: string;
}

interface Department {
  id: number;
  nom: string;
}

const WaterBasinForm: FC<WaterBasinFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingBasin,
}) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Charger les régions depuis l'API
  useEffect(() => {
    const loadRegions = async () => {
      setLoadingRegions(true);
      try {
        const regionsData = await fetchRegions();
        setRegions(regionsData);
      } catch (error) {
        console.error('Erreur lors du chargement des régions:', error);
      } finally {
        setLoadingRegions(false);
      }
    };

    if (isOpen) {
      loadRegions();
    }
  }, [isOpen]);

  // Charger les départements depuis l'API
  useEffect(() => {
    const loadDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const departmentsData = await fetchDepartments();
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Erreur lors du chargement des départements:', error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    if (isOpen) {
      loadDepartments();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const values = {
      nom: formData.get('nom'),
      description: formData.get('description'),
      superficie: Number(formData.get('superficie')),
      profondeur: Number(formData.get('profondeur')),
      region_id: Number(formData.get('regionId')),
      statut: formData.get('statut'),
    };
    onSubmit(values);
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {editingBasin ? 'Modifier le bassin d\'eau' : 'Ajouter un bassin d\'eau'}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Nom"
                name="nom"
                defaultValue={editingBasin?.nom}
                required
              />
              <Textarea
                label="Description"
                name="description"
                defaultValue={editingBasin?.description}
              />
              <Input
                type="number"
                label="Superficie (m²)"
                name="superficie"
                defaultValue={editingBasin?.superficie}
                required
              />
              <Input
                type="number"
                label="Profondeur (m)"
                name="profondeur"
                defaultValue={editingBasin?.profondeur}
              />
              <Select
                label="Région"
                name="regionId"
                defaultSelectedKeys={editingBasin?.region ? [editingBasin.region.id.toString()] : []}
                required
                isLoading={loadingRegions}
                startContent={loadingRegions ? <Spinner size="sm" /> : undefined}
              >
                {regions.map(region => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.nom}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Statut"
                name="statut"
                defaultSelectedKeys={editingBasin ? [editingBasin.statut] : []}
                required
              >
                <SelectItem key="ACTIF" value="ACTIF">Actif</SelectItem>
                <SelectItem key="EN_MAINTENANCE" value="EN_MAINTENANCE">En maintenance</SelectItem>
                <SelectItem key="INACTIF" value="INACTIF">Inactif</SelectItem>
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose} isDisabled={loading}>
              Annuler
            </Button>
            <Button color="primary" type="submit" isLoading={loading}>
              {editingBasin ? 'Modifier' : 'Ajouter'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default WaterBasinForm; 