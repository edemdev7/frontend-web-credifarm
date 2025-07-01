import { IResponse } from "../../../components/types/global";
import { buildUrl } from "../../../utils/formatters";
import axiosInstance from "../../axiosInstance";

export interface ILoan {
    id: number;
    farmer: {
        id: number,
        name: string,
        joinedCooperativeAt: string,
        ActiveLoansCount: number,
    },
    product: string,
    amount: number,
    loanEntries: {
      id: number,
      name: string,
      quantity: number,
      entry: {
        id: number,
        name: string,
        description: string,
        price: number,
        category: string,
        creationDate: Date,
      }
    }[]
    cropType: number,
    cycleLenght: number,
    expectedGrossMargin: number,
    productsPriceFluctuation: number,
    productPerishability: number,
    requestDate: Date,
    updateDate: Date,
    scoreRating: number,
    loanEvaluation: ILoanEvaluation | null,
    status: string,
}

export interface IPromiseData {
  respected: boolean;
}
export interface IPromise {
  id: number;
  promiseDate: string;
  amount: number;
  respected: boolean | undefined;
}

export interface ILoanEvaluation {
  id: string | undefined;
  loanId: number | undefined;
  yearsInCooperative: number | undefined;
  socialCapitalPayment: number | undefined;
  unpaidLoansCount: number | undefined;
  farmerParticipation: number | undefined;
  transactionLoyalty: number | undefined;
  score: number | undefined;
}

export interface INewLoanEvaluation {
  loanId: number | undefined;
  yearsInCooperative: number;
  socialCapitalPayment: number;
  unpaidLoansCount: number;
  farmerParticipation: number;
  transactionLoyalty: number;
}

