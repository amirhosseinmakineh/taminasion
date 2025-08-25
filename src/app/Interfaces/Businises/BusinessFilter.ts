export interface BusinessFilter {
  neighberHoodId: number;
  categoryId?: number;
  serviceIds?: number[];
  take?: number;
  skip?: number;
  maxAmount?: number;
}
