import { Repository } from "@react3l/react3l/core";
import { httpConfig } from "config/http";
import { kebabCase, url } from "@react3l/react3l/helpers";
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AxiosResponse } from "axios";
import {FileModel, Message as Discussion, MessageFilter as DiscussionFilter} from "components/Utility/ChatBox/ChatBox.model";
import nameof from "ts-nameof.macro";

const API_DISSCUSION_PREFIX = 'rpc/utils/discussion';

export class DiscussionRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = url(BASE_API_URL, API_DISSCUSION_PREFIX);
  }

  public list = (discussionFilter: DiscussionFilter): Observable<Discussion[]> => {
    return this.httpObservable
      .post<Discussion[]>(kebabCase(nameof(this.list)), discussionFilter)
      .pipe(map((response: AxiosResponse<Discussion[]>) => response.data));
  };

  public count = (discussionFilter: DiscussionFilter): Observable<number> => {
    return this.httpObservable
      .post<number>(kebabCase(nameof(this.count)), discussionFilter)
      .pipe(map((response: AxiosResponse<number>) => response.data));
  };

  public get = (id: number): Observable<Discussion> => {
    return this.httpObservable
      .post<Discussion>(`/${id}`, {})
      .pipe(map((response: AxiosResponse<Discussion>) => response.data));
  };

  public create = (discussion: Discussion): Observable<Discussion> => {
    return this.httpObservable
      .post<Discussion>(kebabCase(nameof(this.create)), discussion)
      .pipe(map((response: AxiosResponse<Discussion>) => response.data));
  };

  public delete = (discussion: Discussion): Observable<boolean> => {
    return this.httpObservable
      .post<boolean>(kebabCase(nameof(this.delete)), discussion)
      .pipe(map((response: AxiosResponse<boolean>) => response.data));
  };

  public import = (file: File): Observable<FileModel> => {
    const formData: FormData = new FormData();
    formData.append(nameof(file), file);
    return this.httpObservable
      .post<FileModel>(kebabCase(nameof(this.import)), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(map((response: AxiosResponse<FileModel>) => response.data));
  };
}

export const discussionRepository: DiscussionRepository = new DiscussionRepository();
