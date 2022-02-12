import React from "react";
import { useHistory } from "react-router";

export class RouterService {
  public useGoBack(): [() => void] {
    const history = useHistory();

    return [
      React.useCallback(() => {
        history.goBack();
      }, [history]),
    ];
  }

  public useCancel(): [() => void] {
    const history = useHistory();

    return [
      React.useCallback(() => {
        history.goBack();
      }, [history]),
    ];
  }

  public useMasterNavigation(
    route: string
  ): [
    () => void,
    (id: any) => () => void,
    (node: any) => () => void,
    () => void,
    (id: any) => (event: any) => void,
    (id: any) => () => void
  ] {
    const history = useHistory();

    const baseRoute = React.useMemo(() => {
      let listPath = route.split("/");
      const baseRoute = "/" + listPath[listPath.length - 1];
      return baseRoute;
    }, [route]);

    const handleGoCreate = React.useCallback(() => {
      history.push(`${route}${baseRoute}-detail`);
    }, [route, baseRoute, history]);

    const handleGoCreateTree = React.useCallback(
      (node: any) => {
        return () => {
          history.push(`${route}${baseRoute}-detail?id=${node.id}`);
        };
      },
      [route, baseRoute, history]
    );

    const handleGoDetail = React.useCallback(
      (id: any) => {
        return () => {
          history.push(`${route}${baseRoute}-detail?id=${id}`);
        };
      },
      [route, baseRoute, history]
    );

    const handleGoBase = React.useCallback(() => {
      history.replace(`${route}${baseRoute}-master`);
    }, [route, baseRoute, history]);

    const handleGoPreview = React.useCallback(
      (id: any) => {
        return () => {
          history.push(`${route}${baseRoute}-preview?id=${id}`);
        };
      },
      [route, baseRoute, history]
    );

    const handleGoApproval = React.useCallback(
      (id: any) => {
        return () => {

          history.push(`${route}${baseRoute}-approve?id=${id}`);
        };
      },
      [route, baseRoute, history]
    );

    return [
      handleGoCreate,
      handleGoDetail,
      handleGoCreateTree,
      handleGoBase,
      handleGoPreview,
      handleGoApproval,
    ];
  }
}

export const routerService: RouterService = new RouterService();
