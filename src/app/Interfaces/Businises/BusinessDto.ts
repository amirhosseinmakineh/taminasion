export interface BusinessDayTimeDto {
  dayOfWeek: number;
  /** شروع بازه زمانی به صورت رشته ساعت */
  fromTime: string;
  /** پایان بازه زمانی به صورت رشته ساعت */
  toTime: string;
  /**
   * فیلدهای جایگزین برای سازگاری با نسخه‌های قدیمی
   * در صورت ارسال از سرور، مقادیر از این فیلدها خوانده می‌شوند
   */
  from?: string;
  to?: string;
  isReserved: boolean;
  businessOwnerDayId: number;
  /** شناسه بازه زمانی؛ ممکن است در برخی روزها وجود نداشته باشد */
  businessOwnerTimeId?: number | null;
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
