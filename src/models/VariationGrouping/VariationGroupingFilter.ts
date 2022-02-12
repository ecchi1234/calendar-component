import { IdFilter, StringFilter } from "@react3l/advanced-filters";
import { ModelFilter } from "@react3l/react3l/core";

export class VariationGroupingFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
  public productId?: IdFilter = new IdFilter();
}
