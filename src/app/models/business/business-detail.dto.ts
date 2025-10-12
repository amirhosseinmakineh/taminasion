import { BusinessServiceDto } from './business-service.dto';

export interface BusinessOwnerTimeDto {
  id: number;
  from: string;
  to: string;
  isReserved: boolean;
}

export interface BusinessOwnerDayDto {
  id: number;
  dayOfWeek: number;
  businessOwnerTimes: BusinessOwnerTimeDto[];
}

export interface BusinessAchievementDto {
  name: string;
  userId?: string;
}

export interface BusinessCommentDto {
  id?: number;
  userId?: string;
  userFullName?: string;
  comment?: string;
  text?: string;
  rate?: number;
  createdOn?: string;
}

export interface BusinessDetailDto {
  businessId: number;
  userId: string;
  name: string;
  logo: string;
  description: string;
  cityId: number;
  regionId: number;
  neighberhoodId: number;
  cityName: string;
  regionName: string;
  neighberhoodName: string;
  businessOwnerDayDtos: BusinessOwnerDayDto[];
  bannerName: string;
  businessServiceDtos: BusinessServiceDto[];
  commentDtos: BusinessCommentDto[];
  achievementDtos: BusinessAchievementDto[];
}
