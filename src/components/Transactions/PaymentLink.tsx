import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { useTransactionStore } from "../../store/transactionStore";

const PaymentLink = () => {
  const { selectedTransaction } = useTransactionStore();

  const [paymentLink, setPaymentLink] = useState("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setPaymentLink(
      `https://pay.wave.com/m/M_onCx5MZEoMeE/mu/U_BGgzGyTH2CDi/c/ci/?amount=${selectedTransaction?.totalDue}`
    );
  }, [selectedTransaction]);

  return (
    <>
      <p className="text-xs text-center flex flex-col items-center justify-center">
        <span>Lien de paiement</span>
        <span className="font-black ~text-base/lg">
          {selectedTransaction?.totalDue} FCFA
        </span>
      </p>
      <div className="flex items-center gap-3 w-full mt-2">
        <div className="w-full flex items-center justify-between gap-2 bg-gray-100 p-[3px] rounded-md overflow-hidden">
          <span className="text-xs truncate pl-2">{paymentLink}</span>
          <Button
            isIconOnly
            size="sm"
            onPress={copyToClipboard}
            className="text-xs"
          >
            {copied ? (
              <i className="fa-solid fa-check"></i>
            ) : (
              <i className="fa-solid fa-copy"></i>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default PaymentLink;
