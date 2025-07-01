import {
  Button,
  Checkbox,
  DateRangePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { DateValue } from "@react-types/datepicker";
import { RangeValue } from "@react-types/shared";
import { useState } from "react";

interface PurchFilterProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onFilterChange: (
    dateRange: RangeValue<DateValue> | null,
    isSorting: boolean
  ) => void;
}

const PurchFilter: React.FC<PurchFilterProps> = ({
  isOpen,
  onOpenChange,
  onFilterChange,
}) => {
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );
  const [isSorting, setIsSorting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(dateRange, isSorting);
    onOpenChange(false);
  };

  const onReset = () => {
    setDateRange(null);
    setIsSorting(false);
    onFilterChange(null, false);
    onOpenChange(false);
  };

  const formatter = useDateFormatter({
    dateStyle: "long",
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "!font-montserrat",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={onSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Filtrer par période
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3">
                <Checkbox
                  isSelected={isSorting}
                  onChange={(e) => setIsSorting(e.target.checked)}
                  size="sm"
                  classNames={{
                    base: "w-full",
                    label: "font-semibold !text-xs",
                  }}
                >
                  Trier par date d'achat
                </Checkbox>
                <DateRangePicker
                  label="Date d'achat"
                  onChange={setDateRange}
                  value={dateRange}
                  fullWidth
                  size="sm"
                  classNames={{
                    base: "w-full",
                    label: "font-semibold !text-xs",
                    input: "!text-xs",
                    calendar: "!font-montserrat !text-xs",
                  }}
                />

                <p className="text-xs">
                  <span className="font-bold">Période sélectionnée : </span>
                  <span>
                    {dateRange
                      ? formatter.formatRange(
                          dateRange.start.toDate(getLocalTimeZone()),
                          dateRange.end.toDate(getLocalTimeZone())
                        )
                      : "--"}
                  </span>
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                color="danger"
                variant="light"
                onPress={onClose}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                color="secondary"
                variant="light"
                onPress={onReset}
              >
                Réinitialiser
              </Button>
              <Button
                endContent={<i className="fa-solid fa-filter"></i>}
                size="sm"
                color="primary"
                type="submit"
              >
                Appliquer
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PurchFilter;
