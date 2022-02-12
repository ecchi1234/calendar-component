import { Model } from "@react3l/react3l/core";
import { Status } from "models/Status";
import { StoreStoreGroupingMapping } from "models/StoreGroupingMapping/StoreGroupingMapping";
export class Store extends Model {
  public id?: number;

  public codeDraft?: string;

  public code?: string;

  public name?: string;

  public parentStoreId?: number;

  public organizationId?: number;

  public storeTypeId?: number;

  public storeGroupingId?: number;

  public telephone?: string;

  public provinceId?: number;

  public districtId?: number;

  public wardId?: number;

  public address?: string;

  public deliveryAddress?: string;

  public latitude?: number;

  public longitude?: number;

  public deliveryLatitude?: number;

  public deliveryLongitude?: number;

  public ownerName?: string;

  public ownerPhone?: string;

  public ownerEmail?: string;

  public statusId?: number = 1;

  public parentStore?: Store;

  public status?: Status;

  public storeScoutingId?: number;

  public taxCode?: string;

  public storeStatusId?: number;

  public resellerId?: number;

  public creatorId?: number;

  public storeStoreGroupingMappings?: StoreStoreGroupingMapping[] = [];

  public isStoreApprovalDirectSalesOrder?: boolean;
}
