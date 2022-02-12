import { Card, Menu, Dropdown, Button, Tooltip } from "antd";
import InputSearch from "components/Utility/InputSearch/InputSearch";
import { TFunction } from "i18next";
import { Animate } from "react-show";
import React, { ReactNode } from "react";
import { UseMaster } from "services/pages/master-service";
import classNames from "classnames";
import { DownOutlined } from "@ant-design/icons";

export interface AppMainMasterFilterProps extends UseMaster {
  translate: TFunction;
  children: ReactNode;
  repository: any;
}

export function AppMainMasterFilter(props: AppMainMasterFilterProps) {
  const {
    toggle,
    importButtonRef,
    filter,
    repository,
    translate,
    handleToggleSearch,
    handleResetFilter,
    handleGoCreate,
    handleListExport,
    handleImportList,
    handleExportTemplateList,
    children,
  } = props;

  const [dropdown, setDropdown] = React.useState<boolean>(false);

  const handleDropdown = React.useCallback(() => {
    setDropdown(!dropdown);
  }, [dropdown]);

  const menu = React.useMemo(() => (
    <Menu>
      <Menu.Item key="2">
        <Tooltip title={translate("general.button.importExcel")}>
          <>
            <input
              ref={importButtonRef}
              type="file"
              style={{ display: "none" }}
              id="master-import"
              onChange={handleImportList(repository.import)}
            />
            <button
              className="btn border-less gradient-btn-icon grow-animate-2"
              onClick={() => {
                importButtonRef.current.click();
              }}
            >
              <i className="tio-file_add_outlined" />
            </button>
          </>
        </Tooltip>
      </Menu.Item>
      <Menu.Item key="3">
        <Tooltip title={translate("general.button.exportExcel")}>
          <button
            className="btn border-less gradient-btn-icon grow-animate-2"
            onClick={handleListExport(filter, repository.export)}
          >
            <i className="tio-file_outlined" />
          </button>
        </Tooltip>
      </Menu.Item>
      <Menu.Item key="4">
        <Tooltip title={translate("general.button.downloadTemplate")}>
          <button
            className="btn border-less gradient-btn-icon grow-animate-2"
            onClick={handleExportTemplateList(repository.exportTemplate)}
          >
            <i className="tio-download_to" />
          </button>
        </Tooltip>
      </Menu.Item>
    </Menu>
  ), [translate, importButtonRef, handleImportList, repository.import, repository.export, repository.exportTemplate, handleListExport, filter, handleExportTemplateList]);

  return (
    <>
      <div className="page__search">
        <Card bordered={false}>
          <div className="d-flex align-items-center">
            <div className="d-flex flex-grow-1">
              <div className="pr-4 w70">
                <InputSearch />
              </div>

              <button
                className={classNames(
                  "btn component__btn-toggle mr-3 grow-animate-1",
                  toggle === true ? "component__btn-toggle-active" : ""
                )}
                onClick={handleToggleSearch}
              >
                <i className="tio-tune_horizontal"></i>
                <span className="component_btn-text">
                  {translate("general.button.advance")}
                </span>
              </button>

              <button
                className="btn component__btn-toggle grow-animate-1 reset-filter"
                onClick={handleResetFilter}
              >
                <i className="tio-restore reset-icon"></i>
                <span className="component_btn-text reset-label">
                  {translate("general.button.reset")}
                </span>
              </button>
            </div>

            <div className="d-flex justify-content-around ml-4">
              <button
                className="btn component__btn-toggle grow-animate-1"
                onClick={handleGoCreate}
              >
                <i className="tio-add"></i>
                <span className="component_btn-text">
                  {translate("general.actions.create")}
                </span>
              </button>
              <div className="table__action">
                <Dropdown overlay={menu} trigger={["click"]}>
                  <Button onClick={handleDropdown}>
                    <span className="component_btn-text">
                      {translate("general.actions.action")}
                    </span>
                    <DownOutlined className={dropdown ? "dropdown" : null} />
                  </Button>
                </Dropdown>
              </div>
            </div>
          </div>
          <Animate
            show={toggle}
            duration={500}
            style={{ height: "auto" }}
            transitionOnMount={true}
            start={{ height: 0 }}
            leave={{ opacity: 0, height: 0 }}
          >
            {children}
          </Animate>
        </Card>
      </div>
    </>
  );
}
