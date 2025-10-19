export interface BusinessOwnerProfileResponse {
  isSuccess: boolean;
  isFailure: boolean;
  message: string;
  data: BusinessOwnerProfile | null;
}

export interface BusinessOwnerProfile {
  id: string;
  imageName: string | null;
  aboutMe: string | null;
  name: string | null;
  family: string | null;
  banner: string | null;
  workHistory: string | null;
  takingTurns: BusinessOwnerTurn[] | null;
  businessInfo: BusinessOwnerBusinessInfo | null;
  achievements: BusinessOwnerAchievement[] | null;
  comments: BusinessOwnerComment[] | null;
}

export interface BusinessOwnerTurn {
  id?: number;
  [key: string]: unknown;
}

export interface BusinessOwnerBusinessInfo {
  businessLogo: string | null;
  businessName: string | null;
  businessOwnerName: string | null;
  description: string | null;
  achevmentNames: string[] | null;
  amount: number | null;
  userRate: number | null;
  businessDayTimeDtos: unknown[] | null;
  serviceDtos: unknown[] | null;
  comments: BusinessOwnerComment[] | null;
  id: number | null;
  isDelete: boolean;
  createObjectDate: string | null;
  updateObjectDate: string | null;
}

export interface BusinessOwnerAchievement {
  name: string;
  userId: string;
}

export interface BusinessOwnerComment {
  id?: number;
  userId?: string;
  comment?: string | null;
  text?: string | null;
  [key: string]: unknown;
}
