import React, { Dispatch, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppStoreContext } from "app/app-context";
import { AppAction, AppState } from "app/app-store";
import { DirectSalesOrder } from "models/DirectSalesOrder";
import { Card, Col, Descriptions, Divider, Row, Spin } from "antd";
import { useDetail } from "./DirectSalesOrderDetailHook/DirectSalesOrderDetailHook";
import { directSalesOrderRepository } from "repositories/direct-sales-order-repository";
import { DIRECT_SALES_ORDER_ROUTE } from "config/route-consts";
import FormItem from "components/Utility/FormItem/FormItem";
import { formService } from "services/form-service";
import InputText from "components/Utility/Input/InputText/InputText";
import Select from "components/Utility/Select/Select";
import DatePicker from "components/Utility/Calendar/DatePicker/DatePicker";
import { AppUser, AppUserFilter } from "models/AppUser";
import AppFooter from "components/AppFooter/AppFooter";
import { useDirectSalesOrderFooter } from "./DirectSalesOrderDetailHook/DirectSalesOrderFooterHook";
// import moment from "moment";
import SelectSearch, {
  useSearchSelect,
} from "components/Utility/SelectSearch/SelectSearch";
import { commonWebService } from "services/common-web-service";
import { Item, ItemFilter } from "models/Item";
import { DirectSalesOrderContent } from "models/DirectSalesOrderContent";
import ContentInternalOrderTable from "views/DirectSalesOrder/DirectSalesOrderDetail/ContentInternalOrderTable/ContentInternalOrderTable";
import { useDirectSalesOrderContentTable } from "./DirectSalesOrderDetailHook/DirectSalesOrderContentHook";
import nameof from "ts-nameof.macro";
import classNames from "classnames";
import {
  InternalOrderItemModal,
  useDirectSalesOrderItem,
} from "./DirectSalesOrderDetailHook/DirectSalesOrderItemHook";
import "./DirectSalesOrderDetail.scss";
import { formatNumber } from "helpers/number";
// import InputNumber from "components/Utility/Input/InputNumber/InputNumber";

