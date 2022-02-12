import { IdFilter, StringFilter } from "@react3l/advanced-filters";
import { ModelFilter } from "@react3l/react3l/core";

export class ProductGroupingFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public parentId?: IdFilter = new IdFilter();
  public path?: StringFilter = new StringFilter();
  public description?: StringFilter = new StringFilter();
}
