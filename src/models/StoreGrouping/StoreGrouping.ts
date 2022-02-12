import { Model } from "@react3l/react3l/core";
import { Moment } from "moment";
import { Status } from "models/Status";
import { Store } from "models/Store/Store";

export class StoreGrouping extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public parentId?: number;
  public parent?: StoreGrouping;
  public path?: string;
  public level?: number;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public stores?: Store[];
  public address1?: string;
  public address2?: string;
  public statusId?: number = 1;
  public status?: Status;
}
