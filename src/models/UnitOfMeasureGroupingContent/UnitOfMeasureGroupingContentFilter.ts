import { IdFilter, NumberFilter } from "@react3l/advanced-filters";
import { ModelFilter } from "@react3l/react3l/core";

export class UnitOfMeasureGroupingContentFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public unitOfMeasureGroupingId?: IdFilter = new IdFilter();
  public unitOfMeasureId?: IdFilter = new IdFilter();
  public factor?: NumberFilter = new NumberFilter();
}
