import { ISupplier } from "../../store/supplierStore";

export interface IProspect extends ISupplier {
  id: number;
  name: string;
  masterStatus: string;
  type: string;
  role: string;
}
