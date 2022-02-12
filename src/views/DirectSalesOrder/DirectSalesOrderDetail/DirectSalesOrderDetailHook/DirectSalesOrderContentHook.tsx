/* begin general import */
import { Tooltip } from "antd";
import FormItem from "components/Utility/FormItem/FormItem";
import InputNumber from "components/Utility/Input/InputNumber/InputNumber";
import Select from "components/Utility/Select/Select";
import { formatNumber } from "helpers/number";
import { DirectSalesOrder } from "models/DirectSalesOrder";
import {
  DirectSalesOrderContent,
  DirectSalesOrderContentFilter,
} from "models/DirectSalesOrderContent";

import { Item } from "models/Item";
/* end general import */
/* begin individual import */

import { UnitOfMeasure, UnitOfMeasureFilter } from "models/UnitOfMeasure";
import React from "react";
import { useTranslation } from "react-i18next";
import { directSalesOrderRepository } from "repositories/direct-sales-order-repository";

import {
  AdvanceFilterAction,
  advanceFilterReducer,
  advanceFilterService,
} from "services/advance-filter-service";
import { commonWebService } from "services/common-web-service";
import { componentFactoryService } from "services/component-factory/component-factory-service";
import {
  CreateColumn,
  CreateTableAction,
  CreateTableColumns,
} from "services/component-factory/table-column-service";
import { formService } from "services/form-service";
import { importExportDataService } from "services/import-export-data-service";
import listService from "services/list-service";
import detailService from "services/pages/detail-service";
import tableService from "services/table-service";
import nameof from "ts-nameof.macro";
/* end individual import */

