/* begin general import */
import React, { useMemo } from "react";
import {
  Col,
  Row,
  Tooltip,
  Menu as MenuAntd,
  Dropdown,
  Card,
  Button,
} from "antd";
import Table, { ColumnProps } from "antd/lib/table";
// import { renderMasterIndex } from "helpers/table";
import { useTranslation } from "react-i18next";
import masterService from "services/pages/master-service";
// import { getAntOrderType } from "services/table-service";
import nameof from "ts-nameof.macro";
import { DownOutlined } from "@ant-design/icons";
import { CSSTransition } from "react-transition-group";
import InputSearch from "components/Utility/InputSearch/InputSearch";
import Pagination from "components/Utility/Pagination/Pagination";
// import BrandPreview from "./BrandPreview";
import classNames from "classnames";
/* end general import */

/* begin filter import */
// import AdvanceStringFilter from "components/Utility/AdvanceFilter/AdvanceStringFilter/AdvanceStringFilter";
import { NumberFilter, StringFilter } from "@react3l/advanced-filters";
import AdvanceIdFilter from "components/Utility/AdvanceFilter/AdvanceIdFilter/AdvanceIdFilter";
import { IdFilter } from "@react3l/advanced-filters";
import { advanceFilterService } from "services/advance-filter-service";
/* end filter import */

/* begin individual import */
import { directSalesOrderRepository } from "repositories/direct-sales-order-repository";
import {
  DirectSalesOrder,
  DirectSalesOrderFilter,
} from "models/DirectSalesOrder";
import { StatusFilter } from "models/Status";
// import BrandDetailModal from "../BrandDetail/BrandDetailModal";
// import detailService from "services/pages/detail-service";
import { formatDate } from "helpers/date-time";
import { Moment } from "moment";
import { formatNumber } from "helpers/number";
import { RequestState } from "models/RequestState";
import AdvanceDateRangeFilter from "components/Utility/AdvanceFilter/AdvanceDateRangeFilter/AdvanceDateRangeFilter";
import AdvanceNumberRangeFilter from "components/Utility/AdvanceFilter/AdvanceNumberRangeFilter/AdvanceNumberRangeFilter";
import { DIRECT_SALES_ORDER_ROUTE } from "config/route-consts";
import "./DirectSalesOrderMaster.scss";

/* end individual import */

