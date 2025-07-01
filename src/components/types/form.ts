export type Step1FormDataS = {
  firstName: string;
  name: string;
  displayName: string;
  e164: string;
  birthDay: string;
  contactMethod: string;
  paymentMethod: string;
  paymentNumber: string;
};

export type Step1FormData = {
  lastName: string;
  firstName: string;
  phoneNumber: string;
  recommendationType: string;
  recommendBy: string;
  commentStep0: string;
  masterStatus: string;
  stageStatus: string;
  updateStep0: string;
};

export type Step2FormDataS = {
  vertical: string;
  alcoholic: boolean;
  businessType: string;
  role: string;
  clientCount: string;
  reccuringClientCount: string;
  averageAmount: string;
  maxSaleCapacity: string;
  employeeCount: string;
  supplierCount: string;
  monthlyPurchaseValue: string;
  neighborhood: string;
  location: string;
};

export type Step2FormData = {
  presentationMade: boolean | string;
  encounteredIssue: string;
  followUpDate1: string | null;
  commentStep1: string;
  masterStatus: string;
  stageStatus: string;
  updateStep1: string;
  createStep1: string;
};

export type Step3FormData = {
  isConvinced: string;
  preferredName: string;
  waitingReason: string;
  blockingReason: string;
  followupDate2: string | null;
  businessType: string;
  vertical: string;
  function: string;
  segment: string;
  suppliers: string[];
  refuelingFrequency: string;
  paymentMethod: string;
  activityForm: string;
  supplierRelationshipDurationMonths: string;
  commentStep2: string;
  averageAmount: string;
  masterStatus: string;
  stageStatus: string;
  businessId: number;
  updateStep2: string;
  createStep2: string;
};

export type Step3FormDataS = {
  verified: boolean;
};

export type Step4FormData = {
  documentType: string;
  idDocumentFront: File;
  idDocumentBack: File;
  selfie: File;
  masterStatus: string;
  stageStatus: string;
  updateStep3: string;
  createStep3: string;
};

export interface Step5FormData {
  name: string;
  firstName: string;
  e164: string;
  birthDay: string;
  role: string;
  district: string;
  sex: string;
  paymentNumber: string;
  terminal: string;
  location: string;
  commentStep4: string;
  contactMethod: string;
  paymentMethod: string;
  prospectId: number;
  masterStatus: string;
  stageStatus: string;
  maritalStatus: string;
  education: string;
  gender: string;
  childrenCount: string;
  updateStep4: string;
  createStep4: string;
}

export type Step7FormData = {
  appInstalled: string;
  masterStatus: string;
  stageStatus: string;
  recommendationLimit: string;
  updateStep6: string;
  createStep6: string;
};
