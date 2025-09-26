import { BusinessNeighborhood } from './business-neighborhood.model';

export interface BusinessRegion {
  id: number;
  regionName: string;
  neighborhoods: BusinessNeighborhood[];
}
