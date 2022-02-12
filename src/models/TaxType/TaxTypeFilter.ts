import {
  IdFilter,
  NumberFilter,
  StringFilter,
} from "@react3l/advanced-filters";
import { ModelFilter } from "@react3l/react3l/core";

export class TaxTypeFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public percentage?: NumberFilter = new NumberFilter();
  public statusId?: IdFilter = new IdFilter();
}
