import { Model } from "@react3l/react3l/core";
import { UnitOfMeasure } from "models/UnitOfMeasure";
import { UnitOfMeasureGrouping } from "models/UnitOfMeasureGrouping";

export class UnitOfMeasureGroupingContent extends Model {
  public id?: number;
  public unitOfMeasureGroupingId?: number;
  public unitOfMeasureId?: number;
  public factor?: number;
  public unitOfMeasure?: UnitOfMeasure;
  public unitOfMeasureGrouping?: UnitOfMeasureGrouping;
}
