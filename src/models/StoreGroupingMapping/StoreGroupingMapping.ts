import { StoreGrouping } from "models/StoreGrouping/StoreGrouping";
import { Model } from "@react3l/react3l/core";

export class StoreStoreGroupingMapping extends Model {
  public storeGrouping?: StoreGrouping;
  public storeGroupingId?: number;
  public storeId?: number;
}
