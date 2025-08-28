export interface BusinessFilter {
  neighberHoodId: number;
  categoryId: number;        // همیشه number، نه string | undefined
  serviceIds: number[];
  take: number;
  skip: number;
  maxAmount: number;
}
