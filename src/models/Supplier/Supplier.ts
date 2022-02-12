import { Model } from "@react3l/react3l/core";
import { AppUser } from "models/AppUser";
import { Status } from "models/Status";
import { Moment } from "moment";

export class Supplier extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public taxCode?: string;
  public phone?: string;
  public email?: string;
  public address?: string;
  public provinceId?: number;
  public districtId?: number;
  public wardId?: number;
  public ownerName?: string;
  public personInChargeId?: number;
  public statusId?: number = 1;
  public description?: string;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public personInCharge?: AppUser;
  public status?: Status;
  public updatedTime?: Moment;
}
