import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from "@heroui/react";
import PaymentLink from "./PaymentLink";
const Actions = () => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <h2 className="font-semibold flex items-center gap-2">
          <i className="fa-duotone fa-rocket"></i>
          <span>Actions</span>
        </h2>
      </CardHeader>
      <Divider />
      <CardBody className="!pt-0 !px-2">
        <Tabs
          classNames={{
            tab: "!text-xs",
            tabList: "!p-0",
            tabContent: "!p-0",
          }}
          variant="underlined"
          aria-label="Options"
        >
          <Tab key="link" title="Liens de paiement">
            <PaymentLink />
          </Tab>
          <Tab key="message" title="Message de rappel" className="text-xs">
            <p className="text-xs text-center mb-2">
              Sélectionnez le type de message
            </p>

            <div className="flex gap-2">
              <Select
                className="max-w-xs"
                placeholder="Sélectionnez un type de message"
                size="sm"
                variant="bordered"
                classNames={{
                  listbox: "!font-montserrat !text-xs",
                  label: "font-semibold !text-xs",
                  value: "!text-xs",
                }}
              >
                <SelectItem key="retard">Message de retard</SelectItem>
                <SelectItem key="echeance">Message d'échéance</SelectItem>
                <SelectItem key="rappel">Message de rappel</SelectItem>
              </Select>
              <Button
                size="sm"
                color="primary"
                endContent={<i className="fa-duotone fa-send"></i>}
              >
                Envoyer
              </Button>
            </div>
          </Tab>
          <Tab key="suppliers" title="Message fournisseur" className="text-xs">
            <p className="text-xs text-center mb-2">
              Sélectionnez le type de message fournisseur
            </p>

            <div className="flex gap-2">
              <Select
                className="max-w-xs"
                placeholder="Sélectionnez un type de message"
                size="sm"
                variant="bordered"
                classNames={{
                  listbox: "!font-montserrat !text-xs",
                  label: "font-semibold !text-xs",
                  value: "!text-xs",
                }}
              >
                <SelectItem key="retard">Message de retard</SelectItem>
                <SelectItem key="echeance">Message d'échéance</SelectItem>
                <SelectItem key="rappel">Message de rappel</SelectItem>
              </Select>
              <Button
                size="sm"
                color="primary"
                endContent={<i className="fa-duotone fa-send"></i>}
              >
                Envoyer
              </Button>
            </div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default Actions;
