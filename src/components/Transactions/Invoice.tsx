import {
  Button, // Ajout de Button
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";

interface InvoiceProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  transactionId: string; // Ajout de transactionId
}

const Invoice: React.FC<InvoiceProps> = ({
  isOpen,
  onOpenChange,
  transactionId,
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [transactionId]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xs"
      classNames={{
        base: "!font-montserrat",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Facture</ModalHeader>
        <ModalBody>
          {imageError ? (
            <div className="text-xs flex-col flex gap-3 items-center justify-center">
              <i className="fa-solid fa-warning text-lg"></i>
              <p className="text-center">
                Auncune facture pour la transaction selectionnée
              </p>
            </div>
          ) : (
            <img
              src={`http://13.51.243.214:3000/api/v1/wariportal/transaction/${transactionId}/document`}
              alt="Facture"
              className="w-full h-auto"
              onError={() => setImageError(true)}
            />
          )}
        </ModalBody>
        {!imageError && (
          <ModalFooter>
            <Button
              as="a"
              href={`http://13.51.243.214:3000/api/v1/wariportal/transaction/${transactionId}/document`}
              download="facture"
              variant="shadow"
              color="primary"
              size="sm"
              endContent={<i className="fa-duotone fa-download"></i>}
            >
              Télécharger
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Invoice;
