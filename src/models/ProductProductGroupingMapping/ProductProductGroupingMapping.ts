import { Model } from "@react3l/react3l/core";
import { Product } from "models/Product";
import { ProductGrouping } from "models/ProductGrouping";

export class ProductProductGroupingMapping extends Model {
  public productId?: number;
  public productGroupingId?: number;
  public product?: Product;
  public productGrouping?: ProductGrouping;
}