function DirectSalesOrderMaster() {
  const [translate] = useTranslation();

  const classDirectSalesOrderState = React.useMemo(() => {
    return (directSalesOrderStatusId) => {
      switch (directSalesOrderStatusId) {
        case 2: {
          return "pending-state";
        }
        case 3: {
          return "cancel-state";
        }
        case 4: {
          return "completed-state";
        }
        case 5: {
          return "pending-state";
        }
        case 7: {
          return "completed-state";
        }
        case 6: {
          return "cancel-state";
        }
        case 8: {
          return "draft-state";
        }
      }
    };
  }, []);

  const {
    list,
    total,
    loadingList,
    filter,
    toggle,
    handleChangeFilter,
    handleResetFilter,
    handleToggleSearch,
    handleTableChange,
    handlePagination,
    handleServerDelete,
    // handleServerBulkDelete,
    // handleSearch,
    // handleImportList,
    handleListExport,
    // handleExportTemplateList,
    // importButtonRef,
    // rowSelection,
    // canBulkDelete,
    // pagination,
    handleUpdateNewFilter,
    handleGoCreate,
    handleGoDetail,
    handleGoPreview,
    handleGoApproval,
    dispatch,
  } = masterService.useMaster<DirectSalesOrder, DirectSalesOrderFilter>(
    DirectSalesOrderFilter,
    DIRECT_SALES_ORDER_ROUTE,
    directSalesOrderRepository.list,
    directSalesOrderRepository.count,
    directSalesOrderRepository.delete,
    directSalesOrderRepository.bulkDelete
  );

  // const {
  //   isOpenPreview,
  //   isLoadingPreview,
  //   previewModel,
  //   handleOpenPreview,
  //   handleClosePreview,
  // } = masterService.usePreview<DirectSalesOrder>(
  //   DirectSalesOrder,
  //   directSalesOrderRepository.get
  // );

  const [dropdown, setDropdown] = React.useState<boolean>(false);

  const handleDropdown = React.useCallback(() => {
    setDropdown(!dropdown);
  }, [dropdown]);

  const [numberRange] = advanceFilterService.useNumberRangeFilter(
    filter,
    dispatch,
    "total"
  );

  const menuFilter = React.useMemo(
    () => (
      <MenuAntd>
        <MenuAntd.Item key="3">
          <Tooltip title={translate("general.button.exportExcel")}>
            <button
              className="btn border-less gradient-btn-icon grow-animate-2"
              onClick={handleListExport(
                filter,
                directSalesOrderRepository.export
              )}
            >
              <i className="tio-file_outlined" />
            </button>
          </Tooltip>
        </MenuAntd.Item>
      </MenuAntd>
    ),
    [translate, handleListExport, filter]
  );

  const menuAction = React.useCallback(
    (id: number, directSalesOrder: DirectSalesOrder) => (
      <MenuAntd>
        <MenuAntd.Item key="1">
          <Tooltip title={translate("general.actions.view")}>
            <div className="ant-action-menu" onClick={handleGoPreview(id)}>
              {translate("general.actions.view")}
            </div>
          </Tooltip>
        </MenuAntd.Item>
        {(directSalesOrder?.generalApprovalStateId === 8 ||
          directSalesOrder?.generalApprovalStateId === 6 ||
          directSalesOrder?.generalApprovalStateId === 5 ||
          directSalesOrder?.generalApprovalStateId === 3 ||
          directSalesOrder?.generalApprovalStateId === 2) && (
          <MenuAntd.Item key="2">
            <Tooltip title={translate("general.actions.edit")}>
              <div className="ant-action-menu" onClick={handleGoDetail(id)}>
                {translate("general.actions.edit")}
              </div>
            </Tooltip>
          </MenuAntd.Item>
        )}

        {directSalesOrder?.generalApprovalStateId === 8 && (
          <MenuAntd.Item key="3">
            <Tooltip title={translate("general.actions.delete")}>
              <div
                className="ant-action-menu"
                onClick={() => handleServerDelete(directSalesOrder)}
              >
                {translate("general.actions.delete")}
              </div>
            </Tooltip>
          </MenuAntd.Item>
        )}

        {directSalesOrder?.generalApprovalStateId === 5 && (
          <MenuAntd.Item key="3">
            <Tooltip title={translate("general.actions.approve")}>
              <div
                className="ant-action-menu"
                onClick={handleGoApproval(directSalesOrder.id)}
              >
                {translate("general.actions.approve")}
              </div>
            </Tooltip>
          </MenuAntd.Item>
        )}
      </MenuAntd>
    ),
    [
      handleGoApproval,
      handleGoDetail,
      handleGoPreview,
      handleServerDelete,
      translate,
    ]
  );

  const handleChangeDateFilter = React.useCallback(
    (fieldName) => {
      return (dateMoment: [Moment, Moment]) => {
        const newFilter = { ...filter };
        newFilter[`${fieldName}`]["lessEqual"] = dateMoment[1];
        newFilter[`${fieldName}`]["greaterEqual"] = dateMoment[0];
        handleUpdateNewFilter(newFilter);
      };
    },
    [filter, handleUpdateNewFilter]
  );

  const columns: ColumnProps<DirectSalesOrder>[] = useMemo(
    () => [
      {
        title: (
          <div className="gradient-text">
            {translate("directSalesOrder.code")}
          </div>
        ),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        width: 150,
        align: "left",
        render(code: string, internalOrder: DirectSalesOrder) {
          return (
            <div className="ant-cell-master__container">
              <div
                className={classNames(
                  "cell-master__first-row",
                  "first-row--link",
                  {
                    "first-row--ellipsis": code && code.length >= 30,
                  }
                )}
              >
                {
                  <span onClick={handleGoPreview(internalOrder.id)}>
                    {code}
                  </span>
                }
              </div>
            </div>
          );
        },
      },

      {
        title: (
          <div className="gradient-text">
            {translate("directSalesOrder.orderDate")}
          </div>
        ),
        key: nameof(list[0].orderDate),
        dataIndex: nameof(list[0].orderDate),

        render(orderDate: Moment) {
          return formatDate(orderDate); //fill the render field after generate code;
        },
        align: "left",
      },

      {
        title: (
          <div className="gradient-text">
            {translate("directSalesOrder.deliveryDate")}
          </div>
        ),
        key: nameof(list[0].deliveryDate),
        dataIndex: nameof(list[0].deliveryDate),
        render(deliveryDate: Moment) {
          return deliveryDate ? formatDate(deliveryDate) : "Chưa có"; //fill the render field after generate code;
        },
        align: "left",
      },

      {
        title: (
          <div className="gradient-text">
            {translate("directSalesOrder.deliveryAddress")}
          </div>
        ),
        width: 250,
        key: nameof(list[0].deliveryAddress),
        dataIndex: nameof(list[0].deliveryAddress),
        align: "left",
        render(deliveryAddress: string) {
          return (
            <Tooltip title={deliveryAddress}>
              <div
                className={classNames("cell-master__first-row", {
                  "first-row--ellipsis":
                    deliveryAddress && deliveryAddress.length >= 30,
                })}
              >
                {deliveryAddress ? deliveryAddress : "Chưa có"}
              </div>
            </Tooltip>
          );
        },
      },

      {
        title: (
          <div className="gradient-text">
            {translate("directSalesOrder.total")}
          </div>
        ),
        key: nameof(list[0].total),
        dataIndex: nameof(list[0].total),
        render(total: number) {
          return formatNumber(total);
        },
        align: "right",
      },

      {
        title: (
          <div className="gradient-text">
            {translate("directSalesOrder.status")}
          </div>
        ),
        key: nameof(list[0].generalApprovalState),
        dataIndex: nameof(list[0].generalApprovalState),
        render(generalApprovalState: RequestState) {
          return (
            <div
              className={classDirectSalesOrderState(generalApprovalState?.id)}
            >
              {generalApprovalState?.name}
            </div>
          ); //fill the render field after generate code;
        },
        align: "left",
      },

      {
        title: (
          <div className="text-center gradient-text">
            {translate("general.actions.label")}
          </div>
        ),
        key: "action",
        dataIndex: nameof(list[0].id),
        fixed: "right",
        width: 150,
        align: "center",
        render(id: number, brand: DirectSalesOrder) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, brand)}
                trigger={["click"]}
                placement="bottomCenter"
                arrow
              >
                <span className="action__dots">...</span>
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [translate, list, handleGoPreview, classDirectSalesOrderState, menuAction]
  );

  return (
    <>
      <div className="page page__master direct-sales-order-master">
        <div className="page__header d-flex align-items-center justify-content-between">
          <div className="page__title">
            {translate("directSalesOrder.master.title")}
          </div>
        </div>
        <div className="page__search">
          <Card bordered={false}>
            <div className="d-flex align-items-center">
              <div className="d-flex flex-grow-1">
                <div className="pr-4 w70">
                  <InputSearch
                    value={filter[nameof(list[0].code)]["contain"]}
                    onChange={handleChangeFilter(
                      nameof(list[0].code),
                      "contain" as any,
                      StringFilter
                    )}
                    placeHolder={translate("directSalesOrder.placeholder.code")}
                  />
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
                  <Dropdown overlay={menuFilter} trigger={["click"]}>
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
            <CSSTransition
              in={toggle}
              timeout={100}
              classNames={"show"}
              unmountOnExit
            >
              <Row className="mt-4 search__container">
                <Col lg={4} className={"pr-4"}>
                  <AdvanceDateRangeFilter
                    title={translate("directSalesOrder.orderDate")}
                    onChange={handleChangeDateFilter(nameof(filter.orderDate))}
                    value={[
                      filter["orderDate"]["lessEqual"]
                        ? filter["orderDate"]["lessEqual"]
                        : null,
                      filter["orderDate"]["greaterEqual"]
                        ? filter["orderDate"]["greaterEqual"]
                        : null,
                    ]}
                    isMaterial={true}
                  />
                </Col>

                <Col lg={4} className={"pr-4"}>
                  <AdvanceDateRangeFilter
                    title={translate("directSalesOrder.deliveryDate")}
                    onChange={handleChangeDateFilter(
                      nameof(filter.deliveryDate)
                    )}
                    value={[
                      filter["deliveryDate"]["lessEqual"]
                        ? filter["deliveryDate"]["lessEqual"]
                        : null,
                      filter["deliveryDate"]["greaterEqual"]
                        ? filter["deliveryDate"]["greaterEqual"]
                        : null,
                    ]}
                    isMaterial={true}
                  />
                </Col>

                <Col lg={4} className={"pr-4"}>
                  <AdvanceNumberRangeFilter
                    title={translate("directSalesOrder.totalRange")}
                    onChangeRange={handleChangeFilter(
                      nameof(list[0].total),
                      null,
                      NumberFilter
                    )}
                    valueRange={numberRange}
                    placeHolderRange={["Từ...", "Đến..."]}
                    decimalDigit={2}
                    numberType="DECIMAL"
                    isMaterial={true}
                  />
                </Col>

                <Col lg={4} className="pr-4">
                  <AdvanceIdFilter
                    title={translate("directSalesOrder.requestState")}
                    value={
                      filter[nameof(list[0].generalApprovalStateId)]["equal"]
                    }
                    onChange={handleChangeFilter(
                      nameof(list[0].generalApprovalStateId),
                      "equal" as any,
                      IdFilter
                    )}
                    classFilter={StatusFilter}
                    getList={
                      directSalesOrderRepository.filterListGeneralApprovalState
                    }
                    placeHolder={translate(
                      "directSalesOrder.placeholder.requestState"
                    )}
                    isMaterial={true}
                  />
                </Col>
              </Row>
            </CSSTransition>
          </Card>
        </div>
        <div className="page__master-table custom-scrollbar">
          <Card bordered={false}>
            <Table
              rowKey={nameof(list[0].id)}
              columns={columns}
              pagination={false}
              dataSource={list}
              loading={loadingList}
              onChange={handleTableChange}
              // rowSelection={rowSelection}
              scroll={{ y: 500, x: "max-content" }}
              title={() => (
                <>
                  <div className="d-flex justify-content-end">
                    <div className="flex-shrink-1 d-flex align-items-center">
                      <Pagination
                        skip={filter.skip}
                        take={filter.take}
                        total={total}
                        onChange={handlePagination}
                        style={{ margin: "10px" }}
                      />
                    </div>
                  </div>
                </>
              )}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

export default DirectSalesOrderMaster;
