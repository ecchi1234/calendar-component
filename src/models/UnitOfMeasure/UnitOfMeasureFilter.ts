import { IdFilter, StringFilter } from "@react3l/advanced-filters";
import { ModelFilter } from "@react3l/react3l/core";

export class UnitOfMeasureFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public description?: StringFilter = new StringFilter();
  public statusId?: IdFilter = new IdFilter();
  public unitOfMeasureGroupingId?: IdFilter = new IdFilter();
  public productId?: IdFilter = new IdFilter();
  public nameLower?: StringFilter = new StringFilter();
}