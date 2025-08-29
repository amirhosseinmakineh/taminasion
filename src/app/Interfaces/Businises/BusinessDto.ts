export interface BusinessDayTimeDto {
  dayOfWeek: number;
  /** شروع بازه زمانی به صورت رشته ساعت */
  fromTime?: string;
  /** پایان بازه زمانی به صورت رشته ساعت */
  toTime?: string;
  /** فیلدهای قدیمی که ممکن است از بک‌اند برگردند */
  from?: string;
  to?: string;
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
