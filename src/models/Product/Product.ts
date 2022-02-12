import { Model } from "@react3l/react3l/core";
import { Brand } from "models/Brand";
import { Category } from "models/Category";
import { Item } from "models/Item";
import { ProductImageMapping } from "models/ProductImageMapping";
import { ProductProductGroupingMapping } from "models/ProductProductGroupingMapping/ProductProductGroupingMapping";
import { ProductType } from "models/ProductType";
import { Status } from "models/Status";
import { Supplier } from "models/Supplier";
import { TaxType } from "models/TaxType";
import { UnitOfMeasure } from "models/UnitOfMeasure";
import { UnitOfMeasureGrouping } from "models/UnitOfMeasureGrouping";
import { UnitOfMeasureGroupingContent } from "models/UnitOfMeasureGroupingContent/UnitOfMeasureGroupingContent";
import { VariationGrouping } from "models/VariationGrouping";

export class Product extends Model {
  public id?: number;

  public code?: string;

  public supplierCode?: string;

  public name?: string;

  public description?: string;

  public scanCode?: string;

  public eRPCode?: string;

  public productTypeId?: number;

  public supplierId?: number;

  public brandId?: number;

  public unitOfMeasureId?: number;

  public unitOfMeasureGroupingId?: number;

  public salePrice?: number;

  public retailPrice?: number;

  public taxTypeId?: number;

  public statusId?: number = 1;

  public otherName?: string;

  public technicalName?: string;

  public note?: string;

  public brand?: Brand;

  public productType?: ProductType;

  public status?: Status;

  public supplier?: Supplier;

  public taxType?: TaxType;

  public unitOfMeasure?: UnitOfMeasure;

  public unitOfMeasureGrouping?: UnitOfMeasureGrouping;

  public unitOfMeasureGroupingContents?: UnitOfMeasureGroupingContent[] = [];

  public items?: Item[];

  public productImageMappings?: ProductImageMapping[];

  public productProductGroupingMappings?: ProductProductGroupingMapping[];

  public variationGroupings?: VariationGrouping[];

  public usedVariationId?: number;

  public usedVariation?: Status;

  public variationCounter?: number;
  public canDelete?: boolean;
  public category?: Category;
  public categoryId?: number;
}
