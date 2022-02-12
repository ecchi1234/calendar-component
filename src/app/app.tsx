import { LoadingOutlined } from "@ant-design/icons";
import { Card, Row, Spin } from "antd";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import Modal from "antd/lib/modal/Modal";
import {
  ActionContext,
  AppMessageContext,
  AppStoreContext,
  MenuContext,
  MenuRouteContext,
  SignalRContext,
} from "app/app-context";
import useApp, { useAuthorizedApp } from "app/app-hook";
import React, { Fragment, useMemo } from "react";
import Loader from "../layout/loader";
import Header from "../layout/header";
import Sidebar from "../layout/sidebar";
import ThemeCustomize from "../layout/theme-customizer";
import { useTranslation } from "react-i18next";
import signalRService from "services/signalr-service";

function App(props) {
  const [translate] = useTranslation();
  const {
    errorMessage,
    isErrorModalVisible,
    handleCloseErrorModal,
    dispatch,
    appMessageService,
    state,
  } = useApp();

  const {
    authorizedMenus,
    authorizedAction,
    authorizedMenuMapper,
  } = useAuthorizedApp();

  const modalFooter = useMemo(
    () => (
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-sm component__btn-cancel"
          onClick={handleCloseErrorModal}
        >
          <i className="tio-clear" /> Hủy
        </button>
      </div>
    ),
    [handleCloseErrorModal]
  );

  const renderErrorModal = useMemo(
    () => (
      <Modal
        visible={isErrorModalVisible}
        onCancel={handleCloseErrorModal}
        closable={false}
        width={600}
        footer={modalFooter}
      >
        <Card>
          <Row>
            <div className="div-scroll">
              {typeof errorMessage !== "undefined" &&
                errorMessage.split("\n")?.map((err) => (
                  <div className="mt-3 mb-3 pl-2 text-danger" key={err}>
                    {err}
                  </div>
                ))}
            </div>
          </Row>
        </Card>
      </Modal>
    ),
    [errorMessage, handleCloseErrorModal, isErrorModalVisible, modalFooter]
  );

  return (
    <>
      {false ? (
        <div id="app">
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            tip={translate("pages.checking.authority")}
          />
        </div>
      ) : (
        <ErrorBoundary>
          <SignalRContext.Provider value={signalRService}>
            <AppMessageContext.Provider value={appMessageService}>
              <MenuContext.Provider value={authorizedMenus}>
                <MenuRouteContext.Provider value={authorizedMenuMapper}>
                  <ActionContext.Provider value={authorizedAction}>
                    <AppStoreContext.Provider value={[state, dispatch]}>
                      <Fragment>
                        <Loader />
                        <div
                          className="page-wrapper compact-wrapper"
                          id="pageWrapper"
                        >
                          <Header />
                          <div className="page-body-wrapper sidebar-icon">
                            <Sidebar />
                            <div className="page-body">{props.children}</div>
                            {/* <Footer/> */}
                            <ThemeCustomize />
                          </div>
                        </div>
                      </Fragment>
                      {renderErrorModal}
                    </AppStoreContext.Provider>
                  </ActionContext.Provider>
                </MenuRouteContext.Provider>
              </MenuContext.Provider>
            </AppMessageContext.Provider>
          </SignalRContext.Provider>
        </ErrorBoundary>
      )}
    </>
  );
}
export default App;
