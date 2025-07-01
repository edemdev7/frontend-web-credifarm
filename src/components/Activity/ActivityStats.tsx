import { FC, useEffect } from "react";
import { useActivityStore } from "../../store/activityStore";
import { Card, CardBody, CardHeader, Progress, Spinner, Chip } from "@heroui/react";
import { getActivityTypeLabel, getActivityTypeColor } from "../../components/types/activity";
import { IFishFarmer } from "../../components/types/fishFarmer";

interface ActivityStatsProps {
  fishFarmer: IFishFarmer;
}

const ActivityStats: FC<ActivityStatsProps> = ({ fishFarmer }) => {
  const { activityStats, loading, error, fetchFishFarmerActivityStats } = useActivityStore();

  useEffect(() => {
    fetchFishFarmerActivityStats(fishFarmer.id);
  }, [fishFarmer.id, fetchFishFarmerActivityStats]);

  const totalActivities = activityStats.reduce((sum, stat) => sum + parseInt(stat.count), 0);

  if (loading) {
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

  if (activityStats.length === 0) {
    return (
      <Card className="w-full">
        <CardBody>
          <div className="text-center text-gray-500">
            <i className="fa-solid fa-chart-bar text-2xl mb-2"></i>
            <p>Aucune activité enregistrée pour ce pisciculteur</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Statistiques d'activité</h3>
          <Chip color="primary" variant="flat">
            Total: {totalActivities} activités
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {activityStats.map((stat) => {
            const percentage = totalActivities > 0 ? (parseInt(stat.count) / totalActivities) * 100 : 0;
            const color = getActivityTypeColor(stat.type) as any;
            
            return (
              <div key={stat.type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Chip color={color} variant="flat" size="sm">
                      {getActivityTypeLabel(stat.type)}
                    </Chip>
                    <span className="text-sm text-gray-600">
                      {stat.count} activité{parseInt(stat.count) > 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  color={color}
                  className="w-full"
                  size="sm"
                />
              </div>
            );
          })}
        </div>
        
        {/* Résumé des activités les plus fréquentes */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Activités les plus fréquentes</h4>
          <div className="flex flex-wrap gap-2">
            {activityStats.slice(0, 3).map((stat) => (
              <Chip 
                key={stat.type}
                color={getActivityTypeColor(stat.type) as any}
                variant="flat"
                size="sm"
              >
                {getActivityTypeLabel(stat.type)} ({stat.count})
              </Chip>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ActivityStats; 