import { LuckyDrawStructure } from "models/LuckyDrawStructure/LuckyDrawStructure";
import { AppUser } from "models/AppUser";
import { Moment } from "moment";
import { Model } from "@react3l/react3l/core";
import { LuckyDraw } from "models/LuckyDraw";

export class LuckyDrawWinner extends Model {
  public id?: number;
  public luckyDrawId?: number;
  public luckyDrawStructureId?: number;
  public appUserId?: number;
  public appUser?: AppUser;
  public luckyDraw?: LuckyDraw;
  public luckyDrawStructure?: LuckyDrawStructure;
  public storeId?: number;
  public time?: Moment;
  public luckyDrawNumberId?: number;
}
