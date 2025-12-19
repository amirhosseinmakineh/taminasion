export interface UpdateBusinessOwnerInfoDto {
  imageName: string;
  family: string;
  age: number;
  city: BusinessOwnerCityDto;
  region: BusinessOwnerRegionDto;
  neighborhood: BusinessOwnerNeighborhoodDto;
  business: BusinessOwnerBusinessDto;
  dayIdes: number[];
  timeIdes: number[];
  bannerName: string;
  aboutMe: string;
}

export interface BusinessOwnerCityDto {
  id: number;
  name: string;
}

export interface BusinessOwnerRegionDto {
  id: number;
  regionName: string;
  cityId: number;
}

export interface BusinessOwnerNeighborhoodDto {
  id: number;
  neighborhoodName: string;
  regionId: number;
}

export interface BusinessOwnerBusinessDto {
  businessLogo: string;
  businessName: string;
  businessOwnerName: string;
  description: string;
  achevmentNames: string[];
  amount?: number;
  userRate?: number;
}
