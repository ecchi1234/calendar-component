import { AxiosResponse } from 'axios';
import { Repository } from "@react3l/react3l/core";
import { kebabCase, url } from "@react3l/react3l/helpers";
import {httpConfig} from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import nameof from "ts-nameof.macro";

import { API_BRAND_PREFIX } from "config/api-consts";
import { Brand, BrandFilter } from 'models/Brand';
import { Status, StatusFilter } from 'models/Status';

export class BrandRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = url(BASE_API_URL, API_BRAND_PREFIX);
    }

    public count = (brandFilter?: BrandFilter): Observable<number> => {
        return this.httpObservable.post<number>(kebabCase(nameof(this.count)), brandFilter)
          .pipe(map((response: AxiosResponse<number>) => response.data));
    };

    public list = (brandFilter?: BrandFilter): Observable<Brand[]> => {
        return this.httpObservable.post<Brand[]>(kebabCase(nameof(this.list)), brandFilter)
            .pipe(map((response: AxiosResponse<Brand[]>) => response.data));
    };

    public get = (id: number | string): Observable<Brand> => {
        return this.httpObservable.post<Brand>
            (kebabCase(nameof(this.get)), { id })
            .pipe(map((response: AxiosResponse<Brand>) => response.data));
    };

    public create = (brand: Brand): Observable<Brand> => {
        return this.httpObservable.post<Brand>(kebabCase(nameof(this.create)), brand)
            .pipe(map((response: AxiosResponse<Brand>) => response.data));
    };

    public update = (brand: Brand): Observable<Brand> => {
        return this.httpObservable.post<Brand>(kebabCase(nameof(this.update)), brand)
            .pipe(map((response: AxiosResponse<Brand>) => response.data));
    };

    public delete = (brand: Brand): Observable<Brand> => {
        return this.httpObservable.post<Brand>(kebabCase(nameof(this.delete)), brand)
            .pipe(map((response: AxiosResponse<Brand>) => response.data));
    };

    public save = (brand: Brand): Observable<Brand> => {
        return brand.id ? this.update(brand) : this.create(brand);
    };

    public singleListStatus = (): Observable<Status[]> => {
        return this.httpObservable.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
            .pipe(map((response: AxiosResponse<Status[]>) => response.data));
    };
    

    public bulkDelete = (idList: number[] | string[]): Observable<void> => {
        return this.httpObservable.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(map((response: AxiosResponse<void>) => response.data));
    };

    public import = (file: File, name: string = nameof(file)): Observable<void> => {
        const formData: FormData = new FormData();
        formData.append(name, file as Blob);
        return this.httpObservable.post<void>(kebabCase(nameof(this.import)), formData)
            .pipe(map((response: AxiosResponse<void>) => response.data));
    };

    public export = (filter: any): Observable<AxiosResponse<any>> => {
        return this.httpObservable.post('export', filter, {
          responseType: 'arraybuffer',
        });
    };

    public exportTemplate = (): Observable<AxiosResponse<any>> => {
        return this.httpObservable.post('export-template', {}, {
          responseType: 'arraybuffer',
        });
    };
    
}

export const brandRepository = new BrandRepository();
