export interface AuthResponse<TData = any> {
  isSuccess: boolean;
  isFailure: boolean;
  message: string;
  data: TData;
}

export interface AuthUserDto {
  email: string;
  userName: string;
  password: string;
  tokenForChangePassword: string | null;
  expireChangePasswordToken: string | null;
  isBusinessOwner: boolean;
  id: string;
  isDelete: boolean;
  createObjectDate: string;
  updateObjectDate: string;
}
