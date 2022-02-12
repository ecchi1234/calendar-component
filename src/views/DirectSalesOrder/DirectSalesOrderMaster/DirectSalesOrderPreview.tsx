import { Card, Col, Descriptions, Divider, Row, Tooltip } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { DIRECT_SALES_ORDER_ROUTE } from "config/route-consts";
import { formatDate } from "helpers/date-time";
import React from "react";
import { useTranslation } from "react-i18next";
import { commonWebService } from "services/common-web-service";
import { routerService } from "services/route-service";
import nameof from "ts-nameof.macro";
import detailService from "services/pages/detail-service";
import { DirectSalesOrder } from "models/DirectSalesOrder";
import { directSalesOrderRepository } from "repositories/direct-sales-order-repository";
import { DirectSalesOrderContent } from "models/DirectSalesOrderContent";
import AppFooter from "components/AppFooter/AppFooter";
import { formatNumber } from "helpers/number";
import "./DirectSalesOrderMaster.scss";
import { useDirectSalesOrderFooter } from "../DirectSalesOrderDetail/DirectSalesOrderDetailHook/DirectSalesOrderFooterHook";

function DirectSalesOrderPreview() {
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

  const [, , , handleGoBase] = routerService.useMasterNavigation(
    DIRECT_SALES_ORDER_ROUTE
  );

  const { model } = detailService.useDetail<DirectSalesOrder>(
    DirectSalesOrder,
    directSalesOrderRepository.get,
    directSalesOrderRepository.save,
    DIRECT_SALES_ORDER_ROUTE
  );
  const [list, setList] = React.useState<DirectSalesOrderContent[]>();
  React.useEffect(() => {
    if (
      model &&
      (model?.directSalesOrderContents?.length > 0 ||
        model?.directSalesOrderPromotions?.length > 0)
    ) {
      setList([
        ...model?.directSalesOrderContents.concat(
          model?.directSalesOrderPromotions
        ),
      ]);
    }
  }, [setList, model]);

  const { childrenActionPreview } = useDirectSalesOrderFooter(
    translate,
    model,
    null,
    null,
    handleGoBase
  );

  const storeOrderContentColumns: ColumnProps<
    DirectSalesOrderContent
  >[] = React.useMemo(() => {
    return [
      {
        title: (
          <div className="text-left gradient-text">
            {translate("directSalesOrder.directSalesOrderContent.item")}
          </div>
        ),
        key: nameof(list[0].id),
        width: 200,
        dataIndex: nameof(list[0].id),
        align: "left",
        render: (...params: [number, DirectSalesOrderContent, number]) => {
          return (
            <div className="item-container d-flex">
              {params[1]?.item?.images !== null &&
              params[1]?.item?.images !== undefined &&
              params[1]?.item?.images[0]?.url ? (
                <img
                  src={params[1]?.item?.images[0]?.url}
                  alt=""
                  width={50}
                  height={50}
                />
              ) : (
                <img
                  alt=""
                  src={require("assets/images/box-image.svg")}
                  width={50}
                  height={50}
                />
              )}
              <div className="table-cell__container table-cell__item ml-2">
                <div className="item-code__text">
                  <Tooltip title={params[1]?.item?.name}>
                    <span className="item-code__text">
                      {commonWebService.limitWord(params[1]?.item?.name, 30)}
                    </span>
                  </Tooltip>
                </div>
                <div className="item-name__text">
                  <Tooltip title={params[1]?.item?.code}>
                    <span className="check_inventory-text">
                      {commonWebService.limitWord(params[1]?.item?.code, 15)}
                    </span>
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: (
          <div className="text-left gradient-text">
            {translate(
              "directSalesOrder.directSalesOrderContent.unitOfMeasure"
            )}
          </div>
        ),
        align: "left",
        key: nameof(list[0].unitOfMeasureId),
        dataIndex: nameof(list[0].unitOfMeasureId),
        render: (...params: [number, DirectSalesOrderContent, number]) => {
          return (
            <div className="table-cell__container">
              <span className="cell-number">
                <Tooltip title={params[1]?.unitOfMeasure?.name}>
                  <span className="item-code__text">
                    {commonWebService.limitWord(
                      params[1]?.unitOfMeasure?.name,
                      10
                    )}
                  </span>
                </Tooltip>
              </span>
            </div>
          );
        },
      },
      {
        title: (
          <div className="gradient-text">
            {translate("directSalesOrder.directSalesOrderContent.quantity")}
          </div>
        ),
        align: "right",
        key: nameof(list[0].quantity),
        dataIndex: nameof(list[0].quantity),
        render: (...params: [number, DirectSalesOrderContent, number]) => {
          return (
            <div className="table-cell__container">
              <span className="cell-number">{params[1]?.quantity}</span>
            </div>
          );
        },
      },
      {
        title: (
          <div className="text-right gradient-text">
            {translate("directSalesOrder.directSalesOrderContent.salePrice")}
          </div>
        ),
        align: "right",
        key: nameof(list[0].salePrice),
        dataIndex: nameof(list[0].salePrice),
        render: (...params: [number, DirectSalesOrderContent, number]) => {
          return (
            <div className="table-cell__container">
              <span className="cell-number">
                {formatNumber(params[1]?.salePrice)}
              </span>
            </div>
          );
        },
      },
      {
        title: (
          <div className="text-right gradient-text">
            {translate(
              "directSalesOrder.directSalesOrderContent.discountPercent"
            )}
          </div>
        ),
        align: "right",
        key: nameof(list[0].discountAmount),
        dataIndex: nameof(list[0].discountAmount),
        render: (...params: [number, DirectSalesOrderContent, number]) => {
          return (
            <div className="table-cell__container">
              <span className="cell-number">
                {params[1]?.discountAmount !== 0 &&
                params[1]?.discountAmount !== null &&
                params[1]?.discountAmount !== undefined
                  ? formatNumber(params[1]?.discountAmount)
                  : "----"}
              </span>
            </div>
          );
        },
      },
      {
        title: (
          <div className="text-right gradient-text">
            {translate("directSalesOrder.directSalesOrderContent.amount")}
          </div>
        ),
        align: "right",
        key: nameof(list[0].amount),
        dataIndex: nameof(list[0].amount),
        render: (...params: [number, DirectSalesOrderContent, number]) => {
          return (
            <div className="table-cell__container">
              <div className="result-cell">
                <span className="cell-number">
                  {formatNumber(params[1]?.amount)}
                </span>
              </div>
            </div>
          );
        },
      },
    ];
  }, [list, translate]);

  return (
    <>
      <div className="page page__detail page__detail--approve purchase-request-plan__approve direct-sales-order-preview">
        <div className="w-100 page__detail-tabs">
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
          >
            <Col lg={18} className="gutter-row">
              <Card
                title={"Thông tin sản phẩm"}
                headStyle={{ fontWeight: "bold" }}
                className="mt-4"
              >
                <Table
                  rowKey={nameof(model.StoreOrderContents[0].id)}
                  pagination={false}
                  dataSource={list}
                  columns={storeOrderContentColumns}
                  scroll={{ y: 400 }}
                ></Table>
                <Divider />
                <Descriptions column={1}>
                  <Descriptions.Item
                    label={translate("directSalesOrder.subTotal")}
                    className="float-right"
                  >
                    <span className="store-sales-order__description">
                      {model?.subTotal !== null && model?.subTotal !== undefined
                        ? formatNumber(model?.subTotal) + " VNĐ"
                        : 0 + " VNĐ"}{" "}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    className="float-right"
                    label={translate("directSalesOrder.generalDiscountAmount")}
                  >
                    <span className="store-sales-order__description">
                      {model?.generalDiscountAmount !== null &&
                      model?.generalDiscountAmount !== undefined
                        ? formatNumber(model?.generalDiscountAmount) + " VNĐ"
                        : 0 + " VNĐ"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    className="float-right"
                    label={translate("directSalesOrder.totalTaxAmount")}
                  >
                    <span className="store-sales-order__description">
                      {model?.totalTaxAmount !== null &&
                      model?.totalTaxAmount !== undefined
                        ? formatNumber(model?.totalTaxAmount) + " VNĐ"
                        : 0 + " VNĐ"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    className="float-right bold-title"
                    label={translate("directSalesOrder.total")}
                    style={{ fontWeight: 600 }}
                  >
                    <span className="store-sales-order__description">
                      {model?.total !== null && model?.total !== undefined
                        ? formatNumber(model?.total) + " VNĐ"
                        : 0 + " VNĐ"}
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col lg={6} className="gutter-row">
              <Card
                title={"Thông tin chung"}
                headStyle={{ fontWeight: "bold" }}
                className="mt-4"
              >
                <Row justify="space-between" className="mt-2">
                  <span className="h5 font-weight-bold">{model.code}</span>
                </Row>

                <Row justify="space-between" className="mt-2">
                  <div className="general-field__container">
                    <div className="general-field__first-row">
                      <span>{translate("directSalesOrder.deliveryDate")}</span>
                    </div>
                    <div className="general-field__second-row mt-1">
                      <span>
                        {model.deliveryDate === null
                          ? "Chưa có"
                          : formatDate(model.deliveryDate)}
                      </span>
                    </div>
                  </div>
                </Row>

                <Divider dashed />

                {/* <Row justify="space-between" className="mt-2">
                  <div className="general-field__container">
                    <div className="general-field__first-row">
                      <span>{translate("directSalesOrder.buyerStore")}</span>
                    </div>
                    <div className="general-field__second-row mt-1">
                      <span>{model?.buyerStore?.name}</span>
                    </div>
                  </div>
                </Row>

                <Row justify="space-between" className="mt-2">
                  <div className="general-field__container ">
                    <div className="general-field__first-row">
                      <span>{translate("directSalesOrder.orderDate")}</span>
                    </div>
                    <div className="general-field__second-row mt-1">
                      <span>{formatDate(model.orderDate)}</span>
                    </div>
                  </div>
                </Row> */}

                <Row justify="space-between" className="mt-2">
                  <div className="general-field__container">
                    <div className="general-field__first-row">
                      <span>
                        {translate("directSalesOrder.deliveryAddress")}
                      </span>
                    </div>
                    <div className="general-field__second-row mt-1">
                      <span>
                        {model.deliveryAddress === null
                          ? "Chưa có"
                          : model.deliveryAddress}
                      </span>
                    </div>
                  </div>
                </Row>

                <Row justify="space-between" className="mt-2">
                  <div className="general-field__container">
                    <div className="general-field__first-row">
                      <span>{translate("directSalesOrder.saleEmployee")}</span>
                    </div>
                    <div className="general-field__second-row mt-1">
                      <img
                        src={
                          model.saleEmployee?.avatar === null
                            ? require("assets/images/dashboard/profile.jpg")
                            : model.saleEmployee?.avatar
                        }
                        className="general-field__circle-image"
                        alt="IMG"
                      />
                      <span>{model.saleEmployee?.displayName}</span>
                    </div>
                  </div>
                </Row>

                <Row justify="space-between" className="mt-3">
                  <div className="general-field__container">
                    <div className="general-field__first-row">
                      <span>{translate("directSalesOrder.status")}</span>
                    </div>
                    <div className="general-field__second-row mt-1">
                      <div
                        className={classDirectSalesOrderState(
                          model?.generalApprovalState?.id
                        )}
                      >
                        {model?.generalApprovalState?.name}
                      </div>
                    </div>
                  </div>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <div className="Store_order_detail-footer">
        <AppFooter childrenAction={childrenActionPreview}></AppFooter>
      </div>
    </>
  );
}

export default DirectSalesOrderPreview;
