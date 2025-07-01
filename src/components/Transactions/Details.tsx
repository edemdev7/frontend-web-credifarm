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
import { ITransaction } from "../../api/services/transactionService";
import { capitalize } from "../../utils/formatters";
import UpdateForm from "./UpdateForm";

interface DetailsProps {
  selectedTransaction: ITransaction;
}

const Details: React.FC<DetailsProps> = ({ selectedTransaction }) => {
  const {
    isOpen: isTrsOpen,
    onOpen: onTrsOpen,
    onOpenChange: onTrsOpenChange,
  } = useDisclosure();
  return (
    <Card className="w-full">
      <>
        <CardBody>
          <div className="bg-gray-100 rounded-md p-2 flex justify-between">
            <span>
              {capitalize(selectedTransaction.supplierDisplayName, true) ||
                "---"}
            </span>
            <span className="font-black">TX{selectedTransaction.id}</span>
          </div>
          <div className="flex flex-row gap-3 mt-2">
            <Tooltip showArrow content="Modifier l'avance">
              <Button
                size="sm"
                color="primary"
                endContent={<i className="fas fa-edit"></i>}
                onPress={onTrsOpen}
              >
                Gérer avance
              </Button>
            </Tooltip>
            <UpdateForm isOpen={isTrsOpen} onOpenChange={onTrsOpenChange} />
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex flex-col">
            <span className="font-bold">Fournisseur</span>
            <span>{selectedTransaction.merchantDisplayName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Frais de transaction</span>
            <span>{selectedTransaction.fee}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Numéro de téléphone</span>
            <span>{selectedTransaction.merchantPhone}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Frais de retard</span>
            <span>{selectedTransaction.overdueFee}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Poche liquidité</span>
            <span>{selectedTransaction.liquidityPocket}</span>
          </div>
        </CardFooter>
      </>
    </Card>
  );
};

export default Details;
