import { Model } from "@react3l/react3l/core";
import { Status } from "models/Status";
import { Moment } from "moment";

export class ProductGrouping extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public parentId?: number;
  public path?: string;
  public description?: string;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public parent?: ProductGrouping;
  public status?: Status;
  public statusId?: number = 1;
}
