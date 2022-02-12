import { IdFilter } from "@react3l/advanced-filters";
import { ModelFilter } from "@react3l/react3l/core";

export class ItemImageMappingFilter extends ModelFilter {
  public itemId?: IdFilter = new IdFilter();
  public imageId?: IdFilter = new IdFilter();
}
