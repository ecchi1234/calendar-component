import { httpConfig } from "config/http";
import kebabCase from "lodash/kebabCase";
import nameof from "ts-nameof.macro";
import { AxiosResponse } from "axios";
import { Repository } from "@react3l/react3l/core";
import { BASE_API_URL } from "config/consts";
import { API_USER_NOTIFICATION_ROUTE } from "config/api-consts";
import { url } from "@react3l/react3l/helpers";
import { AppUser, AppUserFilter } from "models/AppUser";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

export class UserNotificationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = url(BASE_API_URL, API_USER_NOTIFICATION_ROUTE);
  }

  public count = (usedVariationFilter?: AppUserFilter): Observable<number> => {
    return this.httpObservable
      .post<number>(kebabCase(nameof(this.count)), usedVariationFilter)
      .pipe(map((response: AxiosResponse<number>) => response.data));
  };

  public list = (
    usedVariationFilter?: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.httpObservable
      .post<AppUser[]>(kebabCase(nameof(this.list)), usedVariationFilter)
      .pipe(map((response: AxiosResponse<AppUser[]>) => response.data));
  };

  public countUnread = (
    usedVariationFilter?: AppUserFilter
  ): Observable<number> => {
    return this.httpObservable
      .post<number>(kebabCase(nameof(this.countUnread)), usedVariationFilter)
      .pipe(map((response: AxiosResponse<number>) => response.data));
  };

  public update = (usedVariation: AppUser): Observable<AppUser> => {
    return this.httpObservable
      .post<AppUser>(kebabCase(nameof(this.update)), usedVariation)
      .pipe(map((response: AxiosResponse<AppUser>) => response.data));
  };

  public read = (id: number | string): Observable<AppUser> => {
    return this.httpObservable
      .post<AppUser>(kebabCase(nameof(this.read)), { id })
      .pipe(map((response: AxiosResponse<AppUser>) => response.data));
  };
}

export const userNotificationRepository = new UserNotificationRepository();
