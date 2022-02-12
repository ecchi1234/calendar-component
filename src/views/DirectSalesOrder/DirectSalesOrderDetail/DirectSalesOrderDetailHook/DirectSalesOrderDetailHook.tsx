import { Model } from "@react3l/react3l/core";
import { commonService } from "@react3l/react3l/services";
import { AxiosError } from "axios";
import { useCallback, useMemo, useState } from "react";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import appMessageService from "services/app-message-service";
import { formService } from "services/form-service";
import { queryStringService } from "services/query-string-service";
import { routerService } from "services/route-service";

export function useDetail<T extends Model>(
  ModelClass: new () => T,
  getDetail: (id: number) => Observable<T>,
  saveModel: (t: T) => Observable<T>,
  routePrefix: string,
  initData?: T
) {
  // get id from url
  const { id }: any = queryStringService.useGetQueryString("id");
  // navigating master when update or create successfully
  const [, , , handleGoBase] = routerService.useMasterNavigation(
    routePrefix // master route
  );
  // message service
  const {
    notifyUpdateItemSuccess,
    notifyUpdateItemError,
  } = appMessageService.useCRUDMessage();
  // subscription service for clearing subscription
  const [subscription] = commonService.useSubscription();

  const isDetail = useMemo(() => {
    return id?.toString().match(/^[0-9]+$/) ? true : false;
  }, [id]);

  const [loading, setLoading] = useState<boolean>(false);

  const [
    model,
    handleChangeSimpleField,
    handleChangeObjectField,
    handleUpdateNewModel, // alternate for setModel
    handleChangeTreeObjectField,
    handleChangeTreeListField,
    dispatch,
    handleChangeMappingField,
  ] = formService.useDetailForm<T>(
    ModelClass,
    parseInt(id),
    getDetail,
    initData
  );

  const handleSave = useCallback(
    (onSaveSuccess?: (item: T) => void, onSaveError?: (item: T) => void) => {
      return () => {
        setLoading(true);
        subscription.add(
          saveModel(model)
            .pipe(finalize(() => setLoading(false)))
            .subscribe(
              (item: T) => {
                handleUpdateNewModel(item); // setModel
                handleGoBase(); // go master
                notifyUpdateItemSuccess(); // global message service go here
                if (typeof onSaveSuccess === "function") {
                  onSaveSuccess(item); // trigger custom effect when updating success
                }
              },
              (error: AxiosError<T>) => {
                if (error.response && error.response.status === 400) {
                  handleUpdateNewModel(error.response?.data); // setModel for catching error
                }
                notifyUpdateItemError(); // global message service go here
                if (typeof onSaveError === "function") {
                  onSaveError(error.response?.data); // trigger custom effect when updating success
                }
              }
            )
        );
      };
    },
    [
      handleGoBase,
      handleUpdateNewModel,
      model,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      saveModel,
      subscription,
    ]
  );

  return {
    model,
    isDetail,
    handleChangeSimpleField,
    handleChangeObjectField,
    handleChangeMappingField,
    handleUpdateNewModel,
    handleChangeTreeObjectField,
    handleChangeTreeListField,
    loading,
    handleGoBase,
    handleSave,
    dispatch,
  };
}
