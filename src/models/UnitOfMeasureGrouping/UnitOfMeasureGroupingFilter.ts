import { IdFilter, StringFilter } from "@react3l/advanced-filters";
import { ModelFilter } from "@react3l/react3l/core";

export class UnitOfMeasureGroupingFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();

  public code?: StringFilter = new StringFilter();
  public unitOfMeasureId?: IdFilter = new IdFilter();
}
