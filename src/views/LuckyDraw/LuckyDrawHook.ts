import React, { Reducer } from "react";
import { useHistory } from "react-router";
import {
  RepoAction,
  repositoryReducer,
  RepoState,
} from "services/pages/master-service";
import _ from "lodash";
const qs = require("qs");
export class LuckyDrawService {
  public useLuckyDrawNavigation(
    route: string
  ): [(id: any) => void, () => void, (id: any) => void] {
    const history = useHistory();

    const baseRoute = React.useMemo(() => {
      let listPath = route.split("/");
      const baseRoute = "/" + listPath[listPath.length - 1];
      return baseRoute;
    }, [route]);

    const handleGoPlayZone = React.useCallback(
      (id: any) => {
        history.push(`${route}${baseRoute}-gamification?id=${id}`);
      },
      [history, route, baseRoute]
    );

    const handleGoPlayHistory = React.useCallback(
      (id: any) => {
        history.push(`${route}${baseRoute}-history?id=${id}`);
      },
      [history, route, baseRoute]
    );

    const handleGoBase = React.useCallback(() => {
      history.replace(`${route}${baseRoute}-master`);
    }, [route, baseRoute, history]);

    return [handleGoPlayZone, handleGoBase, handleGoPlayHistory];
  }

  useRepository(repository: any) {
    const history = useHistory();
    const initRepo = React.useMemo(() => {
      const queryParam: any = qs.parse(history.location.search.substring(1));
      if (!_.isEmpty(queryParam) && queryParam.tabNumber) {
        switch (queryParam.tabNumber) {
          case "1":
            return {
              list: repository.list,
              count: repository.count,
              tab: "1",
            };
          case "2":
            return {
              list: repository.listLuckyDrawHistory,
              count: repository.countLuckyDrawHistory,
              tab: "2",
            };
        }
      } else {
        return { list: repository.list, count: repository.count, tab: "1" };
      }
    }, [history, repository]);
    const [repo, dispatch] = React.useReducer<Reducer<RepoState, RepoAction>>(
      repositoryReducer,
      initRepo
    );

    const handleTabChange = React.useCallback(
      (activeKey: string) => {
        switch (activeKey) {
          case "1":
            dispatch({
              type: "UPDATE",
              data: {
                list: repository.list,
                count: repository.count,
                tab: "1",
              },
            });
            break;
          case "2":
            dispatch({
              type: "UPDATE",
              data: {
                list: repository.listLuckyDrawHistory,
                count: repository.countLuckyDrawHistory,
                tab: "2",
              },
            });
            break;
        }
      },
      [repository]
    );

    return {
      repo,
      dispatch,
      handleTabChange,
    };
  }
  public usePopupQuery(handleOpenPopup) {
    const [loading, setLoading] = React.useState<boolean>(true);
    React.useEffect(() => {
      if (loading) {
        const url = document.URL;
        const temp = url.split("#");
        const id = Number(temp[1]);
        if (url.includes("#") && typeof handleOpenPopup === "function") {
          handleOpenPopup(id);
          setLoading(false);
        }
      }
    }, [handleOpenPopup, loading]);
  }
}
export const luckyDrawService: LuckyDrawService = new LuckyDrawService();
