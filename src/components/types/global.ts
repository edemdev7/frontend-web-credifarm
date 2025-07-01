import { IConciliation } from "../../api/services/conciliationService";
import { IPromise, ITransaction } from "../../api/services/transactionService";
import { IRetailer } from "../../store/retailersStore";
import { ISuggestion } from "../../store/suggestionStore";
import { ISupplier } from "../../store/supplierStore";
import { Payment } from "../Transactions/PaymentPromises";

export interface IDataDetails {
  id: number;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  recommendBy: string;
  idDanaya: string | null;
  recommendationType: string;
  presentationMade: boolean;
  encounteredIssue: string | null;
  followUpDate1: string | null;
  followUpDate2: string | null;
  preferredName: string | null;
  isConvinced: boolean;
  waitingReason: string | null;
  blockingReason: string | null;
  masterStatus: string;
  stageStatus: string;
  role: string | null;
  createStep0: string;
  updateStep0: string | null;
  commentStep0: string;
  createStep1: string | null;
  updateStep1: string | null;
  commentStep1: string | null;
  createStep2: string | null;
  updateStep2: string | null;
  commentStep2: string | null;
  createStep3: string | null;
  updateStep3: string | null;
  commentStep3: string | null;
  createStep4: string | null;
  updateStep4: string | null;
  commentStep4: string | null;
  createStep5: string | null;
  updateStep5: string | null;
  commentStep5: string | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  business: string | null;
  client: string | null;
}

export interface IClient {
  id: number | undefined;
  firstName: string;
  name: string;
  e164: string;
  district: string;
  role: string;
  contactMethod: string;
  paymentMethod: string;
  paymentNumber: string;
  prospectId: string;
  birthDay: string;
  maritalStatus: string;
  education: string;
  gender: string;
}

export interface IResponse<T = any> {
  success: boolean;
  status: number;
  message?: string;
  data?: T;
}
