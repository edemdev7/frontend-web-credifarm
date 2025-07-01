import { FC, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Tabs, Tab } from "@heroui/react";
import { IFishFarmer } from "../../components/types/fishFarmer";
import ActivityStats from "./ActivityStats";
import ActivityHistory from "./ActivityHistory";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  fishFarmer: IFishFarmer;
}

const ActivityModal: FC<ActivityModalProps> = ({ isOpen, onClose, fishFarmer }) => {
  const [selectedTab, setSelectedTab] = useState("stats");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-chart-line text-xl text-primary"></i>
            <div>
              <h2 className="text-xl font-semibold">
                Activités de {fishFarmer.prenom} {fishFarmer.nom}
              </h2>
              <p className="text-sm text-gray-500">
                ID: {fishFarmer.id} | {fishFarmer.email}
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <Tabs 
            selectedKey={selectedTab} 
            onSelectionChange={(key) => setSelectedTab(key as string)}
            className="w-full"
          >
            <Tab 
              key="stats" 
              title={
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-chart-bar"></i>
                  <span>Statistiques</span>
                </div>
              }
            >
              <div className="mt-4">
                <ActivityStats fishFarmer={fishFarmer} />
              </div>
            </Tab>
            <Tab 
              key="history" 
              title={
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-history"></i>
                  <span>Historique</span>
                </div>
              }
            >
              <div className="mt-4">
                <ActivityHistory fishFarmer={fishFarmer} />
              </div>
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ActivityModal; 