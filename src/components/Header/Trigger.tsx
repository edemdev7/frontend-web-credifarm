import { FC } from "react";
import useTriggerStore from "../../store/triggerStore";

const Trigger: FC = () => {
  const { triggered, toggleTriggered } = useTriggerStore();

  return (
    <div className="md:hidden">
      <div
        onClick={toggleTriggered}
        className="cursor-pointer relative h-4 w-5"
      >
        <div
          className={`bg-slate-800 h-[2.3px] w-full rounded-full absolute top-0 origin-left transition-all duration-200 ${
            triggered && "scale-x-[0.6]"
          }`}
        ></div>
        <div className="bg-slate-800 h-[2.3px] w-full rounded-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-all duration-200"></div>
        <div
          className={`bg-slate-800 h-[2.3px] w-full rounded-full absolute bottom-0 end-0 origin-right transition-all duration-200 ${
            triggered && "scale-x-[0.6]"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default Trigger;
