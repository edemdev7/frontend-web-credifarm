import { Card, CardBody, CardFooter, Divider } from "@heroui/react";

const steps = [
  { label: "Onboardé", icon: "🎉", description: "Fin du onboarding le <strong>05/01/2025</strong> à <strong>18h00</strong>" },
  {
    label: "Validation",
    icon: "✅",
    description:
      "Validation le <strong>05/01/2025</strong> à <strong>18h00</strong>",
  },
  {
    label: "Discussion",
    icon: "💬",
    description:
      "Discussion le <strong>04/01/2025</strong> à <strong>11h00</strong>",
    success: false,
  },
  {
    label: "Discussion",
    icon: "💬",
    description:
      "Discussion le <strong>04/01/2025</strong> à <strong>11h00</strong>",
  },
  {
    label: "Appel avec négociation",
    icon: "📞",
    description:
      "Appel le <strong>03/01/2025</strong> à <strong>16h00</strong>",
  },
  {
    label: "Discussion",
    icon: "💬",
    description:
      "Discussion le <strong>02/01/2025</strong> à <strong>14h00</strong>",
    success: true,
  },
  {
    label: "Début de l'onboarding",
    icon: "📝",
  },
];

const Activity = () => {
  return (
    <>
      <Card className="w-full">
        <CardBody>
          <h2 className="font-semibold flex items-center gap-2">
            <i className="fa-duotone fa-business-time"></i>
            <span>Activité</span>
          </h2>
        </CardBody>
        <Divider />
        <CardFooter className="grid text-xs">
          <div className="w-full">
            <p className="mb-2">Historique des activités de l'onboarding</p>
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-7.5 h-7.5 rounded-full border-2 border-gray-300 p-1 text-white flex justify-center items-center">
                      {step.success === true
                        ? "😊"
                        : step.success === false
                        ? "😞"
                        : step.icon}
                    </div>
                    <div>{step.label}</div>
                  </div>
                  <div className="flex gap-3">
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-5 bg-gray-300 ml-[13px]"></div>
                    )}
                    {step.description && (
                      <div
                        className="text-gray-500 text-xs"
                        dangerouslySetInnerHTML={{ __html: step.description }}
                      ></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default Activity;
