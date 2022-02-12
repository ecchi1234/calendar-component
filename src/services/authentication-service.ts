import { Repository } from "@react3l/react3l/core";
import _, { kebabCase } from "lodash";
import { ActionContext } from "app/app-context";
import { AxiosResponse } from "axios";
import { LOGIN_ROUTE } from "config/route-consts";
import * as Cookie from "js-cookie";
import { AppUser } from "models/AppUser";
import React from "react";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { httpConfig } from "config/http";

class AuthenticationService extends Repository {
  constructor() {
    super(httpConfig);
  }

  public checkAuth() {
    return this.httpObservable
      .post("rpc/dms-abe/profile/get")
      .pipe(map((response: AxiosResponse<AppUser>) => response.data));
  }

  public login(appUser: AppUser) {
    return this.httpObservable
      .post("rpc/dms-abe/account/login", appUser)
      .pipe(map((response: AxiosResponse<AppUser>) => response.data));
  }

  public listPath() {
    return this.httpObservable
      .post(`rpc/dms/permission/list-path`, {})
      .pipe(map((response: AxiosResponse<string[]>) => response.data));
  }
  public listPathMDM() {
    return this.httpObservable
      .post(`rpc/mdm/permission/list-path`, {})
      .pipe(map((response: AxiosResponse<string[]>) => response.data));
  }

  public async logout() {
    Cookie.remove("Token");
    window.location.href = LOGIN_ROUTE;
  }

  public getConfiguration(): Observable<any> {
    return this.httpObservable
      .post(`/rpc/dms-abe/system-configuration/get`, {})
      .pipe(map((response: AxiosResponse<any>) => response.data));
  }

  public useAction(module: string, baseAction: string) {
    const actionContext = React.useContext<string[]>(ActionContext);
    const [actionMapper, setActionMapper] = React.useState<
      Record<string, number>
    >({});

    React.useEffect(() => {
      const mapper: Record<string, number> = {};
      const regex = new RegExp(`^(${baseAction})/`, "i");
      actionContext.forEach((item: string, index: number) => {
        if (item.match(regex)) {
          mapper[item] = index;
        }
      });
      setActionMapper(mapper);
    }, [actionContext, module, baseAction]);

    const buildAction = React.useCallback(
      (action: string) => {
        return `${baseAction}/${kebabCase(action)}`;
      },
      [baseAction]
    );

    const validAction = React.useMemo(() => {
      return (action: string) => {
        if (
          !_.isEmpty(actionMapper) &&
          actionMapper.hasOwnProperty(buildAction(action))
        ) {
          return true;
        }
        return false;
      };
    }, [actionMapper, buildAction]);

    return { validAction };
  }
}

export default new AuthenticationService();
