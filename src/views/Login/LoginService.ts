import { finalize } from "rxjs/operators";
import { ROOT_ROUTE } from "./../../config/route-consts";
import { AxiosError } from "axios";
import { AppUser } from "models/AppUser/AppUser";
import * as Cookie from "js-cookie";
import { ChangeEvent, useCallback, useReducer, Reducer } from "react";
import authenticationService from "services/authentication-service";
import { AppAction, AppActionEnum, appReducer, AppState } from "app/app-store";
import { getParameterByName } from "helpers/query";
export default function useLogin(
  appUser,
  setAppUser,
  setErrorMessageUsername,
  setErrorMessagePass,
  setErrorMessageStatus
): [
  () => void,
  (field: string) => (ev: any) => void,
  (ev: React.KeyboardEvent<HTMLInputElement>) => void,
  boolean
] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleLogin = useCallback(() => {
    // setLoading(true);
    dispatch({ type: AppActionEnum.START_LOGIN });

    authenticationService
      .login(appUser)
      .pipe(finalize(() => dispatch({ type: AppActionEnum.END_LOGIN })))
      .subscribe(
        (user: AppUser) => {
          dispatch({ type: AppActionEnum.LOG_IN, user });
          Cookie.set("Token", user.token);
          const redirect =
            getParameterByName("redirect") === null
              ? ROOT_ROUTE
              : getParameterByName("redirect");

          window.location.href = `${redirect}/`;
        },
        (error: AxiosError<AppUser>) => {
          if (error.response && error.response.status === 400) {
            const { username, password, status } = error.response.data?.errors;
            if (typeof username !== "undefined")
              setErrorMessageUsername(username);
            if (typeof password !== "undefined") setErrorMessagePass(password);
            if (typeof status !== "undefined") setErrorMessageStatus(status);
          }
        }
      );
  }, [
    appUser,
    setErrorMessagePass,
    setErrorMessageStatus,
    setErrorMessageUsername,
  ]);

  const handleSetValue = useCallback(
    (field: string, value?: string | number | boolean | null) => {
      setAppUser({
        ...appUser,
        [field]: value,
        errors: undefined,
      });
      setErrorMessagePass(null);
      setErrorMessageUsername(null);
    },
    [appUser, setAppUser, setErrorMessagePass, setErrorMessageUsername]
  );

  const handleChangeField = useCallback(
    (field: string) => {
      return (ev: ChangeEvent<HTMLInputElement>) => {
        if (typeof ev === "object" && ev !== null) {
          if ("target" in ev) {
            return handleSetValue(field, ev.target.value);
          }
        }
      };
    },
    [handleSetValue]
  );

  const handleEnter = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      if (ev.key === "Enter") {
        handleLogin();
      }
    },
    [handleLogin]
  );

  return [handleLogin, handleChangeField, handleEnter, state.loading];
}
