import { Category } from "models/Category";
import { CategoryFilter } from "models/Category";
import { AppUserFilter } from "./../models/AppUser/AppUserFilter";
import { AppUser } from "./../models/AppUser/AppUser";
import { RequestState, RequestStateFilter } from "models/RequestState";
import { AxiosResponse } from "axios";
import { Repository } from "@react3l/react3l/core";
import { kebabCase, url } from "@react3l/react3l/helpers";
import { httpConfig } from "config/http";
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import nameof from "ts-nameof.macro";

import { API_DIRECT_SALES_ORDER_PREFIX } from "config/api-consts";
import {
  DirectSalesOrder,
  DirectSalesOrderFilter,
} from "models/DirectSalesOrder";
import { Item, ItemFilter } from "models/Item";
import { UnitOfMeasure, UnitOfMeasureFilter } from "models/UnitOfMeasure";
// import { Status, StatusFilter } from "models/Status";

export class DirectSalesOrderRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = url(BASE_API_URL, API_DIRECT_SALES_ORDER_PREFIX);
  }

  public count = (
    directSalesOrderFilter?: DirectSalesOrderFilter
  ): Observable<number> => {
    return this.httpObservable
      .post<number>(kebabCase(nameof(this.count)), directSalesOrderFilter)
      .pipe(map((response: AxiosResponse<number>) => response.data));
  };

  public list = (
    directSalesOrderFilter?: DirectSalesOrderFilter
  ): Observable<DirectSalesOrder[]> => {
    return this.httpObservable
      .post<DirectSalesOrder[]>(
        kebabCase(nameof(this.list)),
        directSalesOrderFilter
      )
      .pipe(
        map((response: AxiosResponse<DirectSalesOrder[]>) => response.data)
      );
  };

  public get = (id: number | string): Observable<DirectSalesOrder> => {
    return this.httpObservable
      .post<DirectSalesOrder>(kebabCase(nameof(this.get)), { id })
      .pipe(map((response: AxiosResponse<DirectSalesOrder>) => response.data));
  };

  public create = (
    directSalesOrder: DirectSalesOrder
  ): Observable<DirectSalesOrder> => {
    return this.httpObservable
      .post<DirectSalesOrder>(kebabCase(nameof(this.create)), directSalesOrder)
      .pipe(map((response: AxiosResponse<DirectSalesOrder>) => response.data));
  };

  public update = (
    directSalesOrder: DirectSalesOrder
  ): Observable<DirectSalesOrder> => {
    return this.httpObservable
      .post<DirectSalesOrder>(kebabCase(nameof(this.update)), directSalesOrder)
      .pipe(map((response: AxiosResponse<DirectSalesOrder>) => response.data));
  };

  public delete = (
    directSalesOrder: DirectSalesOrder
  ): Observable<DirectSalesOrder> => {
    return this.httpObservable
      .post<DirectSalesOrder>(kebabCase(nameof(this.delete)), directSalesOrder)
      .pipe(map((response: AxiosResponse<DirectSalesOrder>) => response.data));
  };

  public save = (
    directSalesOrder: DirectSalesOrder
  ): Observable<DirectSalesOrder> => {
    return directSalesOrder.id
      ? this.update(directSalesOrder)
      : this.create(directSalesOrder);
  };

  public bulkDelete = (idList: number[] | string[]): Observable<void> => {
    return this.httpObservable
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .pipe(map((response: AxiosResponse<void>) => response.data));
  };

  public export = (filter: any): Observable<AxiosResponse<any>> => {
    return this.httpObservable.post("export", filter, {
      responseType: "arraybuffer",
    });
  };

  public filterListStoreApprovalState = (): Observable<RequestState[]> => {
    return this.httpObservable
      .post<RequestState[]>(
        kebabCase(nameof(this.filterListStoreApprovalState)),
        new RequestStateFilter()
      )
      .pipe(map((response: AxiosResponse<RequestState[]>) => response.data));
  };

  public filterListGeneralApprovalState = (): Observable<RequestState[]> => {
    return this.httpObservable
      .post<RequestState[]>(
        kebabCase(nameof(this.filterListGeneralApprovalState)),
        new RequestStateFilter()
      )
      .pipe(map((response: AxiosResponse<RequestState[]>) => response.data));
  };

  public singleListAppUser = (
    appUserFilter?: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.httpObservable
      .post<AppUser[]>(
        kebabCase(nameof(this.singleListAppUser)),
        appUserFilter ? appUserFilter : new AppUserFilter()
      )
      .pipe(map((response: AxiosResponse<AppUser[]>) => response.data));
  };

  public send = (
    directSalesOrder: DirectSalesOrder
  ): Observable<DirectSalesOrder> => {
    return this.httpObservable
      .post<DirectSalesOrder>(kebabCase(nameof(this.send)), directSalesOrder)
      .pipe(map((response: AxiosResponse<DirectSalesOrder>) => response.data));
  };

  public approve = (
    directSalesOrder: DirectSalesOrder
  ): Observable<DirectSalesOrder> => {
    return this.httpObservable
      .post<DirectSalesOrder>(kebabCase(nameof(this.approve)), directSalesOrder)
      .pipe(map((response: AxiosResponse<DirectSalesOrder>) => response.data));
  };

  public reject = (
    directSalesOrder: DirectSalesOrder
  ): Observable<DirectSalesOrder> => {
    return this.httpObservable
      .post<DirectSalesOrder>(kebabCase(nameof(this.reject)), directSalesOrder)
      .pipe(map((response: AxiosResponse<DirectSalesOrder>) => response.data));
  };

  public listItem = (itemFilter: ItemFilter): Observable<Item[]> => {
    return this.httpObservable
      .post<Item[]>(kebabCase(nameof(this.listItem)), itemFilter)
      .pipe(map((response: AxiosResponse<Item[]>) => response.data));
  };

  public countItem = (itemFilter: ItemFilter): Observable<number> => {
    return this.httpObservable
      .post<number>(kebabCase(nameof(this.countItem)), itemFilter)
      .pipe(map((response: AxiosResponse<number>) => response.data));
  };

  public singleListUnitOfMeasure = (
    unitOfMeasureFilter: UnitOfMeasureFilter
  ): Observable<UnitOfMeasure[]> => {
    return this.httpObservable
      .post<UnitOfMeasure[]>(
        kebabCase(nameof(this.singleListUnitOfMeasure)),
        unitOfMeasureFilter
      )
      .pipe(map((response: AxiosResponse<UnitOfMeasure[]>) => response.data));
  };

  public printDirectOrder = (id: number): Observable<any> => {
    return this.httpObservable.get(
      `${kebabCase(nameof(this.printDirectOrder))}?Id=${id}`
    );
  };

  public filterListCategory = (
    categoryFilter: CategoryFilter
  ): Observable<Category[]> => {
    return this.httpObservable
      .post<Category[]>(
        kebabCase(nameof(this.filterListCategory)),
        categoryFilter
      )
      .pipe(map((response: AxiosResponse<Category[]>) => response.data));
  };
}

export const directSalesOrderRepository = new DirectSalesOrderRepository();