// Données mockées pour les prêts
const mockLoans = [
  {
    id: 1,
    farmer: {
      id: 1,
      name: "Jean Dupont",
      joinedCooperativeAt: "2023-01-01",
      ActiveLoansCount: 2
    },
    product: "Aliment pour poissons",
    amount: 500000,
    loanEntries: [
      {
        id: 1,
        name: "Aliment premium",
        quantity: 100,
        entry: {
          id: 1,
          name: "Aliment premium",
          description: "Aliment de haute qualité pour poissons",
          price: 5000,
          category: "Alimentation",
          creationDate: new Date()
        }
      }
    ],
    cropType: 1,
    cycleLenght: 6,
    expectedGrossMargin: 150000,
    productsPriceFluctuation: 0.1,
    productPerishability: 0.05,
    requestDate: new Date(),
    updateDate: new Date(),
    scoreRating: 85,
    loanEvaluation: null,
    status: "PENDING"
  },
  {
    id: 2,
    farmer: {
      id: 2,
      name: "Marie Martin",
      joinedCooperativeAt: "2023-02-01",
      ActiveLoansCount: 1
    },
    product: "Aliment pour poissons",
    amount: 300000,
    loanEntries: [
      {
        id: 2,
        name: "Aliment standard",
        quantity: 50,
        entry: {
          id: 2,
          name: "Aliment standard",
          description: "Aliment standard pour poissons",
          price: 3000,
          category: "Alimentation",
          creationDate: new Date()
        }
      }
    ],
    cropType: 1,
    cycleLenght: 4,
    expectedGrossMargin: 90000,
    productsPriceFluctuation: 0.08,
    productPerishability: 0.03,
    requestDate: new Date(),
    updateDate: new Date(),
    scoreRating: 92,
    loanEvaluation: {
      id: "1",
      loanId: 2,
      yearsInCooperative: 1,
      socialCapitalPayment: 1,
      unpaidLoansCount: 0,
      farmerParticipation: 1,
      transactionLoyalty: 1,
      score: 92
    },
    status: "EVALUATED"
  },
  {
    id: 3,
    farmer: {
      id: 3,
      name: "Pierre Durand",
      joinedCooperativeAt: "2022-06-15",
      ActiveLoansCount: 0
    },
    product: "Aliment pour poissons",
    amount: 750000,
    loanEntries: [
      {
        id: 3,
        name: "Aliment premium",
        quantity: 150,
        entry: {
          id: 3,
          name: "Aliment premium",
          description: "Aliment de haute qualité pour poissons",
          price: 5000,
          category: "Alimentation",
          creationDate: new Date()
        }
      }
    ],
    cropType: 1,
    cycleLenght: 8,
    expectedGrossMargin: 225000,
    productsPriceFluctuation: 0.12,
    productPerishability: 0.04,
    requestDate: new Date(),
    updateDate: new Date(),
    scoreRating: 95,
    loanEvaluation: {
      id: "2",
      loanId: 3,
      yearsInCooperative: 2,
      socialCapitalPayment: 1,
      unpaidLoansCount: 0,
      farmerParticipation: 1,
      transactionLoyalty: 1,
      score: 95
    },
    status: "ACCEPTED"
  },
  {
    id: 4,
    farmer: {
      id: 4,
      name: "Sophie Leroy",
      joinedCooperativeAt: "2023-03-10",
      ActiveLoansCount: 1
    },
    product: "Aliment pour poissons",
    amount: 400000,
    loanEntries: [
      {
        id: 4,
        name: "Aliment standard",
        quantity: 80,
        entry: {
          id: 4,
          name: "Aliment standard",
          description: "Aliment standard pour poissons",
          price: 3000,
          category: "Alimentation",
          creationDate: new Date()
        }
      }
    ],
    cropType: 1,
    cycleLenght: 5,
    expectedGrossMargin: 120000,
    productsPriceFluctuation: 0.09,
    productPerishability: 0.06,
    requestDate: new Date(),
    updateDate: new Date(),
    scoreRating: 78,
    loanEvaluation: {
      id: "3",
      loanId: 4,
      yearsInCooperative: 1,
      socialCapitalPayment: 0,
      unpaidLoansCount: 1,
      farmerParticipation: 0,
      transactionLoyalty: 0,
      score: 78
    },
    status: "REJECTED"
  },
  {
    id: 5,
    farmer: {
      id: 5,
      name: "Lucas Moreau",
      joinedCooperativeAt: "2022-09-20",
      ActiveLoansCount: 0
    },
    product: "Aliment pour poissons",
    amount: 600000,
    loanEntries: [
      {
        id: 5,
        name: "Aliment premium",
        quantity: 120,
        entry: {
          id: 5,
          name: "Aliment premium",
          description: "Aliment de haute qualité pour poissons",
          price: 5000,
          category: "Alimentation",
          creationDate: new Date()
        }
      }
    ],
    cropType: 1,
    cycleLenght: 7,
    expectedGrossMargin: 180000,
    productsPriceFluctuation: 0.11,
    productPerishability: 0.04,
    requestDate: new Date(),
    updateDate: new Date(),
    scoreRating: 88,
    loanEvaluation: {
      id: "4",
      loanId: 5,
      yearsInCooperative: 2,
      socialCapitalPayment: 1,
      unpaidLoansCount: 0,
      farmerParticipation: 1,
      transactionLoyalty: 1,
      score: 88
    },
    status: "PAID"
  }
];

// Récupérer la liste des demandes de credit
export const getLoans = async (
  params?: Record<string, string | number | boolean>
): Promise<ILoan[]> => {
  // Utiliser les données mockées au lieu de faire un appel API
  return mockLoans;
};

export const acceptLoan = async (
  id: number,
): Promise<any> => {
  let url = ''
  const fullToken = localStorage.getItem("accessToken");
  const token = fullToken?.substring(3);
  const role = fullToken?.substring(0,3);
  if (role == 'ADM'){
    url = `/admin/loans/${id}/accept`;
  }else{
    url = `/cooperative/loans/${id}/accept`;
  }
  const response = await axiosInstance.post(url, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      contentType: 'application/json',
    }
  });
  return response;
}

