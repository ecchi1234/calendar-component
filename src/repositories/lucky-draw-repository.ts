import { LuckyDraw } from "./../models/LuckyDraw/LuckyDraw";
import { AxiosResponse } from "axios";
import { Repository } from "@react3l/react3l/core";
import { kebabCase, url } from "@react3l/react3l/helpers";
import { httpConfig } from "config/http";
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import nameof from "ts-nameof.macro";

import { API_LUCKY_DRAW_PREFIX } from "config/api-consts";
import { LuckyDrawFilter } from "models/LuckyDraw";

export class LuckyDrawRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = url(BASE_API_URL, API_LUCKY_DRAW_PREFIX);
  }

  public count = (luckyDrawFilter?: LuckyDrawFilter): Observable<number> => {
    return this.httpObservable
      .post<number>(kebabCase(nameof(this.count)), luckyDrawFilter)
      .pipe(map((response: AxiosResponse<number>) => response.data));
  };

  public list = (
    luckyDrawFilter?: LuckyDrawFilter
  ): Observable<LuckyDraw[]> => {
    return this.httpObservable
      .post<LuckyDraw[]>(kebabCase(nameof(this.list)), luckyDrawFilter)
      .pipe(map((response: AxiosResponse<LuckyDraw[]>) => response.data));
  };

  public get = (id: number | string): Observable<LuckyDraw> => {
    return this.httpObservable
      .post<LuckyDraw>(kebabCase(nameof(this.get)), { id })
      .pipe(map((response: AxiosResponse<LuckyDraw>) => response.data));
  };

  public listLuckyDrawHistory = (
    luckyDrawFilter?: LuckyDrawFilter
  ): Observable<LuckyDraw[]> => {
    return this.httpObservable
      .post<LuckyDraw[]>(
        kebabCase(nameof(this.listLuckyDrawHistory)),
        luckyDrawFilter
      )
      .pipe(map((response: AxiosResponse<LuckyDraw[]>) => response.data));
  };

  public countLuckyDrawHistory = (
    luckyDrawFilter?: LuckyDrawFilter
  ): Observable<number> => {
    return this.httpObservable
      .post<number>(
        kebabCase(nameof(this.countLuckyDrawHistory)),
        luckyDrawFilter
      )
      .pipe(map((response: AxiosResponse<number>) => response.data));
  };

  public getDrawHistory = (id: number | string): Observable<LuckyDraw> => {
    return this.httpObservable
      .post<LuckyDraw>(kebabCase(nameof(this.getDrawHistory)), { id })
      .pipe(map((response: AxiosResponse<LuckyDraw>) => response.data));
  };

  public draw = (id: number | string): Observable<LuckyDraw> => {
    return this.httpObservable
      .post<LuckyDraw>(kebabCase(nameof(this.draw)), { id })
      .pipe(map((response: AxiosResponse<LuckyDraw>) => response.data));
  };
}

export const luckyDrawRepository = new LuckyDrawRepository();
