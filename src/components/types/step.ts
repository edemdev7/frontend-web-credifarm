export interface Step {
  label: string;
  id: number;
  completed: boolean;
}

export interface StepFields {
  type: "text" | "date" | "select" | "file" | "radio";
  label: string;
  placeholder?: string;
  icon?: string;
  options?: {
    label: string;
    value: string;
  }[];
}
