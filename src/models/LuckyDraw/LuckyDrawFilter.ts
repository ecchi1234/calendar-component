import { DateFilter, IdFilter, StringFilter } from "@react3l/advanced-filters";
import { ModelFilter, OrderType } from "@react3l/react3l/core";

export class LuckyDrawFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public startDate?: DateFilter = new DateFilter();
  public endDate?: DateFilter = new DateFilter();
  public updatedAt?: DateFilter = new DateFilter();
  public statusId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public luckyDrawTypeId?: IdFilter = new IdFilter();
  public usedAt?: DateFilter = new DateFilter();
  public startAt?: DateFilter = new DateFilter();
  public endAt?: DateFilter = new DateFilter();
  public orderType?: OrderType = "DESC";
  public orderBy?: string = "createdAt";
}
