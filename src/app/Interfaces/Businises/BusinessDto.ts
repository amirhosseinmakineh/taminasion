export interface BusinessDayTimeDto {
  dayOfWeek: number;
  from: string;
  to: string;
  isReserved: boolean;
  businessOwnerDayId: number;
  businessOwnerTimeId: number;
}

export interface BusinessDto {
  businessLogo: string;
  businessName: string;
  businessOwnerName: string;
  description: string;
  achevmentNames: string[];
  amount: number;
  userRate: number;
  businessDayTimeDtos: BusinessDayTimeDto[];
  id: number;
}