function DirectSalesOrderDetail() {
  const [translate] = useTranslation();

  const [idList, setIdList] = React.useState([]);

  const { user } = useContext<[AppState, Dispatch<AppAction>]>(
    AppStoreContext
  )[0];

  // const [saleEmployeeFilter, setEmployeeFilter] = React.useState<AppUserFilter>(
  //   new AppUserFilter()
  // );

  const itemSearchFilter = new ItemFilter();

  // const [itemSearchFilter, setItemSearchFilter] = React.useState<ItemFilter>(
  //   new ItemFilter()
  // );

  const initData = React.useMemo(() => {
    const model = new DirectSalesOrder();
    if (user) {
      model.buyerStore = user.store;
      model.buyerStoreId = user.storeId;
      model.deliveryAddress = user.store?.address;
    }

    return model;
  }, [user]);

  const {
    model,
    handleUpdateNewModel,
    isDetail,
    handleChangeSimpleField,
    // handleChangeTreeObjectField,
    handleChangeObjectField,
    // handleChangeMappingField,
    // handleSave,
    handleGoBase,
  } = useDetail<DirectSalesOrder>(
    DirectSalesOrder,
    directSalesOrderRepository.get,
    directSalesOrderRepository.save,
    DIRECT_SALES_ORDER_ROUTE,
    initData
  );

  React.useEffect(() => {
    if (user !== undefined) {
      itemSearchFilter["id"]["notIn"] = idList;
      itemSearchFilter["skip"] = 0;
      itemSearchFilter["take"] = 10;
    }
  }, [idList, itemSearchFilter, user]);
  React.useEffect(() => {
    if (
      model?.directSalesOrderContents !== undefined &&
      model?.directSalesOrderContents !== null
    ) {
      if (model?.directSalesOrderContents.length > 0) {
        const arrId = model?.directSalesOrderContents?.map((o) => o?.itemId);
        setIdList([...arrId]);
      } else setIdList([]);
    }
  }, [model]);

  const [firstLoad, setFirstLoad] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (firstLoad) {
      if (user) {
        const newModel = { ...model };
        newModel.buyerStore = user.store;
        newModel.buyerStoreId = user.storeId;
        newModel.deliveryAddress = user.store?.address;
        handleUpdateNewModel(newModel);
        setFirstLoad(false);
      }
    }
  }, [firstLoad, handleUpdateNewModel, model, user]);

  const { childrenActionDetail } = useDirectSalesOrderFooter(
    translate,
    model,
    handleUpdateNewModel,
    null,
    handleGoBase
  );

  const handleChangeContent = React.useCallback(
    (id, internalOrderContent: Item) => {
      if (id !== undefined && internalOrderContent !== undefined) {
        const content = new DirectSalesOrderContent();
        content.item = internalOrderContent;
        content.itemId = id;
        content.primaryUnitOfMeasure =
          internalOrderContent?.product?.unitOfMeasure;
        content.primaryUnitOfMeasureId =
          internalOrderContent?.product?.unitOfMeasureId;
        content.taxPercentage =
          internalOrderContent?.product?.taxType?.percentage;
        content.factor = 1;
        content.unitOfMeasure = internalOrderContent?.product?.unitOfMeasure;
        content.unitOfMeasureId =
          internalOrderContent?.product?.unitOfMeasure?.id;
        content.salePrice = 1 * internalOrderContent?.salePrice ?? 0;
        content.taxPercentage =
          internalOrderContent?.product?.taxType?.percentage;
        content.taxType = internalOrderContent?.product?.taxType;
        content.primaryPrice = internalOrderContent?.salePrice;
        handleUpdateNewModel({
          ...model,
          directSalesOrderContents: [
            ...model.directSalesOrderContents,
            content,
          ],
        });
      }
    },
    [handleUpdateNewModel, model]
  );

  const {
    searchModel,
    wrapperRef,
    handleToggle,
    isExpand,
    disabled,
    handleSearchChange,
    handleClearItem,
    loading: loadingSearch,
    list,
    handleClickItem,
    placeHolder,
    isMaterial,
    render,
    handleClickAddBtn,
  } = useSearchSelect(
    model.internalOrderContents,
    itemSearchFilter,
    "search",
    null,
    "Tìm sản phẩm theo mã và tên",
    false,
    false,
    directSalesOrderRepository.listItem,
    handleChangeContent,
    (item: Item) => commonWebService.limitWord(item?.name, 60),
    ItemFilter,
    false
    // setItemSearchFilter
  );

  const [calculateTotalAfterTax, setCalculateTotalAfterTax] = React.useState<
    boolean
  >(true);

  React.useEffect(() => {
    if (calculateTotalAfterTax) {
      let newSubTotal = 0;
      let generalDiscountAmount =
        model.generalDiscountAmount !== undefined
          ? model.generalDiscountAmount
          : 0;
      let generalVAT = 0;
      if (
        model.directSalesOrderContents &&
        model.directSalesOrderContents.length >= 0
      ) {
        model.directSalesOrderContents.forEach(
          (directSalesOrderContent: DirectSalesOrderContent) => {
            newSubTotal += directSalesOrderContent.amount;
          }
        );

        if (newSubTotal && model.generalDiscountPercentage) {
          generalDiscountAmount =
            (newSubTotal * model.generalDiscountPercentage) / 100;
        } else {
          generalDiscountAmount = model.generalDiscountAmount;
        }

        model.directSalesOrderContents.forEach(
          (directSalesOrderContent: DirectSalesOrderContent) => {
            /*
             * vat = SUM ([amount - (Chiet khau tong don X amount)/subtotal]x % VAt từng dòng)
             [(Amount - SaleOrder_Discount*Amount/SubTotal)* VAT_Tax_Percent]
             SUM{[(Amount - SaleOrder_Discount*Amount/SubTotal)* VAT_Tax_Percent] [(1-n)]}
            */
            generalVAT +=
              (directSalesOrderContent.amount -
                (newSubTotal !== 0 && generalDiscountAmount !== undefined
                  ? (Number(generalDiscountAmount) *
                      Number(directSalesOrderContent.amount)) /
                    newSubTotal
                  : 0)) *
              (directSalesOrderContent.taxPercentage / 100);
          }
        );

        let newTotal =
          newSubTotal -
          (generalDiscountAmount !== undefined ? generalDiscountAmount : 0) +
          generalVAT;
        if (model.generalDiscountPercentage === 100) {
          generalVAT = 0;
          newTotal = 0;
        }

        let total = 0;
        if (model.promotionValue) {
          total = newTotal - model.promotionValue;
        } else {
          total = newTotal;
        }

        handleUpdateNewModel({
          ...model,
          subTotal: newSubTotal,
          totalTaxAmount: generalVAT ? Math.floor(generalVAT) : 0,
          totalAfterTax: newTotal ? Math.round(newTotal) : 0,
          generalDiscountAmount,
          total: Math.round(total),
          errors: {
            total: null,
          },
        });
      }

      setCalculateTotalAfterTax(false);
    }
  }, [calculateTotalAfterTax, handleUpdateNewModel, model]);

  const {
    directSalesOrderContentFilter,
    directSalesOrderContentContentColumns,
    internalOrderContentList,
    loadInternalOrderContentList,
    internalOrderContentTotal,
    handleAddInternalOrderContent,
    handleInternalOrderContentTableChange,
    handleInternalOrderContentPagination,
    canBulkDeleteInternalOrderContent,
    handleLocalBulkDeleteInternalOrderContent,
    internalOrderContentRef,
    handleClickInternalOrderContent,
    handleImportInternalOrderContent,
    handleExportInternalOrderContent,
    handleExportTemplateInternalOrderContent,
    handleChangeAllRowInternalOrderContent,
  } = useDirectSalesOrderContentTable(
    model,
    handleUpdateNewModel,
    setCalculateTotalAfterTax
  );

  const internalOrderContentTable = React.useMemo(
    () => (
      <ContentInternalOrderTable
        model={model}
        filter={directSalesOrderContentFilter}
        list={internalOrderContentList}
        loadingList={loadInternalOrderContentList}
        total={internalOrderContentTotal}
        handleTableChange={handleInternalOrderContentTableChange}
        rowSelection={null}
        handleLocalBulkDelete={handleLocalBulkDeleteInternalOrderContent}
        canBulkDelete={canBulkDeleteInternalOrderContent}
        handleExportContent={handleExportInternalOrderContent}
        handleExportTemplateContent={handleExportTemplateInternalOrderContent}
        handlePagination={handleInternalOrderContentPagination}
        handleAddContent={handleAddInternalOrderContent}
        ref={internalOrderContentRef}
        handleClick={handleClickInternalOrderContent}
        handleImportContentList={handleImportInternalOrderContent}
        columns={directSalesOrderContentContentColumns}
        hasAddContentInline={true}
        isShowTitle={false}
        isShowFooter={false}
        handleClickAddBtn={handleClickAddBtn}
      />
    ),
    [
      canBulkDeleteInternalOrderContent,
      handleAddInternalOrderContent,
      handleClickAddBtn,
      handleClickInternalOrderContent,
      handleExportInternalOrderContent,
      handleExportTemplateInternalOrderContent,
      handleImportInternalOrderContent,
      handleInternalOrderContentPagination,
      handleInternalOrderContentTableChange,
      handleLocalBulkDeleteInternalOrderContent,
      directSalesOrderContentContentColumns,
      directSalesOrderContentFilter,
      internalOrderContentList,
      internalOrderContentRef,
      internalOrderContentTotal,
      loadInternalOrderContentList,
      model,
    ]
  );

  const {
    openItemDialog,
    itemList,
    itemFilter,
    total,
    checkedAll,
    loadingItem,
    handleOpenItem,
    handleCheckItem,
    handleCheckAllItem,
    handleSaveItem,
    handleCancelItem,
    handleChangePaginationItem,
    handleChangeCategory,
    handleChangeFilter,
  } = useDirectSalesOrderItem(
    handleChangeAllRowInternalOrderContent,
    model.directSalesOrderContents,
    idList
  );

  return (
    <>
      {" "}
      {true ? (
        <>
          <div className="page page__detail purchase-request__container direct-sales-order__container">
            <div
              className="page__header d-flex align-items-center"
              style={{ marginBottom: "24px" }}
            >
              {isDetail ? (
                <div className="page__title mr-1">{model?.code}</div>
              ) : (
                translate("directSalesOrder.detail.create")
              )}
            </div>
            <div className="w-100 page__detail-tabs">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col lg={18} className="gutter-row">
                  <Row className="site-collapse-custom-collapse pb-1 ">
                    <Col lg={24}>
                      <Card title="Thông tin sản phẩm">
                        <Row justify="space-between">
                          <Col lg={16}>
                            <SelectSearch
                              searchModel={searchModel}
                              placeHolder={placeHolder}
                              disabled={disabled}
                              isMaterial={isMaterial}
                              render={render}
                              wrapperRef={wrapperRef}
                              handleToggle={handleToggle}
                              isExpand={isExpand}
                              handleSearchChange={handleSearchChange}
                              handleClearItem={handleClearItem}
                              loading={loadingSearch}
                              list={list}
                              handleClickItem={handleClickItem}
                            />
                          </Col>
                          <Col
                            lg={4}
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <button
                              className={classNames(
                                "btn component__btn-filter grow-animate-1 btn-customize"
                              )}
                              onClick={handleOpenItem}
                            >
                              <span className="component_btn-text">
                                Chọn nhiều
                              </span>
                            </button>
                          </Col>
                        </Row>
                        <>
                          <div className="internal_order_detail-table">
                            {internalOrderContentTable}
                          </div>
                          <span className="warning__text">
                            {model?.errors?.id}
                          </span>
                          <Divider />
                          <Descriptions column={1}>
                            <Descriptions.Item
                              label={translate("directSalesOrder.subTotal")}
                              className="float-right"
                            >
                              <span className="store-sales-order__description">
                                {model?.subTotal !== null &&
                                model?.subTotal !== undefined
                                  ? formatNumber(model?.subTotal) + " VNĐ"
                                  : 0 + " VNĐ"}{" "}
                              </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                              className="float-right"
                              label={translate(
                                "directSalesOrder.generalDiscountAmount"
                              )}
                            >
                              <span className="store-sales-order__description">
                                {model?.generalDiscountAmount !== null &&
                                model?.generalDiscountAmount !== undefined
                                  ? formatNumber(model?.generalDiscountAmount) +
                                    " VNĐ"
                                  : 0 + " VNĐ"}
                              </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                              className="float-right"
                              label={translate(
                                "directSalesOrder.totalTaxAmount"
                              )}
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
                                {model?.total !== null &&
                                model?.total !== undefined
                                  ? formatNumber(model?.total) + " VNĐ"
                                  : 0 + " VNĐ"}
                              </span>
                            </Descriptions.Item>
                            <Descriptions.Item className={"float-right"}>
                              {" "}
                              <span className="warning__text">
                                {model?.errors?.total}
                              </span>
                            </Descriptions.Item>
                          </Descriptions>
                        </>
                      </Card>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} className="gutter-row ">
                  <Row>
                    <Col lg={24}>
                      <Card title={"Thông tin chung"}>
                        <Row>
                          <Col lg={24} className="mb-3">
                            <FormItem
                              label={translate("directSalesOrder.deliveryDate")}
                              validateStatus={formService.getValidationStatus<
                                DirectSalesOrder
                              >(model.errors, nameof(model.deliveryDate))}
                              message={model.errors?.deliveryDate}
                            >
                              <DatePicker
                                isMaterial={true}
                                value={model.deliveryDate}
                                placeholder={translate(
                                  "directSalesOrder.placeholder.deliveryDate"
                                )}
                                onChange={handleChangeSimpleField(
                                  nameof(model.deliveryDate)
                                )}
                              />
                            </FormItem>
                          </Col>
                          <Col lg={24} className="mb-3">
                            <FormItem
                              label={translate("directSalesOrder.saleEmployee")}
                              validateStatus={formService.getValidationStatus<
                                DirectSalesOrder
                              >(model.errors, nameof(model.saleEmployee))}
                              message={model.errors?.saleEmployee}
                              isRequired={true}
                            >
                              <Select
                                isMaterial={true}
                                classFilter={AppUserFilter}
                                placeHolder={translate(
                                  "directSalesOrder.placeholder.saleEmployee"
                                )}
                                getList={
                                  directSalesOrderRepository.singleListAppUser
                                }
                                onChange={handleChangeObjectField(
                                  nameof(model.saleEmployee)
                                )}
                                render={(user: AppUser) => user?.displayName}
                                model={model.saleEmployee}
                                searchProperty={nameof(
                                  model.saleEmployee.displayName
                                )}
                                searchType="contain"
                                // modelFilter={saleEmployeeFilter}
                                disabled={
                                  model.generalApprovalStateId === 2 ||
                                  model.generalApprovalStateId === 3 ||
                                  model.generalApprovalStateId === 5 ||
                                  model.generalApprovalStateId === 6
                                }
                              />
                            </FormItem>
                          </Col>
                          <Col lg={24} className="mb-3">
                            <FormItem
                              label={translate(
                                "directSalesOrder.deliveryAddress"
                              )}
                              validateStatus={formService.getValidationStatus<
                                DirectSalesOrder
                              >(model.errors, nameof(model.deliveryAddress))}
                              message={model.errors?.deliveryAddress}
                              isRequired={true}
                            >
                              <InputText
                                isMaterial={true}
                                value={
                                  model.deliveryAddress
                                    ? model.deliveryAddress
                                    : user?.store?.address
                                }
                                placeHolder={translate(
                                  "directSalesOrder.placeholder.deliveryAddress"
                                )}
                                className={"tio-map_outlined"}
                                onBlur={handleChangeSimpleField(
                                  nameof(model.deliveryAddress)
                                )}
                              />
                            </FormItem>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
          <AppFooter
            childrenAction={childrenActionDetail}
            isNotDisplaySteps={true}
          ></AppFooter>
          <InternalOrderItemModal
            itemList={itemList}
            itemFilter={itemFilter}
            total={total}
            visibleDialog={openItemDialog}
            isCheckedAll={checkedAll}
            loadingItem={loadingItem}
            onSaveDialog={handleSaveItem}
            onCancelDialog={handleCancelItem}
            handleCheckItem={handleCheckItem}
            handleCheckAllItem={handleCheckAllItem}
            handleChangePaginationItem={handleChangePaginationItem}
            handleChangeCategory={handleChangeCategory}
            translate={translate}
            handleChangeFilter={handleChangeFilter}
          />
        </>
      ) : (
        <Spin
          spinning={true}
          className="d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        />
      )}
    </>
  );
}
export default DirectSalesOrderDetail;
