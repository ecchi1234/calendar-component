import { Model } from "@react3l/react3l/core";
import { ItemImageMapping } from "models/ItemImageMapping";
import { Product } from "models/Product";
import { Status } from "models/Status";
import { Moment } from "moment";
import { Image } from "models/Image";

export class Item extends Model {
  public id?: number;
  public productId?: number;
  public code?: string;
  public name?: string;
  public scanCode?: string;
  public salePrice?: number;
  public retailPrice?: number;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public product?: Product;
  public canDelete?: boolean = true;
  public variationId?: number;
  public statusId?: number = 1;
  public status?: Status;
  public itemImageMappings?: ItemImageMapping[];
  public images?: Image[];
  public salePriceWithVAT?: number;
}
