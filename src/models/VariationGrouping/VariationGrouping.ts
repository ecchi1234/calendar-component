import { Model } from "@react3l/react3l/core";
import { Product } from "models/Product";
import { Moment } from "moment";

export class VariationGrouping extends Model {
  public id?: number;
  code?: string = null;
  public name?: string;
  public productId?: number;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public product?: Product;
}
