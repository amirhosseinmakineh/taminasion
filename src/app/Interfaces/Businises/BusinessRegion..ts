import { BusinessNeighborhood } from './BusinessNeighberhood';

export interface BusinessRegion {
  id: number;
  regionName: string;
  neighborhoods: BusinessNeighborhood[];
}
