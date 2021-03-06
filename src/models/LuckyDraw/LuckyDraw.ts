import { LuckyDrawWinner } from "./../LuckyDrawWinner/LuckyDrawWinner";
import { LuckyDrawStructure } from "./../LuckyDrawStructure/LuckyDrawStructure";
import { LuckyDrawStoreTypeMappings } from "./../LuckyDrawStoreTypeMapping/LuckyDrawStoreTypeMapping";
import { LuckyDrawStoreMappings } from "./../LuckyDrawStoreMapping/LuckyDrawStoreMapping";
import { LuckyDrawStoreGroupingMappings } from "./../LuckyDrawStoreGroupingMapping/LuckyDrawStoreGroupingMapping";
import { Status } from "./../Status/Status";
import { Moment } from "moment";
import { Model } from "@react3l/react3l/core";
import { Image } from "models/Image";
import { LuckyDrawType } from "models/LuckyDrawType";

export class LuckyDraw extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public luckyDrawTypeId?: number;
  public organizationId?: number;
  public revenuePerTurn?: number;
  public startAt?: Moment;
  public endAt?: Moment;
  public avatarImageId?: number;
  public imageId?: number;
  public description?: string;
  public statusId?: number;
  public winLuckyDrawStructureId?: number;
  public used?: boolean;
  public remainingTurnCounter?: number;
  public usedTurnCounter?: number;
  public remainingLuckyDrawStructureCounter?: number;
  public avatarImage?: Image;
  public image?: Image;
  public luckyDrawType?: LuckyDrawType;
  public status?: Status;
  public luckyDrawStoreGroupingMappings?: LuckyDrawStoreGroupingMappings[] = [];
  public luckyDrawStoreMappings?: LuckyDrawStoreMappings[] = [];
  public luckyDrawStoreTypeMappings?: LuckyDrawStoreTypeMappings[] = [];
  public luckyDrawStructures?: LuckyDrawStructure[] = [];
  public winLuckyDrawStructure?: LuckyDrawStructure;
  public luckyDrawWinners?: LuckyDrawWinner[] = [];
}
