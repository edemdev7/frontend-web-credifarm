import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Divider,
    Tooltip,
    useDisclosure,
  } from "@heroui/react";
  import React from "react";
  import { IMembershipRequest, acceptMembershipRequest, rejectMembershipRequest } from "../../api/services/cooperative/membershipRequestService";
  import { capitalize, formatDate } from "../../utils/formatters";
  import * as Enums from '../../utils/enums';
  import { useMembershipRequestStore } from "../../store/membershipRequestnStore";
  import toast from "react-hot-toast";

  interface DetailsProps {
    selectedMembershipRequest: IMembershipRequest;
  }
  
  const Details: React.FC<DetailsProps> = ({ selectedMembershipRequest }) => {
    const {
        setSelectedMembershipRequest,
        clearSelectedMembershipRequest,
        fetchMembershipRequests,
        membershipRequests
      } = useMembershipRequestStore();

    const handleAcceptMembershipRequest = () => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir accepter cette demande d'adhésion ?")) {
        const response = await acceptMembershipRequest(selectedMembershipRequest.id);
        console.log('status', response.status);
        if (response.status === 201) {
          selectedMembershipRequest.status = 'ACCEPTED'
          toast.success("Demande d'adhésion acceptée avec succès");
          await clearSelectedMembershipRequest();
          await fetchMembershipRequests();
        }else{
          toast.error(`Erreur lors de l'acceptation de la demande d'adhésion${response.status}`);
        }
      }
    }
  
    const handleRejectMembershipRequest = () => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir refuser cette demande d'adhésion ?")) {
        const response = await rejectMembershipRequest(selectedMembershipRequest.id);
        if (response.status === 201) {
          selectedMembershipRequest.status = 'REJECTED'
          toast.success("Demande d'adhésion rejetée avec succès");
          await fetchMembershipRequests();
        }else{
          toast.error(`Erreur lors du rejet de la demande d'adhésion${response.status}`);
        }
      }
    }

    return (
      <Card className="w-full">
        <>
          <CardBody>
            <div className="bg-gray-100 rounded-md p-2 flex justify-between">
              <span> Details du producteur: 
                {capitalize(` ${selectedMembershipRequest.farmer.name}`, true) ||
                  "---"}
              </span>
              <span className="font-black">#{selectedMembershipRequest.id}</span>
            </div>
            <div className="flex flex-row gap-3 mt-2">
              <Tooltip showArrow content="Actions">
              <div className="flex flex-row gap-2">
                {selectedMembershipRequest.status === 'PENDING' && (
                  <Button
                    size="sm"
                    // variant="shadow"
                    color="success"
                    endContent={<i className="fas fa-check"></i>}
                    onPress={handleAcceptMembershipRequest()}
                  >
                    Accepter la demande
                  </Button>
                )}
                {selectedMembershipRequest.status === 'PENDING' && (
                  <Button
                  size="sm"
                  // variant="shadow"
                  color="danger"
                  endContent={<i className="fas fa-times"></i>}
                  onPress={handleRejectMembershipRequest()}
                  >
                  Refuser la demande
                  </Button>
                )}
              </div>
              </Tooltip>
            </div>
          </CardBody>
          <Divider />
            <CardFooter className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 text-sm bg-gray-50 rounded-lg">
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Producteur</span>
              <span className="text-gray-900 text-sm font-bold">{selectedMembershipRequest.farmer.name}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Region</span>
              <span className="text-gray-900 text-sm font-bold">{selectedMembershipRequest.farmer.region.name}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Departement</span>
              <span className="text-gray-900 text-sm font-bold">{selectedMembershipRequest.farmer.department.name}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Village</span>
              <span className="text-gray-900 text-sm font-bold">{selectedMembershipRequest.farmer.village}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Date de Naissance</span>
              <span className="text-gray-900 text-sm font-bold">{formatDate(new Date(selectedMembershipRequest.farmer.dateOfBirth).toISOString())}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Genre</span>
              <span className="text-gray-900 text-sm font-bold">{Enums.genderEnum.find(crop => crop.value === selectedMembershipRequest.farmer.gender)?.label || '---'}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Type de Telephone</span>
              <span className="text-gray-900 text-sm font-bold">{Enums.phoneTypeEnum.find(crop => crop.value === selectedMembershipRequest.farmer.phoneType)?.label || '---'}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Statut matrimonial</span>
              <span className="text-gray-900 text-sm font-bold">{Enums.maritalStatusEnum.find(crop => crop.value === selectedMembershipRequest.farmer.maritalStatus)?.label || '---'}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Possede une compte bancaire</span>
              <span className="text-gray-900 text-sm font-bold">{selectedMembershipRequest.farmer.hasBankAccount ? 'Oui' : 'Non'}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Personnes dependants</span>
              <span className="text-gray-900 text-sm font-bold">{selectedMembershipRequest.farmer.dependents} personnes</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Niveau d'education</span>
              <span className="text-gray-900 text-sm font-bold">{Enums.educationLevelEnum.find(crop => crop.value === selectedMembershipRequest.farmer.educationLevel)?.label || '---'}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Activite principale</span>
              <span className="text-gray-900 text-sm font-bold">{Enums.mainActivityEnum.find(crop => crop.value === selectedMembershipRequest.farmer.mainActivity)?.label || '---'}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Activites secondaires</span>
              <ul className="text-gray-900 text-sm font-bold">
              {selectedMembershipRequest.farmer.secondaryActivities.length > 0 ? (
              selectedMembershipRequest.farmer.secondaryActivities.map((activity, index) => (
              <li key={index}>{activity}</li>
              ))
              ) : (
              <li>---</li>
              )}
              </ul>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Type d'exploitation de la terre</span>
              <span className="text-gray-900 text-sm font-bold">{Enums.landExploitationTypeEnum.find(crop => crop.value === selectedMembershipRequest.farmer.landExploitationType)?.label || '---'}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Experience dans l'agriculture</span>
              <span className="text-gray-900 text-sm font-bold">{selectedMembershipRequest.farmer.farmingExperience} ans</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Type de formation agricole</span>
              <span className="text-gray-900 text-sm font-bold">{Enums.agriculturalTrainingTypeEnum.find(crop => crop.value === selectedMembershipRequest.farmer.agriculturalTrainingType)?.label || '---'}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Suivi d'exploitation ou Conseil agricole</span>
              <span className="text-gray-900 text-sm font-bold">{Enums.farmMonitoringEnum.find(crop => crop.value === selectedMembershipRequest.farmer.farmMonitoring)?.label || '---'}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Date de la demande</span>
              <span className="text-gray-900 text-sm font-bold">{formatDate(new Date(selectedMembershipRequest.requestDate).toISOString())}</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Montant des crédits en cours</span>
              <span className="text-gray-900 text-sm font-bold">{selectedMembershipRequest.farmer.TotalAmountActiveLoans.toLocaleString('fr-FR')} XOF</span>
            </div>
            <div className="flex flex-col space-y-1 p-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 text-xs">Montant des crédits payés</span>
              <span className="text-gray-900 text-sm font-bold">{selectedMembershipRequest.farmer.TotalAmountPaidLoans.toLocaleString('fr-FR')} XOF</span>
            </div>
            </CardFooter>
        </>
      </Card>
    );
  };
  
  export default Details;
  