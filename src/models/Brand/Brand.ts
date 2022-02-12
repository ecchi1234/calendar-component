import { Model } from "@react3l/react3l/core";
import { Status } from "models/Status";

export class Brand extends Model {
  public id?: number;

  public code?: string;

  public name?: string;

  public statusId?: number;

  public description?: string;

  public used?: boolean;

  public rowId?: string;

  public status?: Status;
}
