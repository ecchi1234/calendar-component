import { Model } from "@react3l/react3l/core";
import { UnitOfMeasure } from "models/UnitOfMeasure";
import { Moment } from "moment";

export class UnitOfMeasureGrouping extends Model {
  public id?: number;
  public name?: string;
  public code?: string;
  public unitOfMeasureId?: number;
  public statusId?: number = 1;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public description?: string;
  public unitOfMeasure?: UnitOfMeasure;
}
