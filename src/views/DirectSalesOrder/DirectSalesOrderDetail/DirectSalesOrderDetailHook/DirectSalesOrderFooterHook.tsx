import { commonService } from "@react3l/react3l/services/common-service";
import { AxiosError } from "axios";
import { TFunction } from "i18next";
import { DirectSalesOrder } from "models/DirectSalesOrder";

import React from "react";
import { useHistory } from "react-router";
import { directSalesOrderRepository } from "repositories/direct-sales-order-repository";
import { finalize } from "rxjs/operators";
import appMessageService from "services/app-message-service";

export function useDirectSalesOrderFooter(
  translate: TFunction,
  model?: DirectSalesOrder,
  handleUpdateNewModel?: (item: DirectSalesOrder) => void,
  handleSave?: (item: DirectSalesOrder) => void,
  handleGoBase?: () => void
) {
  const [subscription] = commonService.useSubscription();

  const [loading, setLoading] = React.useState<boolean>(false);

  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

  const history = useHistory();

  const send = React.useCallback(() => {
    setLoading(true);
    const modelValue = { ...model };
    subscription.add(
      directSalesOrderRepository
        .send(modelValue)
        .pipe(finalize(() => setLoading(false)))
        .subscribe(
          (item: DirectSalesOrder) => {
            handleUpdateNewModel(item);
            handleGoBase();
            notifyUpdateItemSuccess();
          },
          (error: AxiosError<DirectSalesOrder>) => {
            if (error.response && error.response.status === 400) {
              handleUpdateNewModel(error.response?.data);
            }
          }
        )
    );
  }, [
    handleUpdateNewModel,
    handleGoBase,
    setLoading,
    notifyUpdateItemSuccess,
    model,
    subscription,
  ]);
  const create = React.useCallback(() => {
    setLoading(true);
    const modelValue = { ...model };
    subscription.add(
      directSalesOrderRepository
        .save(modelValue)
        .pipe(finalize(() => setLoading(false)))
        .subscribe(
          (item: DirectSalesOrder) => {
            handleUpdateNewModel(item);
            history.goBack();
            notifyUpdateItemSuccess();
          },
          (error: AxiosError<DirectSalesOrder>) => {
            if (error.response && error.response.status === 400) {
              handleUpdateNewModel(error.response?.data);
            }
          }
        )
    );
  }, [
    model,
    subscription,
    handleUpdateNewModel,
    history,
    notifyUpdateItemSuccess,
  ]);

  const approve = React.useCallback(() => {
    setLoading(true);
    const modelValue = { ...model };
    subscription.add(
      directSalesOrderRepository
        .approve(modelValue)
        .pipe(finalize(() => setLoading(false)))
        .subscribe(
          (item: DirectSalesOrder) => {
            handleUpdateNewModel(item);
            history.goBack();
            notifyUpdateItemSuccess();
          },
          (error: AxiosError<DirectSalesOrder>) => {
            if (error.response && error.response.status === 400) {
              handleUpdateNewModel(error.response?.data);
            }
          }
        )
    );
  }, [
    model,
    subscription,
    handleUpdateNewModel,
    history,
    notifyUpdateItemSuccess,
  ]);

  const redo = React.useCallback(() => {
    setLoading(true);
    const modelValue = { ...model };
    subscription.add(
      directSalesOrderRepository
        .reject(modelValue)
        .pipe(finalize(() => setLoading(false)))
        .subscribe(
          (item: DirectSalesOrder) => {
            handleUpdateNewModel(item);
            history.goBack();
            notifyUpdateItemSuccess();
          },
          (error: AxiosError<DirectSalesOrder>) => {
            if (error.response && error.response.status === 400) {
              handleUpdateNewModel(error.response?.data);
            }
          }
        )
    );
  }, [
    model,
    subscription,
    handleUpdateNewModel,
    history,
    notifyUpdateItemSuccess,
  ]);

  // const print = React.useCallback(() => {
  //   setLoading(true);
  //   const modelValue = { ...model };
  //   subscription.add(
  //     directSalesOrderRepository
  //       .printDirectOrder(modelValue?.id)
  //       .pipe(finalize(() => setLoading(false)))
  //       .subscribe(
  //         () => {
  //           notifyUpdateItemSuccess();
  //         },
  //         (error: AxiosError<DirectSalesOrder>) => {
  //           if (error.response && error.response.status === 400) {
  //             handleUpdateNewModel(error.response?.data);
  //           }
  //         }
  //       )
  //   );
  // }, [model, subscription, handleUpdateNewModel, notifyUpdateItemSuccess]);

  const handlePrint = React.useCallback(() => {
    const url = document.URL;
    const urlTmp = url.split("order-hub-external/");
    window.open(
      urlTmp[0] +
        "rpc/dms-abe/web/direct-sales-order/print-direct-order?Id=" +
        model?.id
    );
  }, [model]);

  const childrenActionDetail = React.useMemo(() => {
    return (
      <>
        <button
          className="btn btn__send mr-2"
          onClick={send}
          disabled={loading ? true : false}
        >
          <span>
            <img
              src={require("assets/images/icon/send.svg")}
              alt="save"
              width={"20px"}
              height={"20px"}
              className={"mr-2"}
            />
            {translate("general.button.send")}
          </span>
        </button>

        <button className="btn btn__save mr-2" onClick={create}>
          <span>
            <img
              src={require("assets/images/icon/direct.svg")}
              alt="save"
              width={"20px"}
              height={"20px"}
              className={"mr-2"}
            />
            {translate("general.button.save")}
          </span>
        </button>

        <button className="btn btn__save mr-2" onClick={handleGoBase}>
          <span>
            <img
              src={require("assets/images/icon/close-circle.svg")}
              alt="save"
              width={"20px"}
              height={"20px"}
              className={"mr-2"}
            />
            {translate("general.button.close")}
          </span>
        </button>
      </>
    );
  }, [send, loading, translate, create, handleGoBase]);

  const childrenActionPreview = React.useMemo(() => {
    return (
      <>
        <button className="btn btn__save mr-2" onClick={handlePrint}>
          <span>
            <img
              src={require("assets/images/icon/printer.svg")}
              alt="save"
              width={"20px"}
              height={"20px"}
              className={"mr-2"}
            />
            {translate("general.button.print")}
          </span>
        </button>

        <button className="btn btn__save mr-2" onClick={handleGoBase}>
          <span>
            <img
              src={require("assets/images/icon/close-circle.svg")}
              alt="save"
              width={"20px"}
              height={"20px"}
              className={"mr-2"}
            />
            {translate("general.button.close")}
          </span>
        </button>
      </>
    );
  }, [handlePrint, translate, handleGoBase]);

  const childrenActionApprove = React.useMemo(() => {
    return (
      <>
        <button
          className="btn btn__approve mr-2"
          onClick={approve}
          disabled={loading ? true : false}
        >
          <span>
            <img
              src={require("assets/images/icon/tick-square.svg")}
              alt="save"
              width={"20px"}
              height={"20px"}
              className={"mr-2"}
            />
            {translate("general.button.approve")}
          </span>
        </button>
        <button
          className="btn btn__redo mr-2"
          onClick={redo}
          disabled={loading ? true : false}
        >
          <span>
            <img
              src={require("assets/images/icon/back-square.svg")}
              alt="save"
              width={"20px"}
              height={"20px"}
              className={"mr-2"}
            />
            {translate("general.button.reject")}
          </span>
        </button>

        <button className="btn btn__save mr-2" onClick={handleGoBase}>
          <span>
            <img
              src={require("assets/images/icon/close-circle.svg")}
              alt="save"
              width={"20px"}
              height={"20px"}
              className={"mr-2"}
            />
            {translate("general.button.close")}
          </span>
        </button>
      </>
    );
  }, [approve, loading, translate, redo, handleGoBase]);

  return {
    childrenActionDetail,
    childrenActionPreview,
    childrenActionApprove,
    loading,
  };
}
