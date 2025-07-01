import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface AddFeeFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const AddFeeForm: React.FC<AddFeeFormProps> = ({ isOpen, onOpenChange }) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          base: "!font-montserrat",
        }}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ajouter frais de retard
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-between">
                  <div className="text-xs">Nouveau frais de retard</div>
                  <div className="flex gap-1 items-center">
                    <div className="text-green-500 text-xs">(+ 1000)</div>
                    <div className="font-bold text-lg line-through text-zinc-300">
                      5000 FCFA
                    </div>
                  </div>
                  <div className="font-black text-3xl">6000 FCFA</div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className=""
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Fermer
                </Button>
                <Button
                  endContent={<i className="fa-solid fa-check-circle"></i>}
                  size="sm"
                  color="primary"
                  type="submit"
                >
                  Accepter
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddFeeForm;
