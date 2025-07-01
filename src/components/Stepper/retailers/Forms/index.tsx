import { FC } from "react";
import useStepStore from "../../../../store/retailersStepStore";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";

const Forms: FC = () => {
  const { currentStep, steps } = useStepStore();
  const renderStepForm = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      case 6:
        return <Step6 />;
      case 7:
        return <Step7 />;

      default:
        return <div>Aucune étape trouvée.</div>;
    }
  };

  return (
    <section>
      <h1 className="text-sm mb-5 text-center">
        Étape {currentStep} : <b>{steps[currentStep - 1].label || ""}</b>
      </h1>
      {renderStepForm()}
    </section>
  );
};

export default Forms;
