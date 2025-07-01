export interface IAdmin {
    id: number;
    name: string;
    username: string;
    isSuperAdmin: boolean;
    authKey: string;
  }
  
  
  export interface AdminLoginResponse {
    accessToken: string;
    data: {
        id: number;
        name: string;
        username: string;
        isSuperAdmin: boolean;
    };
  }

  export interface INewAdmin {
    username: string;
    name: string;
    isSuperAdmin: boolean;
    password: string;
}
  