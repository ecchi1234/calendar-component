import { Model } from "@react3l/react3l/core";
import { Status } from "models/Status";
import { Moment } from "moment";

export class ProductType extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public description?: string;
  public statusId?: number = 1;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public status?: Status;
  public updatedTime?: Moment;
}
