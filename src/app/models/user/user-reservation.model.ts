export interface UserReservation {
  id: number;
  businessName: string;
  serviceName: string;
  reservationDate: string;
  status: string;
  amount?: number;
}

export interface UserReservationsResponse {
  isSuccess: boolean;
  message: string;
  data: UserReservation[];
}
