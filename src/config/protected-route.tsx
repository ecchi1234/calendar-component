import React, { useContext } from "react";
import { MenuRouteContext } from "app/app-context";
import _ from "lodash";
import { FORBIDENT_ROUTE } from "./route-consts";
import { Redirect, Route } from "react-router";

export function ProtectedRoute ({ component: Component, auth, ...rest }) {
  return  <Route {...rest} render={(props) =>
    (
        auth === true
        ? <Component {...props} />
        : <Redirect to={FORBIDENT_ROUTE} />
    )}/>;
}

export function useCheckAuthorized() {
  const mapper = useContext<Record<string, number>>(MenuRouteContext);
  const auth = React.useCallback((path: string) => {
    if (!_.isEmpty(mapper)) {
      if (mapper.hasOwnProperty('hasAnyPermission')) {
        return true;
      }
      if (!mapper.hasOwnProperty(path)) {
        return false;
      }
    }
    return true;
  }, [mapper]);

  return {
    auth
  };
}
