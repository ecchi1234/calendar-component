import { AxiosResponse } from 'axios';
import { Repository } from "@react3l/react3l/core";
import { kebabCase, url } from "@react3l/react3l/helpers";
import {httpConfig} from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import nameof from "ts-nameof.macro";

import { API_CATEGORY_PREFIX } from "config/api-consts";
import { Category, CategoryFilter } from 'models/Category';
import { Image, ImageFilter } from 'models/Image';
import { Status, StatusFilter } from 'models/Status';

export class CategoryRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = url(BASE_API_URL, API_CATEGORY_PREFIX);
    }

    public count = (categoryFilter?: CategoryFilter): Observable<number> => {
        return this.httpObservable.post<number>(kebabCase(nameof(this.count)), categoryFilter)
          .pipe(map((response: AxiosResponse<number>) => response.data));
    };

    public list = (categoryFilter?: CategoryFilter): Observable<Category[]> => {
        return this.httpObservable.post<Category[]>(kebabCase(nameof(this.list)), categoryFilter)
            .pipe(map((response: AxiosResponse<Category[]>) => response.data));
    };

    public get = (id: number | string): Observable<Category> => {
        return this.httpObservable.post<Category>
            (kebabCase(nameof(this.get)), { id })
            .pipe(map((response: AxiosResponse<Category>) => response.data));
    };

    public create = (category: Category): Observable<Category> => {
        return this.httpObservable.post<Category>(kebabCase(nameof(this.create)), category)
            .pipe(map((response: AxiosResponse<Category>) => response.data));
    };

    public update = (category: Category): Observable<Category> => {
        return this.httpObservable.post<Category>(kebabCase(nameof(this.update)), category)
            .pipe(map((response: AxiosResponse<Category>) => response.data));
    };

    public delete = (category: Category): Observable<Category> => {
        return this.httpObservable.post<Category>(kebabCase(nameof(this.delete)), category)
            .pipe(map((response: AxiosResponse<Category>) => response.data));
    };

    public save = (category: Category): Observable<Category> => {
        return category.id ? this.update(category) : this.create(category);
    };

    public singleListImage = (imageFilter: ImageFilter): Observable<Image[]> => {
        return this.httpObservable.post<Image[]>(kebabCase(nameof(this.singleListImage)), imageFilter)
            .pipe(map((response: AxiosResponse<Image[]>) => response.data));
    };
    public singleListCategory = (categoryFilter: CategoryFilter): Observable<Category[]> => {
        return this.httpObservable.post<Category[]>(kebabCase(nameof(this.singleListCategory)), categoryFilter)
            .pipe(map((response: AxiosResponse<Category[]>) => response.data));
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

export const categoryRepository = new CategoryRepository();
