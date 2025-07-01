import { FC, useEffect, useState } from "react";
import { useActivityStore } from "../../store/activityStore";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination, Chip, Input, Select, SelectItem, Button } from "@heroui/react";
import { getActivityTypeLabel, getActivityTypeColor, ACTIVITY_TYPES, ActivityType } from "../../components/types/activity";
import { IFishFarmer } from "../../components/types/fishFarmer";
import { IActivityFilters } from "../../components/types/activity";

interface ActivityHistoryProps {
  fishFarmer: IFishFarmer;
}

const ROWS_PER_PAGE = 10;

const ActivityHistory: FC<ActivityHistoryProps> = ({ fishFarmer }) => {
  const { activities, currentResponse, loading, error, fetchFishFarmerActivities } = useActivityStore();
  
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<IActivityFilters>({
    page: 1,
    limit: ROWS_PER_PAGE
  });

  useEffect(() => {
    fetchFishFarmerActivities(fishFarmer.id, filters);
  }, [fishFarmer.id, filters, fetchFishFarmerActivities]);

  const handleFilterChange = (key: keyof IActivityFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getActivityIcon = (type: ActivityType) => {
    const icons: Record<ActivityType, string> = {
      connexion: "fa-solid fa-sign-in-alt",
      creation_bassin: "fa-solid fa-water",
      ajout_poisson: "fa-solid fa-fish",
      distribution_aliment: "fa-solid fa-wheat-awn",
      diagnostic_maladie: "fa-solid fa-stethoscope",
      traitement: "fa-solid fa-pills",
      mesure_eau: "fa-solid fa-thermometer-half",
      maintenance_equipement: "fa-solid fa-wrench",
      recolte: "fa-solid fa-hand-holding",
      vente: "fa-solid fa-shopping-cart",
      autre: "fa-solid fa-ellipsis"
    };
    return icons[type] || icons.autre;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && activities.length === 0) {
    return (
      <Card className="w-full">
        <CardBody className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody>
          <div className="text-center text-red-500">
            <i className="fa-solid fa-exclamation-triangle text-2xl mb-2"></i>
            <p>{error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Historique des activités</h3>
          <Chip color="primary" variant="flat">
            {currentResponse?.total || 0} activité{currentResponse?.total !== 1 ? 's' : ''}
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            label="Type d'activité"
            placeholder="Tous les types"
            selectedKeys={filters.type ? [filters.type] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as ActivityType;
              handleFilterChange('type', selected || undefined);
            }}
            className="min-w-48"
          >
            <SelectItem key="all" value="">Tous les types</SelectItem>
            {ACTIVITY_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
          
          <Input
            type="date"
            label="Date de début"
            value={filters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
            className="min-w-48"
          />
          
          <Input
            type="date"
            label="Date de fin"
            value={filters.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
            className="min-w-48"
          />
          
          <Button
            color="primary"
            variant="flat"
            size="sm"
            onPress={() => {
              setFilters({ page: 1, limit: ROWS_PER_PAGE });
              setPage(1);
            }}
          >
            Réinitialiser
          </Button>
        </div>

        <Table
          aria-label="Historique des activités"
          bottomContent={
            currentResponse && currentResponse.total > ROWS_PER_PAGE ? (
              <Pagination
                page={page}
                total={Math.ceil(currentResponse.total / ROWS_PER_PAGE)}
                onChange={handlePageChange}
              />
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>Type</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>IP</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={loading}
            loadingContent={<Spinner />}
            items={activities}
          >
            {(activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <i className={`${getActivityIcon(activity.type)} text-lg`}></i>
                    <Chip 
                      color={getActivityTypeColor(activity.type) as any}
                      variant="flat"
                      size="sm"
                    >
                      {getActivityTypeLabel(activity.type)}
                    </Chip>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="text-sm font-medium">{activity.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(activity.date_activite)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-gray-500">
                    {activity.ip_address || '-'}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {activities.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-8">
            <i className="fa-solid fa-history text-2xl mb-2"></i>
            <p>Aucune activité trouvée pour ce pisciculteur</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ActivityHistory; 