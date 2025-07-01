import React from "react";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { IMember } from "../../components/types/member";
import { cancelMembership } from "../../api/services/cooperative/memberService";
import { toast } from "react-hot-toast";

interface DetailsProps {
  member: IMember;
  onMemberAction: () => void;
}

const Details: React.FC<DetailsProps> = ({ member, onMemberAction }) => {
  const handleCancelMembership = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler l'adhésion de ce pisciculteur ?")) {
      try {
        const response = await cancelMembership(member.id);
        if (response.status === 200) {
          toast.success("Adhésion annulée avec succès");
          onMemberAction();
        } else {
          toast.error("Erreur lors de l'annulation de l'adhésion");
        }
      } catch (error) {
        console.error("Error canceling membership:", error);
        toast.error("Une erreur est survenue lors de l'annulation de l'adhésion");
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Détails du Pisciculteur</h2>
        {member.status === "active" && (
          <Button
            color="danger"
            variant="flat"
            onClick={handleCancelMembership}
          >
            Annuler l'adhésion
          </Button>
        )}
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Informations personnelles</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Nom:</span> {member.name}</p>
              <p><span className="font-medium">Téléphone:</span> {member.phone}</p>
              <p><span className="font-medium">Email:</span> {member.email}</p>
              <p><span className="font-medium">Genre:</span> {member.gender ? "Homme" : "Femme"}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Localisation</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Région:</span> {member.region}</p>
              <p><span className="font-medium">Département:</span> {member.department}</p>
              <p><span className="font-medium">Village:</span> {member.village}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Informations piscicoles</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Bassins:</span> {member.basins}</p>
              <p><span className="font-medium">Espèces:</span> {member.species}</p>
              <p>
                <span className="font-medium">Statut:</span>{" "}
                <Chip
                  color={member.status === "active" ? "success" : "danger"}
                  variant="flat"
                >
                  {member.status === "active" ? "Actif" : "Inactif"}
                </Chip>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Informations d'adhésion</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Date d'adhésion:</span>{" "}
                {new Date(member.joinedCooperativeAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Créé le:</span>{" "}
                {new Date(member.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Mis à jour le:</span>{" "}
                {new Date(member.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Details;
  