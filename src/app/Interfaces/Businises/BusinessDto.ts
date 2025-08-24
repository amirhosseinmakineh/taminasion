import { RateEnum } from "../../../../Enums/RateEnum.enum"

export interface BusinessDto {
businessLogo : string,
businessName : string
businessOwnerName : string,
description : string,
achevmentNames : string[],
amount : number
userRate : RateEnum
}