export const rejectLoan = async (
  id: number,
): Promise<any> => {
  let url = ''
  const fullToken = localStorage.getItem("accessToken");
  const token = fullToken?.substring(3);
  const role = fullToken?.substring(0,3);
  if (role == 'ADM'){
    url = `/admin/loans/${id}/reject`;
  }else{
    url = `/cooperative/loans/${id}/reject`;
  }
  const response = await axiosInstance.post(url, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      contentType: 'application/json',
    }
  });
  return response;
}

export const markLoanAsPaid = async (
  id: number,
): Promise<any> => {
  let url = ''
  const fullToken = localStorage.getItem("accessToken");
  const token = fullToken?.substring(3);
  const role = fullToken?.substring(0,3);
  if (role == 'ADM'){
    url = `/admin/loans/${id}/mark-loan-as-paid`;
  }else{
    url = `/cooperative/loans/${id}/mark-loan-as-paid`;
  }
  const response = await axiosInstance.post(url, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      contentType: 'application/json',
    }
  });
  return response;
}

export const confirmLoan = async (
  id: number,
): Promise<any> => {
  let url = ''
  const fullToken = localStorage.getItem("accessToken");
  const token = fullToken?.substring(3);
  const role = fullToken?.substring(0,3);
  if (role == 'ADM'){
    url = `/admin/loans/${id}/confirm-loan`;
  }else{
    return;
  }
  const response = await axiosInstance.post(url, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      contentType: 'application/json',
    }
  });
  return response;
}


export const evaluateLoan = async (
  id: number,
  data: INewLoanEvaluation | ILoanEvaluation,
): Promise<any> => {
  let url = ''
  const fullToken = localStorage.getItem("accessToken");
  const token = fullToken?.substring(3);
  const role = fullToken?.substring(0,3);
  if (role == 'COO'){
    url = `/cooperative/loans/${id}/evaluate`;
  }else{
    return;
  }
  const response = await axiosInstance.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      contentType: 'application/json',
    }
  });
  return response;
}

export const updateLoanEvaluation = async (
  data: ILoanEvaluation,
): Promise<any> => {
  let url = ''
  const fullToken = localStorage.getItem("accessToken");
  const token = fullToken?.substring(3);
  const role = fullToken?.substring(0,3);
  if (role == 'COO'){
    url = `/cooperative/loans/${data.id}/evaluate`;
  }else{
    return;
  }
  const response = await axiosInstance.put(url, {data}, {
    headers: {
      Authorization: `Bearer ${token}`,
      contentType: 'application/json',
    }
  });
  return response;
}

export const cancelLoanEvaluation = async (
  id: number,
): Promise<any> => {
  let url = ''
  const fullToken = localStorage.getItem("accessToken");
  const token = fullToken?.substring(3);
  const role = fullToken?.substring(0,3);
  if (role == 'COO'){
    url = `/cooperative/loans/${id}/evaluate`;
  }else{
    return;
  }
  const response = await axiosInstance.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      contentType: 'application/json',
    }
  });
  return response;
}




// Mettre à jour une transaction existante
export const updateLoan = async (
  id: number,
  transactionData: Partial<ILoan>
): Promise<IResponse> => {
  const url = `/loans/${id}`;
  const response = await axiosInstance.patch<IResponse>(url, transactionData);
  return response.data;
};

// Créer une promesse de paiement
export const createPromise = async (
  id: number, // id de la transaction
  promiseData: Partial<IPromiseData>
): Promise<IResponse> => {
  const url = `/transactions/${id}/payment-promise`;
  const response = await axiosInstance.post<IResponse>(url, promiseData);
  return response.data;
};

// Mettre à jour une promesse de paiement existante
export const updatePromise = async (
  promiseId: number, // id de la promesse
  promiseData: Partial<IPromiseData>
): Promise<IResponse> => {
  const url = `/payment-promises/${promiseId}`;
  const response = await axiosInstance.patch<IResponse>(url, promiseData);
  return response.data;
};
// Mettre à jour une promesse de paiement existante
export const getPromises = async (): Promise<IResponse> => {
  const url = `/payment-promises/`;
  const response = await axiosInstance.get<IResponse>(url);
  return response.data;
};
