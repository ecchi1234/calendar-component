import { Model } from "@react3l/react3l/core";
import { Product } from "models/Product";
import { Image } from "models/Image";

export class ProductImageMapping extends Model {
  public productId?: number;
  public imageId?: number;
  public image?: Image;
  public product?: Product;
}
