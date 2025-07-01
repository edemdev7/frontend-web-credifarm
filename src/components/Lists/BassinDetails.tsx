import { FC, useEffect, useState, useCallback, useRef } from 'react';
import { IBassin, IPerformance, IPecheControle, ICreatePerformance, ICreatePecheControle, ICalendrierRecolte, ICalendrierIntrants, ICreateCalendrierRecolte, ICreateCalendrierIntrants } from '../types/waterBasin';
import { useWaterBasinStore } from '../../store/waterBasinStore';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Chip,
  ChipProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
  Progress,
} from "@heroui/react";
import { Calendar, MapPin, User, Fish, Scale, TrendingUp, Activity, Plus } from 'lucide-react';
import PerformanceForm from './PerformanceForm';
import PecheControleForm from './PecheControleForm';
import CalendrierRecolteForm from './CalendrierRecolteForm';
import CalendrierIntrantsForm from './CalendrierIntrantsForm';
import toast from 'react-hot-toast';

interface BassinDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  bassin: IBassin | null;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
  ACTIF: "success",
  EN_MAINTENANCE: "warning",
  INACTIF: "danger",
};

const BassinDetails: FC<BassinDetailsProps> = ({ isOpen, onClose, bassin }) => {
  const { 
    createPerformance,
    createPecheControle
  } = useWaterBasinStore();

  const [activeTab, setActiveTab] = useState("general");
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [isPecheControleModalOpen, setIsPecheControleModalOpen] = useState(false);
  const [isCalendrierRecolteModalOpen, setIsCalendrierRecolteModalOpen] = useState(false);
  const [isCalendrierIntrantsModalOpen, setIsCalendrierIntrantsModalOpen] = useState(false);

  if (!bassin) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleAddPerformance = async (data: ICreatePerformance) => {
    if (bassin) {
      try {
        await createPerformance(bassin.id, data);
        setIsPerformanceModalOpen(false);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la performance:', error);
      }
    }
  };

  const handleAddPecheControle = async (data: ICreatePecheControle) => {
    if (bassin) {
      try {
        await createPecheControle(bassin.id, data);
        setIsPecheControleModalOpen(false);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la pêche de contrôle:', error);
      }
    }
  };

  const handleAddCalendrierRecolte = async (data: ICreateCalendrierRecolte) => {
    if (bassin) {
      try {
        // Simulation d'ajout avec mock data
        const newCalendrier: ICalendrierRecolte = {
          id: Date.now(),
          ...data,
          statut: 'PLANIFIE',
          date_creation: new Date().toISOString(),
          bassinId: bassin.id,
        };
        
        // Ajouter à la liste locale (simulation)
        if (!bassin.calendrier_recolte) {
          bassin.calendrier_recolte = [];
        }
        bassin.calendrier_recolte.push(newCalendrier);
        
        setIsCalendrierRecolteModalOpen(false);
        toast.success('Calendrier de récolte ajouté avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'ajout du calendrier de récolte:', error);
        toast.error('Erreur lors de l\'ajout du calendrier de récolte');
      }
    }
  };

  const handleAddCalendrierIntrants = async (data: ICreateCalendrierIntrants) => {
    if (bassin) {
      try {
        // Simulation d'ajout avec mock data
        const newCalendrier: ICalendrierIntrants = {
          id: Date.now(),
          ...data,
          statut: 'PLANIFIE',
          date_creation: new Date().toISOString(),
          bassinId: bassin.id,
        };
        
        // Ajouter à la liste locale (simulation)
        if (!bassin.calendrier_intrants) {
          bassin.calendrier_intrants = [];
        }
        bassin.calendrier_intrants.push(newCalendrier);
        
        setIsCalendrierIntrantsModalOpen(false);
        toast.success('Calendrier d\'intrants ajouté avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'ajout du calendrier d\'intrants:', error);
        toast.error('Erreur lors de l\'ajout du calendrier d\'intrants');
      }
    }
  };

  // Calculer les statistiques des performances
  const performanceStats = bassin.performances && bassin.performances.length > 0 ? {
    nombre_mesures: bassin.performances.length,
    poids_moyen_total: bassin.performances.reduce((sum, p) => sum + parseFloat(String(p.poids_moyen || '0')), 0) / bassin.performances.length,
    taux_mortalite_moyen: bassin.performances.reduce((sum, p) => sum + parseFloat(String(p.taux_mortalite || '0')), 0) / bassin.performances.length,
    taux_croissance_moyen: bassin.performances.reduce((sum, p) => sum + parseFloat(String(p.taux_croissance || '0')), 0) / bassin.performances.length,
  } : null;

  // Calculer les statistiques des pêches de contrôle
  const pecheControleStats = bassin.peches_controle && bassin.peches_controle.length > 0 ? {
    nombre_peches: bassin.peches_controle.length,
    poids_moyen_total: bassin.peches_controle.reduce((sum, p) => sum + parseFloat(String(p.poids_moyen_poisson || '0')), 0) / bassin.peches_controle.length,
    taille_moyenne_totale: bassin.peches_controle.reduce((sum, p) => sum + (p.taille_moyenne || 0), 0) / bassin.peches_controle.length,
    etat_sante_repartition: bassin.peches_controle.reduce((acc, p) => {
      const etat = p.etat_sante || 'Non défini';
      acc[etat] = (acc[etat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  } : null;

  const renderGeneralInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Informations générales</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center gap-2">
              <Fish className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Nom:</span>
              <span>{bassin.nom}</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Superficie:</span>
              <span>{bassin.superficie} m²</span>
            </div>
            {bassin.profondeur && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Profondeur:</span>
                <span>{bassin.profondeur} m</span>
              </div>
            )}
            {bassin.type && (
              <div className="flex items-center gap-2">
                <Fish className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Type:</span>
                <span>{bassin.type}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Statut:</span>
              <Chip
                color={statusColorMap[bassin.statut]}
                size="sm"
                variant="flat"
              >
                {bassin.statut}
              </Chip>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Localisation</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {bassin.region && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Région:</span>
                <span>{bassin.region.nom}</span>
              </div>
            )}
            {bassin.pisciculteur_assigne && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Pisciculteur:</span>
                <span>{bassin.pisciculteur_assigne.nom} {bassin.pisciculteur_assigne.prenom}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Date de création:</span>
              <span>{formatDate(bassin.date_creation)}</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {bassin.description && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Description</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700">{bassin.description}</p>
          </CardBody>
        </Card>
      )}
    </div>
  );

  const renderPerformances = () => (
    <div className="space-y-6">
      {performanceStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-blue-600">{performanceStats.nombre_mesures}</div>
              <div className="text-sm text-gray-600">Mesures effectuées</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-green-600">{performanceStats.poids_moyen_total.toFixed(2)} kg</div>
              <div className="text-sm text-gray-600">Poids moyen</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-orange-600">{performanceStats.taux_mortalite_moyen.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Taux de mortalité</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-purple-600">{performanceStats.taux_croissance_moyen.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Taux de croissance</div>
            </CardBody>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Historique des performances</h3>
          <Button
            color="primary"
            size="sm"
            endContent={<Plus className="w-4 h-4" />}
            onPress={() => setIsPerformanceModalOpen(true)}
          >
            Ajouter une performance
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="Historique des performances">
            <TableHeader>
              <TableColumn>Date</TableColumn>
              <TableColumn>Nombre de poissons</TableColumn>
              <TableColumn>Poids total (kg)</TableColumn>
              <TableColumn>Poids moyen (kg)</TableColumn>
              <TableColumn>Taux de mortalité (%)</TableColumn>
              <TableColumn>Taux de croissance (%)</TableColumn>
            </TableHeader>
            <TableBody>
              {(bassin.performances || []).map((perf) => (
                <TableRow key={perf.id}>
                  <TableCell>{formatDate(perf.date_mesure)}</TableCell>
                  <TableCell>{perf.nombre_poissons}</TableCell>
                  <TableCell>{perf.poids_total}</TableCell>
                  <TableCell>{perf.poids_moyen}</TableCell>
                  <TableCell>{perf.taux_mortalite}</TableCell>
                  <TableCell>{perf.taux_croissance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );

  const renderPechesControle = () => (
    <div className="space-y-6">
      {pecheControleStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-blue-600">{pecheControleStats.nombre_peches}</div>
              <div className="text-sm text-gray-600">Pêches effectuées</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-green-600">{pecheControleStats.poids_moyen_total.toFixed(2)} kg</div>
              <div className="text-sm text-gray-600">Poids moyen</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-orange-600">{pecheControleStats.taille_moyenne_totale.toFixed(1)} cm</div>
              <div className="text-sm text-gray-600">Taille moyenne</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(pecheControleStats.etat_sante_repartition).length}
              </div>
              <div className="text-sm text-gray-600">États de santé</div>
            </CardBody>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Historique des pêches de contrôle</h3>
          <Button
            color="primary"
            size="sm"
            endContent={<Plus className="w-4 h-4" />}
            onPress={() => setIsPecheControleModalOpen(true)}
          >
            Ajouter une pêche de contrôle
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="Historique des pêches de contrôle">
            <TableHeader>
              <TableColumn>Date</TableColumn>
              <TableColumn>Nombre de poissons</TableColumn>
              <TableColumn>Poids total (kg)</TableColumn>
              <TableColumn>Poids moyen (kg)</TableColumn>
              <TableColumn>Taille moyenne (cm)</TableColumn>
              <TableColumn>État de santé</TableColumn>
            </TableHeader>
            <TableBody>
              {(bassin.peches_controle || []).map((peche) => (
                <TableRow key={peche.id}>
                  <TableCell>{formatDate(peche.date_peche)}</TableCell>
                  <TableCell>{peche.nombre_poissons_peches}</TableCell>
                  <TableCell>{peche.poids_total_peche}</TableCell>
                  <TableCell>{peche.poids_moyen_poisson}</TableCell>
                  <TableCell>{peche.taille_moyenne || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      color={peche.etat_sante === 'Bon' ? 'success' : peche.etat_sante === 'Moyen' ? 'warning' : 'danger'}
                      size="sm"
                      variant="flat"
                    >
                      {peche.etat_sante || 'N/A'}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );

  const renderCalendrierRecolte = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Calendrier de récolte</h3>
          <Button
            color="primary"
            size="sm"
            endContent={<Plus className="w-4 h-4" />}
            onPress={() => setIsCalendrierRecolteModalOpen(true)}
          >
            Ajouter une récolte
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="Calendrier de récolte">
            <TableHeader>
              <TableColumn>Date prévue</TableColumn>
              <TableColumn>Type de poisson</TableColumn>
              <TableColumn>Quantité prévue (kg)</TableColumn>
              <TableColumn>Statut</TableColumn>
              <TableColumn>Observations</TableColumn>
            </TableHeader>
            <TableBody>
              {(bassin.calendrier_recolte || []).map((recolte) => (
                <TableRow key={recolte.id}>
                  <TableCell>{formatDate(recolte.date_recolte_prevue)}</TableCell>
                  <TableCell>{recolte.type_poisson}</TableCell>
                  <TableCell>{recolte.quantite_prevue} kg</TableCell>
                  <TableCell>
                    <Chip
                      color={
                        recolte.statut === 'TERMINE' ? 'success' : 
                        recolte.statut === 'EN_COURS' ? 'warning' : 
                        recolte.statut === 'ANNULE' ? 'danger' : 'primary'
                      }
                      size="sm"
                      variant="flat"
                    >
                      {recolte.statut}
                    </Chip>
                  </TableCell>
                  <TableCell>{recolte.observations || 'Aucune'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );

  const renderCalendrierIntrants = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Calendrier d'avance sur intrants</h3>
          <Button
            color="primary"
            size="sm"
            endContent={<Plus className="w-4 h-4" />}
            onPress={() => setIsCalendrierIntrantsModalOpen(true)}
          >
            Ajouter une avance
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="Calendrier d'avance sur intrants">
            <TableHeader>
              <TableColumn>Date prévue</TableColumn>
              <TableColumn>Type d'intrant</TableColumn>
              <TableColumn>Montant (FCFA)</TableColumn>
              <TableColumn>Quantité</TableColumn>
              <TableColumn>Statut</TableColumn>
              <TableColumn>Observations</TableColumn>
            </TableHeader>
            <TableBody>
              {(bassin.calendrier_intrants || []).map((intrant) => (
                <TableRow key={intrant.id}>
                  <TableCell>{formatDate(intrant.date_avance_prevue)}</TableCell>
                  <TableCell>{intrant.type_intrant}</TableCell>
                  <TableCell>{intrant.montant_avance.toLocaleString()} FCFA</TableCell>
                  <TableCell>{intrant.quantite_intrant}</TableCell>
                  <TableCell>
                    <Chip
                      color={
                        intrant.statut === 'DELIVRE' ? 'success' : 
                        intrant.statut === 'APPROUVE' ? 'warning' : 
                        intrant.statut === 'ANNULE' ? 'danger' : 'primary'
                      }
                      size="sm"
                      variant="flat"
                    >
                      {intrant.statut}
                    </Chip>
                  </TableCell>
                  <TableCell>{intrant.observations || 'Aucune'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="5xl" 
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">Détails du bassin: {bassin.nom}</h2>
        </ModalHeader>
        <ModalBody>
          <Tabs 
            selectedKey={activeTab} 
            onSelectionChange={(key) => setActiveTab(key as string)}
            aria-label="Options"
          >
            <Tab key="general" title="Informations générales">
              {renderGeneralInfo()}
            </Tab>
            <Tab key="performances" title="Performances">
              {renderPerformances()}
            </Tab>
            <Tab key="peches" title="Pêches de contrôle">
              {renderPechesControle()}
            </Tab>
            <Tab key="calendrierRecolte" title="Calendrier de récolte">
              {renderCalendrierRecolte()}
            </Tab>
            <Tab key="calendrierIntrants" title="Calendrier d'intrants">
              {renderCalendrierIntrants()}
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Fermer
          </Button>
        </ModalFooter>
      </ModalContent>

      {/* Modal pour ajouter une performance */}
      <PerformanceForm
        isOpen={isPerformanceModalOpen}
        onClose={() => setIsPerformanceModalOpen(false)}
        onSubmit={handleAddPerformance}
        bassinId={bassin.id}
        bassinName={bassin.nom}
      />

      {/* Modal pour ajouter une pêche de contrôle */}
      <PecheControleForm
        isOpen={isPecheControleModalOpen}
        onClose={() => setIsPecheControleModalOpen(false)}
        onSubmit={handleAddPecheControle}
        bassinId={bassin.id}
        bassinName={bassin.nom}
      />

      {/* Modal pour ajouter un calendrier de récolte */}
      <CalendrierRecolteForm
        isOpen={isCalendrierRecolteModalOpen}
        onClose={() => setIsCalendrierRecolteModalOpen(false)}
        onSubmit={handleAddCalendrierRecolte}
        bassinId={bassin.id}
        bassinName={bassin.nom}
      />

      {/* Modal pour ajouter un calendrier d'intrants */}
      <CalendrierIntrantsForm
        isOpen={isCalendrierIntrantsModalOpen}
        onClose={() => setIsCalendrierIntrantsModalOpen(false)}
        onSubmit={handleAddCalendrierIntrants}
        bassinId={bassin.id}
        bassinName={bassin.nom}
      />
    </Modal>
  );
};

export default BassinDetails; 