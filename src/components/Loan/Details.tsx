import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Divider,
    select,
    Tooltip,
    useDisclosure,
  } from "@heroui/react";
  import React from "react";
  import { useState } from "react";
  import { ILoan, acceptLoan, rejectLoan, markLoanAsPaid, confirmLoan } from "../../api/services/cooperative/loanService";
  import { capitalize, formatDate } from "../../utils/formatters";
  import * as Enums from '../../utils/enums';
  import toast from "react-hot-toast";
  import { useLoanStore } from "../../store/loanStore";


  interface DetailsProps {
    selectedLoan: ILoan;
  }
  
  const Details: React.FC<DetailsProps> = ({ selectedLoan }) => {
    const { fetchLoans, loans } = useLoanStore();
     const [role] = useState(localStorage.getItem("accessToken")?.substring(0, 3) || '');
    

    const handleAcceptLoan = () => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir accepter cette demande de crédit ?")) {
        const response = await acceptLoan(selectedLoan.id);
        console.log('response',response);
        if (response.data.status = 200) {
          selectedLoan.status = 'ACCEPTED';
          toast.success('Demande de credit acceptée avec succès');
          await fetchLoans();
        }else{
          toast.error(`Erreur lors de l\'acceptation de la demande de crédit${response.data.status}`);
        }
      }
    }
  
    const handleRejectLoan = () => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir refuser cette demande de crédit ?")) {
        const response = await rejectLoan(selectedLoan.id);
        if (response.data.status == 200) {
          selectedLoan.status = 'REJECTED';
          toast.success('Demande de credit rejetée avec succès');
          await fetchLoans();
        }else{
          toast.error(`Erreur lors du rejet de la demande de crédit${response.data.status}`);
        }
      }
    }
  
    const handleMarkAsPaid = () => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir marquer cette demande de crédit comme étant payée ?")) {
        const response = await markLoanAsPaid(selectedLoan.id);
        if (response.data.status == 200) {
          selectedLoan.status = 'PAID';
          toast.success('Demande de credit marquée comme remboursée avec succès');
          await fetchLoans();
        }else{
          toast.error(`Erreur lors du marquage de la demande de crédit comme remboursée${response.data.status}`);
        }
      }
    }

    const handleConfirmLoan = () => async () => {
      if (window.confirm("Êtes-vous sûr de vouloir confirmer cette demande de crédit ?")) {
        const response = await confirmLoan(selectedLoan.id);
        console.log("Confirm Loan Response", response);
        if (response.data.status == 200) {
          selectedLoan.status = 'CONFIRMED';
          toast.success('Demande de credit confirmée avec succès');
          await fetchLoans();
        }else{
          toast.error(`Erreur lors de la confirmation de la demande de crédit${response.data.status}`);
        }
      }
    }

    return (
      <Card className="w-full">
        <>
          <CardBody>
            <div className="bg-gray-100 rounded-md p-2 flex justify-between">
              <span>
                {capitalize(selectedLoan.farmer.name, true) ||
                  "---"}
              </span>
              <span className="font-black">#{selectedLoan.id}</span>
            </div>
            {/* <div className="flex flex-row gap-3 mt-2">
              <Tooltip showArrow content="Actions">
              <div className="flex flex-row gap-2">
                {(role == 'COO' && selectedLoan.status === "PENDING") && (
                  <>
                    <Button
                      size="sm"
                      color="success"
                      endContent={<i className="fas fa-check"></i>}
                      onPress={handleAcceptLoan()}
                    >
                      Accepter
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      endContent={<i className="fas fa-check"></i>}
                      onPress={handleRejectLoan()}
                    >
                      Refuser
                    </Button>
                  </>
                )}
                { (role == 'COO' && selectedLoan.status === "CONFIRMED") && (
                  <Button
                    size="sm"
                    color="success"
                    endContent={<i className="fas fa-check-circle"></i>}
                    onPress={handleMarkAsPaid()}
                    >
                    Marquer comme remboursé
                    </Button>
                )}
                {(role == 'ADM' && selectedLoan.status === "PENDING") && (
                  <>
                    <Button
                      size="sm"
                      color="success"
                      endContent={<i className="fas fa-check"></i>}
                      onPress={handleConfirmLoan()}
                    >
                      Accepter
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      endContent={<i className="fas fa-check"></i>}
                      onPress={handleRejectLoan()}
                    >
                      Refuser
                    </Button>
                  </>
                )}
                {(role == 'ADM' && selectedLoan.status === "ACCEPTED") && (
                  <>
                    <Button
                      size="sm"
                      color="success"
                      endContent={<i className="fas fa-check"></i>}
                      onPress={handleConfirmLoan()}
                    >
                      Confirmer
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      endContent={<i className="fas fa-check"></i>}
                      onPress={handleRejectLoan()}
                    >
                      Refuser
                    </Button>
                  </>
                )}
                {(role == 'ADM' && selectedLoan.status === "CONFIRMED") && (
                  <Button
                    size="sm"
                    color="success"
                    endContent={<i className="fas fa-check-circle"></i>}
                    onPress={handleMarkAsPaid()}
                    >
                    Marquer comme remboursé
                  </Button>
                )}
              </div>
              </Tooltip>
            </div> */}
          </CardBody>
          <Divider />
          <CardFooter className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col">
              <span className="font-bold">Produit</span>
              <span>{selectedLoan.product}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Montant</span>
              <span>{selectedLoan.amount}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-bold">Type de culture</span>
                <span>{Enums.cropTypeEnum.find(crop => crop.value === selectedLoan.cropType)?.label || '---'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Longueur du cycle</span>
              <span>{Enums.cycleLenghtEnum.find(crop => crop.value === selectedLoan.cycleLenght)?.label || '---'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Marge Brute Attendue</span>
              {/* <span>{selectedLoan.expectedGrossMargin}</span> */}
              <span>{Enums.expectedGrossMarginEnum.find(crop => crop.value === selectedLoan.expectedGrossMargin)?.label || '---'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Produits sujets a fluxtuation de prix</span>
              {/* <span>{selectedLoan.productsPriceFluctuation}</span> */}
              <span>{Enums.productsPriceFluctuationEnum.find(crop => crop.value === selectedLoan.productsPriceFluctuation)?.label || '---'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Perissabilite des produits</span>
              {/* <span>{selectedLoan.productPerishability}</span> */}
              <span>{Enums.productPerishabilityEnum.find(crop => crop.value === selectedLoan.productPerishability)?.label || '---'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Date de la demande</span>
              <span>{formatDate(new Date(selectedLoan.requestDate).toISOString())}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Score</span>
              <span>{selectedLoan.scoreRating}</span>
            </div>

            <div className="col-span-2">
              <span className="font-bold">Intrants demandes</span>
              <table className="min-w-full mt-2">
              <thead>
                <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Intrant</th>
                <th className="border px-2 py-1">Quantite</th>
                </tr>
              </thead>
              <tbody>
                {selectedLoan.loanEntries.map((loanEntry, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{loanEntry.id}</td>
                  <td className="border px-2 py-1">{loanEntry.entry.name}</td>
                  <td className="border px-2 py-1">{loanEntry.quantity}</td>
                </tr>
                ))}
              </tbody>
              </table>
            </div>


          </CardFooter>
        </>
      </Card>
    );
  };
  
  export default Details;
  