import React from "react";
import useStepStore from "../../store/suppliersStepStore";

const SuppliersSteps: React.FC = () => {
  const { steps, setCurrentStep, currentStep } = useStepStore();

  return (
    <div className="relative">
      <div className="h-9 w-[17px] absolute top-0 right-0 z-70 bg-gradient-to-l from-white to-transparent"></div>
      <div className="h-9 w-[17px] absolute top-0 left-0 z-70 bg-gradient-to-r from-white to-transparent"></div>
      <div className="flex w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep; // Étape passée
          const isActive = index + 1 === currentStep; // Étape actuelle
          const isFirst = index === 0; // Premier step
          const isLast = index === steps.length - 1; // Dernier step

          const stepBg = isCompleted
            ? "bg-blue-200 text-slate-700"
            : isActive
              ? "bg-blue-600 text-white"
              : "bg-slate-300 text-slate-700";

          const triangleBg = isCompleted
            ? "bg-blue-200"
            : isActive
              ? "bg-blue-600"
              : "bg-slate-300";

          return (
            <div
              key={`${step.id}-${index}`}

              className={`z-${60 - index * 10
                } text-nowrap text-xs text-center w-full flex items-center justify-center relative h-9 ${isFirst
                  ? "rounded-bl-full rounded-tl-full pl-8 ml-3"
                  : isLast
                    ? "rounded-br-full rounded-tr-full px-8 -translate-x-2 mr-3"
                    : "-translate-x-2 pl-10"
                } pr-5 ${stepBg} ${step.completed || step.id <= currentStep
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
                }`}
              onClick={() => {
                if (step.completed || step.id <= currentStep) {
                  setCurrentStep(step.id);
                }
              }}
            >
              {step.label}
              {step.completed && <i className="fa-regular fa-check ml-2"></i>}
              {!isLast && (
                <div
                  className={`absolute right-0 translate-x-1/2 rotate-45 w-[30.5px] h-[30.5px] ${triangleBg} p-3 border border-transparent border-t-3 border-t-slate-100 border-r-3 border-r-slate-100`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuppliersSteps;
