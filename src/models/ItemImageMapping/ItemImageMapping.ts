import { Model } from "@react3l/react3l/core";

import { Image } from "models/Image";
export class ItemImageMapping extends Model {
  public itemId?: number;
  public imageId?: number;
  public image?: Image;
}
