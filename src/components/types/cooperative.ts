export interface ICooperative {
    id: number;
    name: string;
    acronym: string;
    phone: string;
    password: string;
    confirmPassword: string;
    form: string;
    registrationNumber: string;
    headquarters: string;
    memberCount: number;
    mainCrop: number;
    creationDate: Date;
    secondaryCrops: number[];
    assets: number[];
    otp1: string;
    otp2: string;
    otp3: string;
    otp4: string;
    otp5: string;
    otp6: string;
    RCCMDocumentUrl: string;
    DFEDocumentUrl: string;
    MembershipRegisterDocumentUrl: string;
    threeYearBalanceSheetDocumentUrl: string;
}

export interface INewCooperative extends ICooperative {}
  
export interface CooperativeCredentials {
    phone: string;
    password: string;
}
  
export interface CooperativeLoginResponse {
    accessToken: string;
    data: {
        id: number;
        name: string;
        phone: string;
        acronym: string;
        form: string;
        registrationNumber: string;
        headquarters: string;
        memberCount: number;
        creationDate: Date;
        mainCrop: number;
        secondaryCrops: number[];
        assets: number[];
        registrationDocumentUrl: string;
        dfeDocumentUrl: string;
        membershipRegisterUrl: string;
        balanceSheetUrl: string;
    }
}