export function useDirectSalesOrderContentTable(
  model: DirectSalesOrder,
  setModel: (data: DirectSalesOrder) => void,
  setCalculateTotalAfterTax?: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [translate] = useTranslation();

  const {
    content: directSalesOrderContentContents,
    setContent: setDirectSalesOrderContentContents,
  } = detailService.useContentList(
    model,
    setModel,
    nameof(model.directSalesOrderContents)
  );

  const { RenderActionColumn } = componentFactoryService;

  const [
    directSalesOrderContentFilter,
    dispatchDirectSalesOrderContentFilter,
  ] = React.useReducer<
    React.Reducer<
      DirectSalesOrderContentFilter,
      AdvanceFilterAction<DirectSalesOrderContentFilter>
    >
  >(advanceFilterReducer, new DirectSalesOrderContentFilter());

  const {
    loadList,
    setLoadList,
    handleSearch,
    handleResetFilter,
    handleUpdateNewFilter,
  } = advanceFilterService.useChangeAdvanceFilter<
    DirectSalesOrderContentFilter
  >(
    directSalesOrderContentFilter,
    dispatchDirectSalesOrderContentFilter,
    DirectSalesOrderContentFilter
  );

  const { list, total, loadingList } = listService.useLocalList(
    directSalesOrderContentFilter,

    directSalesOrderContentContents,
    loadList,
    setLoadList,
    {
      skip: 0,
      take: 9999,
    }
  );

  const {
    handleTableChange,
    handlePagination,
    rowSelection,
    canBulkDelete,
    handleLocalDelete,
    handleLocalBulkDelete,
    handleChangeAllRow,
    handleAddContent,
    // handleChangeQuantity,
    // handleChangeUOM,
  } = tableService.useLocalTable<
    DirectSalesOrderContent,
    any,
    DirectSalesOrderContentFilter
  >(
    directSalesOrderContentFilter,
    handleUpdateNewFilter,
    setLoadList,
    handleSearch,
    total,
    directSalesOrderContentContents,
    setDirectSalesOrderContentContents,
    DirectSalesOrderContent
  );

  const {
    ref,
    handleClick,
    handleImportContentList,
  } = importExportDataService.useImport();
  const {
    handleContentExport,
    handleContentExportTemplate,
  } = importExportDataService.useExport();

  const calculateAmount = React.useMemo(() => {
    return (quantity: number, salePrice: number, disCount: number) => {
      const discountPercentage = disCount ? disCount : 0;
      return Number.parseFloat(
        (quantity * salePrice * ((100 - discountPercentage) / 100)).toFixed(3)
      );
    };
  }, []);

  const handleChangeUOMInContent = React.useCallback(
    (...[, index]) => {
      return (id: number | string | null, t: UnitOfMeasure) => {
        const newSalePrice = t
          ? directSalesOrderContentContents[index]?.item?.salePrice * t?.factor
          : 0;
        const total = calculateAmount(
          directSalesOrderContentContents[index].quantity,
          newSalePrice,
          directSalesOrderContentContents[index].discountPercentage
        );
        const requestedQuantity = Number(
          t ? directSalesOrderContentContents[index].quantity * t?.factor : 0
        );

        directSalesOrderContentContents[index] = {
          ...directSalesOrderContentContents[index],
          unitOfMeasure: t,
          unitOfMeasureId: +id,
          salePrice: newSalePrice,
          amount: total,
          factor: t?.factor,
          requestedQuantity: requestedQuantity,
        };

        setDirectSalesOrderContentContents([
          ...directSalesOrderContentContents,
        ]);
        if (setCalculateTotalAfterTax) {
          setCalculateTotalAfterTax(true);
        }
      };
    },
    [
      directSalesOrderContentContents,
      calculateAmount,
      setDirectSalesOrderContentContents,
      setCalculateTotalAfterTax,
    ]
  );

  const handleChangeQuantity = React.useCallback(
    (index) => {
      return (event) => {
        if (
          directSalesOrderContentContents[index] &&
          directSalesOrderContentContents[index].unitOfMeasure
        ) {
          let requestedQuantity = 0;
          let total = calculateAmount(
            Number(event),
            directSalesOrderContentContents[index].salePrice,
            directSalesOrderContentContents[index].discountPercentage
          );

          if (event === undefined || event === null) {
            requestedQuantity = 0;
            total = 0;
          } else if (directSalesOrderContentContents[index].factor) {
            requestedQuantity = Number(
              Number(event) * directSalesOrderContentContents[index].factor
            );
          }

          directSalesOrderContentContents[index] = {
            ...directSalesOrderContentContents[index],
            quantity: Number(event),
            requestedQuantity,
            amount: total,
          };
        }
        setDirectSalesOrderContentContents([
          ...directSalesOrderContentContents,
        ]);
        if (setCalculateTotalAfterTax) {
          setCalculateTotalAfterTax(true);
        }
      };
    },
    [
      calculateAmount,
      directSalesOrderContentContents,
      setCalculateTotalAfterTax,
      setDirectSalesOrderContentContents,
    ]
  );

  const directSalesOrderContentContentColumns = React.useMemo(() => {
    return CreateTableColumns(
      CreateColumn()
        .Title(() => (
          <div className="table-cell__header">
            {translate("directSalesOrder.directSalesOrderContent.item")}
          </div>
        ))
        .Width(200)
        .Key(nameof(directSalesOrderContentContents[0].item))
        .DataIndex(nameof(directSalesOrderContentContents[0].item))
        .Render((...params: [Item, DirectSalesOrderContent, number]) => {
          return (
            <>
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
                <div className="table-cell__container table-cell__item ml-3">
                  <Tooltip title={params[1]?.item?.name}>
                    <span className="item-code__text">
                      {commonWebService.limitWord(params[1]?.item?.name, 30)}
                    </span>
                  </Tooltip>
                  <span className="item-name__text">
                    <Tooltip title={params[1]?.item?.code}>
                      {commonWebService.limitWord(params[1]?.item?.code, 15)}
                    </Tooltip>
                  </span>
                </div>
              </div>

              <span className="warning__text">{params[1]?.errors?.item}</span>
            </>
          );
        }),

      CreateColumn()
        .Title(() => (
          <div className="table-cell__header">
            {translate(
              "directSalesOrder.directSalesOrderContent.unitOfMeasure"
            )}
          </div>
        ))
        .Key(nameof(directSalesOrderContentContents[0].unitOfMeasure))
        .DataIndex(nameof(directSalesOrderContentContents[0].unitOfMeasure))
        .Render(
          (...params: [UnitOfMeasure, DirectSalesOrderContent, number]) => {
            const unitOfMeasureFilter = new UnitOfMeasureFilter();
            unitOfMeasureFilter.productId.equal = params[1].item.productId;
            return (
              <div className="table-cell__container">
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrderContent
                  >(params[1].errors, nameof(params[1].unitOfMeasureId))}
                  message={params[1].errors?.unitOfMeasure}
                >
                  <Select
                    classFilter={UnitOfMeasureFilter}
                    modelFilter={unitOfMeasureFilter}
                    isMaterial={true}
                    placeHolder={"Đơn vị..."}
                    getList={directSalesOrderRepository.singleListUnitOfMeasure}
                    onChange={handleChangeUOMInContent(params[0], params[2])}
                    model={params[1].unitOfMeasure}
                    isNotAllowedDeleted={true}
                  />
                </FormItem>
              </div>
            );
          }
        ),

      CreateColumn()
        .Title(() => (
          <div className="table-cell__header">
            {translate("directSalesOrder.directSalesOrderContent.quantity")}
          </div>
        ))
        .Width(150)
        .Align("left")
        .Key(nameof(directSalesOrderContentContents[0].quantity))
        .DataIndex(nameof(directSalesOrderContentContents[0].quantity))
        .Render((...params: [number, DirectSalesOrderContent, number]) => {
          return (
            <>
              <div className="table-cell__container">
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrderContent
                  >(params[1].errors, nameof(params[1].quantity))}
                  message={params[1].errors?.quantity}
                >
                  <InputNumber
                    isMaterial={true}
                    placeHolder={"Nhập số lượng..."}
                    value={params[0]}
                    onChange={handleChangeQuantity(params[2])}
                  />
                </FormItem>
              </div>
            </>
          );
        }),

      CreateColumn()
        .Title(() => (
          <div className="table-cell__header">
            {translate("directSalesOrder.directSalesOrderContent.salePrice")}
          </div>
        ))
        .Key(nameof(directSalesOrderContentContents[0].discountAmount))
        .DataIndex(nameof(directSalesOrderContentContents[0].discountAmount))
        .Width(150)
        .Align("right")
        .Render((...params: [number, DirectSalesOrderContent, number]) => {
          return (
            <div className="table-cell__container">
              <span className="cell-number">
                {formatNumber(params[1]?.salePrice)}
              </span>
            </div>
          );
        }),

      CreateColumn()
        .Title(() => (
          <div className="table-cell__header">
            {translate(
              "directSalesOrder.directSalesOrderContent.discountPercent"
            )}
          </div>
        ))
        .Align("right")
        .Key(nameof(directSalesOrderContentContents[0].discountPercent))
        .DataIndex(nameof(directSalesOrderContentContents[0].discountPercent))
        .Render((...params: [number, DirectSalesOrderContent, number]) => {
          return (
            <div className="table-cell__container">
              <span className="cell-number">
                {params[1]?.discountPercent !== 0 &&
                params[1]?.discountPercent !== null &&
                params[1]?.discountPercent !== undefined
                  ? formatNumber(params[1]?.discountPercent)
                  : "----"}
              </span>
            </div>
          );
        }),
      CreateColumn()
        .Title(() => (
          <div className="table-cell__header">
            {translate("directSalesOrder.directSalesOrderContent.amount")}
          </div>
        ))
        .Align("right")
        .Key(nameof(directSalesOrderContentContents[0].amount))
        .DataIndex(nameof(directSalesOrderContentContents[0].amount))
        .Render((...params: [number, DirectSalesOrderContent, number]) => {
          return (
            <div className="table-cell__container">
              <div className="result-cell">
                <span className="cell-number">
                  {params[1]?.amount ? formatNumber(params[1]?.amount) : 0}
                </span>
              </div>
            </div>
          );
        }),

      CreateColumn()
        .Key("actions")
        .Align("right")
        .DataIndex(nameof(directSalesOrderContentContents[0].key))
        .Render(
          RenderActionColumn(
            CreateTableAction()
              .Title(translate("general.delete.content"))
              .Action(handleLocalDelete)
              .HasConfirm(true)
          )
        )
    );
  }, [
    directSalesOrderContentContents,
    RenderActionColumn,
    translate,
    handleLocalDelete,
    handleChangeUOMInContent,
    handleChangeQuantity,
  ]);

  return {
    directSalesOrderContentFilter,
    internalOrderContentList: list,
    loadInternalOrderContentList: loadingList,
    internalOrderContentTotal: total,
    handleChangeAllRowInternalOrderContent: handleChangeAllRow,
    handleAddInternalOrderContent: handleAddContent,
    handleInternalOrderContentTableChange: handleTableChange,
    handleInternalOrderContentPagination: handlePagination,
    internalOrderContentRowSelection: rowSelection,
    canBulkDeleteInternalOrderContent: canBulkDelete,
    handleResetInternalOrderContentFilter: handleResetFilter,
    handleLocalBulkDeleteInternalOrderContent: handleLocalBulkDelete,
    internalOrderContentRef: ref,
    handleClickInternalOrderContent: handleClick,
    handleImportInternalOrderContent: handleImportContentList,
    handleExportInternalOrderContent: handleContentExport,
    handleExportTemplateInternalOrderContent: handleContentExportTemplate,
    directSalesOrderContentContents,
    setDirectSalesOrderContentContents,
    directSalesOrderContentContentColumns,
    handleSearchInternalOrderContent: handleSearch,
  };
}
