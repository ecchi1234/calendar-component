import { Model } from "@react3l/react3l/core";
import { commonService } from "@react3l/react3l/services";
import { menu } from "config/menu";
import { LOGIN_ROUTE } from "config/route-consts";
import * as Cookie from "js-cookie";
import { Reducer, useCallback, useEffect, useReducer } from "react";
import { Subscription } from "rxjs";
import appMessageService, { messageType } from "services/app-message-service";
import authenticationService from "services/authentication-service";
import { AppAction, AppActionEnum, appReducer, AppState } from "./app-store";

export default function useApp() {
  const [subscription] = commonService.useSubscription();
  // reducer
  const [state, dispatch] = useReducer<Reducer<AppState, AppAction>>(
    appReducer,
    {
      isLoggedIn: false,
      isSuccess: false,
      successMessage: false,
      isError: false,
      errorMessage: "",
      loading: false,
      isErrorModalVisible: false,
      toggleMenu: false,
      displayFooter: false,
      displayOverlay: false,
      extendPageMaster: false,
      user: undefined,
      isCheckingAuth: true,
    }
  );

  const {
    isLoggedIn,
    isSuccess,
    successMessage,
    isError,
    errorMessage,
    loading,
    isErrorModalVisible,
    toggleMenu,
    displayFooter,
    displayOverlay,
  } = state;

  const currentPath = `${LOGIN_ROUTE}?redirect=${window.location.pathname}`;

  if (!Cookie.get("Token")) {
    window.location.href = currentPath;
  }

  useEffect(() => {
    subscription.add(
      authenticationService.checkAuth().subscribe((user: Model) => {
        if (user) return dispatch({ type: AppActionEnum.LOG_IN, user }); // if checkAuth success set login
        window.location.href = currentPath; // if checkAuth fail, return login page
      })
    );
  }, [currentPath, subscription]); // subscibe checkAuth

  useEffect(() => {
    const successSubscription: Subscription = appMessageService
      ._success()
      .subscribe(
        appMessageService.handleNotify({
          type: messageType.SUCCESS,
          title: "thanh cong",
        })
      ); // subscribe success

    const errorSubscription: Subscription = appMessageService
      ._error()
      .subscribe(
        appMessageService.handleNotify({
          type: messageType.ERROR,
          title: "that bai",
        })
      ); // subscribe error

    subscription.add(successSubscription);
    subscription.add(errorSubscription);
  }, [subscription]); // subcribe appMessageService

  const handleToggleOverlay = useCallback(() => {
    dispatch({
      type: AppActionEnum.SET_OVERLAY,
      displayOverlay: !displayOverlay,
    });
  }, [displayOverlay]); // handle turn off overlay

  const handleCloseErrorModal = useCallback(() => {
    dispatch({ type: AppActionEnum.CLOSE_ERROR_MODAL });
  }, []); // handle close error modal

  return {
    isLoggedIn,
    isSuccess,
    successMessage,
    isError,
    errorMessage,
    loading,
    isErrorModalVisible,
    toggleMenu,
    displayFooter,
    displayOverlay,
    handleToggleOverlay,
    handleCloseErrorModal,
    dispatch,
    appMessageService, // service instance
    state,
  };
}

export function useAuthorizedApp() {
  const [
    {
      permissionPaths,
      authorizedMenus,
      authorizedAction,
      authorizedMenuMapper,
    },
    dispatch,
  ] = useReducer<Reducer<AppState, AppAction>>(appReducer, {
    permissionPaths: [],
    authorizedMenus: [],
    authorizedAction: [],
    authorizedMenuMapper: null,
  });

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      dispatch({
        type: AppActionEnum.SET_PERMISSION,
        permissionPaths: [],
        authorizedMenus: [...menu],
        authorizedAction: [],
        authorizedMenuMapper: {},
      });
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    permissionPaths,
    authorizedMenus,
    authorizedMenuMapper,
    authorizedAction,
  };
}

// const mapTreeMenu = (tree: MenuItem[], mapper: Record<string, number>) => {
//   if (tree && tree.length > 0) {
//     tree.forEach((item: MenuItem) => {
//       const { path, children } = item;
//       item.isShow = false;
//       switch(item.type){
//         case 'sub':
//           if (mapper.hasOwnProperty(path as string)) item.isShow = true;
//           if (children) {
//             mapTreeMenu(children, mapper);
//           }
//           break;
//         case 'link':
//           if (mapper.hasOwnProperty(path as string)) item.isShow = true;
//           break;
//       }
//     });
//   }
// };
