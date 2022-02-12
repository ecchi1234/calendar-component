import { commonService } from "@react3l/react3l/services";
import { Card, Checkbox, Col, Row, Spin, Tooltip } from "antd";
import Modal from "components/Utility/Modal/Modal";
import Pagination from "components/Utility/Pagination/Pagination";
import { TFunction } from "i18next";
import { Item, ItemFilter } from "models/Item";
import React from "react";
import { forkJoin } from "rxjs";

import {
  ActionFilterEnum,
  AdvanceFilterAction,
  advanceFilterReducer,
} from "services/advance-filter-service";
import { DirectSalesOrderContent } from "models/DirectSalesOrderContent";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { finalize } from "rxjs/operators";
import box from "assets/images/box-image.svg";
import circle from "assets/images/green-circle.svg";
import { commonWebService } from "services/common-web-service";
import { directSalesOrderRepository } from "repositories/direct-sales-order-repository";
import ItemSearch from "components/Utility/ItemSearch/ItemSearch";
import AdvanceTreeFilter from "components/Utility/AdvanceFilter/AdvanceTreeFilter/AdvanceTreeFilter";
import { CategoryFilter } from "models/Category";

interface DirectSalesOrderItemAction {
  type: string;
  itemList?: Item[];
  currentItemList?: Item[];
  idList?: number[];
  currentIdList?: number[];
  total?: number;
  checkedAll?: boolean;
}

interface DirectSalesOrderItem {
  itemList?: Item[];
  currentItemList?: Item[];
  idList?: number[];
  currentIdList?: number[];
  total?: number;
  checkedAll?: boolean;
}

function directSalesOrderReducer(
  lastState: DirectSalesOrderItem,
  action: DirectSalesOrderItemAction
): DirectSalesOrderItem {
  switch (action.type) {
    case "UPDATE_ITEM_LIST":
      return {
        ...lastState,
        itemList: action.itemList,
        total: action.total,
        checkedAll: action.checkedAll,
      };
    case "UPDATE_ID_LIST":
      return {
        ...lastState,
        idList: [...action.idList],
        currentIdList: [...action.idList],
        currentItemList: [...action.currentItemList],
      };
    case "UPDATE_BOTH_CHECKED":
      return {
        ...lastState,
        idList: [...lastState.idList, ...action.idList],
        currentItemList: [
          ...lastState.currentItemList,
          ...action.currentItemList,
        ],
        itemList: action.itemList,
      };
    case "UPDATE_BOTH_UNCHECKED":
      const filteredIdList = lastState.idList.filter((currentItem) => {
        return !action.idList.includes(currentItem);
      });
      const filteredItemList = lastState.currentItemList.filter(
        (currentItem) => {
          return !action.idList.includes(currentItem.id);
        }
      );
      return {
        ...lastState,
        idList: filteredIdList,
        itemList: action.itemList,
        currentItemList: filteredItemList,
      };
    case "UPDATE_BOTH_CHECKED_All":
      return {
        ...lastState,
        idList: commonWebService.uniqueArray([
          ...lastState.idList,
          ...action.idList,
        ]),
        itemList: action.itemList,
        currentItemList: commonWebService.uniqueArray([
          ...lastState.currentItemList,
          ...action.currentItemList,
        ]),
        checkedAll: action.checkedAll,
      };
    case "UPDATE_BOTH_UNCHECKED_All":
      const unCheckedIdList = lastState.idList.filter((currentItem) => {
        return !action.idList.includes(currentItem);
      });
      const unCheckedItemList = lastState.currentItemList.filter(
        (currentItem) => {
          return !action.idList.includes(currentItem.id);
        }
      );
      return {
        ...lastState,
        idList: unCheckedIdList,
        itemList: action.itemList,
        currentItemList: unCheckedItemList,
        checkedAll: action.checkedAll,
      };
    default:
      return null;
  }
}

export function useDirectSalesOrderItem(
  handleMappingItems: (
    directSalesOrderContents: DirectSalesOrderContent[]
  ) => void,
  directSalesOrderContents: DirectSalesOrderContent[],
  idAddedList?: any[]
): {
  openItemDialog: boolean;
  itemList: Item[];
  itemFilter: ItemFilter;
  total: number;
  checkedAll: boolean;
  loadingItem: boolean;
  setOpenItemDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenItem: () => void;
  handleCheckItem: (item: Item) => (event: any) => void;
  handleCheckAllItem: (event: any) => void;
  handleSaveItem: () => void;
  handleCancelItem: () => void;
  handleChangePaginationItem: (skip: number, take: number) => void;
  handleChangeCategory: (id: number) => void;
  handleChangeFilter: (value: any) => void;
} {
  const [
    { itemList, currentItemList, idList, currentIdList, total, checkedAll },
    dispatch,
  ] = React.useReducer<
    React.Reducer<DirectSalesOrderItem, DirectSalesOrderItemAction>
  >(directSalesOrderReducer, {
    itemList: [],
    idList: [],
    total: 0,
    checkedAll: false,
    currentIdList: [],
    currentItemList: [],
  });

  const [openItemDialog, setOpenItemDialog] = React.useState<boolean>(false);
  const [subscription] = commonService.useSubscription();
  const [itemFilter, dispatchItemFilter] = React.useReducer<
    React.Reducer<ItemFilter, AdvanceFilterAction<ItemFilter>>
  >(advanceFilterReducer, new ItemFilter());
  const [loading, setLoading] = React.useState<boolean>();

  const handleGetItemList = React.useCallback(
    async (filterValue) => {
      setLoading(true);
      const getNCountItems = forkJoin([
        directSalesOrderRepository.listItem(filterValue),
        directSalesOrderRepository.countItem(filterValue),
      ])
        .pipe(
          finalize(() => {
            setLoading(false);
          })
        )
        .subscribe(
          (results: [Item[], number]) => {
            if (results[0]) {
              const itemList = [...results[0]];
              const totalValue = Number(results[1]);
              let countChecked = 0;
              itemList.map((currentItem) => {
                const filteredValue = idList.filter(
                  (currentId) => currentItem.id === currentId
                )[0];
                if (filteredValue) {
                  currentItem.isChecked = true;
                  countChecked += 1;
                } else {
                  currentItem.isChecked = false;
                }
                return currentItem;
              });
              if (countChecked < 10) {
                dispatch({
                  type: "UPDATE_ITEM_LIST",
                  itemList: itemList,
                  total: totalValue,
                  checkedAll: false,
                });
              } else {
                dispatch({
                  type: "UPDATE_ITEM_LIST",
                  itemList: itemList,
                  total: totalValue,
                  checkedAll: true,
                });
              }
            }
          },
          (errors: any) => {}
        );
      subscription.add(getNCountItems);
    },
    [idList, subscription]
  );

  const handleOpenItem = React.useCallback(() => {
    const itemFilterValue = { ...itemFilter };
    itemFilterValue["id"]["notIn"] = idAddedList;
    dispatchItemFilter({
      type: ActionFilterEnum.ChangeAllField,
      data: itemFilterValue,
    });

    if (directSalesOrderContents !== undefined) {
      const ids =
        directSalesOrderContents.length > 0
          ? directSalesOrderContents.map((current) => current.item?.id)
          : [];
      const items =
        directSalesOrderContents.length > 0
          ? directSalesOrderContents.map((current) => current.item)
          : [];

      dispatch({
        type: "UPDATE_ID_LIST",
        idList: ids,
        currentItemList: items,
      });
    }

    handleGetItemList(itemFilterValue);
    setOpenItemDialog(true);
  }, [handleGetItemList, idAddedList, directSalesOrderContents, itemFilter]);

  React.useEffect(() => {
    if (directSalesOrderContents) {
      const ids =
        directSalesOrderContents.length > 0
          ? directSalesOrderContents.map((current) => current.item?.id)
          : [];
      const items =
        directSalesOrderContents.length > 0
          ? directSalesOrderContents.map((current) => current.item)
          : [];
      dispatch({
        type: "UPDATE_ID_LIST",
        idList: ids,
        currentItemList: items,
      });
    }
  }, [directSalesOrderContents]);

  const handleCheckItem = React.useCallback(
    (item: Item) => (event: any) => {
      event.stopPropagation();
      event.preventDefault();
      if (item) {
        const itemValue = { ...item };
        itemValue.isChecked = !itemValue.isChecked;
        const index = itemList.findIndex(
          (currentItem) => currentItem.id === item.id
        );
        itemList[index] = itemValue;
        if (itemValue.isChecked) {
          dispatch({
            type: "UPDATE_BOTH_CHECKED",
            itemList,
            currentItemList: [itemValue],
            idList: [itemValue.id],
          });
        } else {
          dispatch({
            type: "UPDATE_BOTH_UNCHECKED",
            itemList,
            currentItemList: [itemValue],
            idList: [itemValue.id],
          });
        }
      }
    },
    [itemList]
  );

  const handleCheckAllItem = React.useCallback(
    (event: CheckboxChangeEvent) => {
      const itemListValue = [...itemList];
      if (itemListValue && itemListValue.length > 0) {
        const isChecked = event.target.checked;
        itemListValue.forEach((currentItem) => {
          currentItem.isChecked = isChecked;
        });
        const idList = itemList.map((currentItem: Item) => currentItem.id);
        if (isChecked) {
          dispatch({
            type: "UPDATE_BOTH_CHECKED_All",
            itemList: itemListValue,
            currentItemList: itemListValue,
            idList,
            checkedAll: isChecked,
          });
        } else {
          dispatch({
            type: "UPDATE_BOTH_UNCHECKED_All",
            itemList: itemListValue,
            currentItemList: itemListValue,
            idList,
            checkedAll: isChecked,
          });
        }
      }
    },
    [itemList]
  );

  const handleSaveItem = React.useCallback(() => {
    const currentInternalOrderContent = directSalesOrderContents
      ? [...directSalesOrderContents]
      : [];
    const newInternalOrderContents: DirectSalesOrderContent[] = [
      ...currentItemList,
    ].map((currentItem, index) => {
      const filteredValue = currentInternalOrderContent.filter(
        (currentContent) => {
          return currentContent.itemId === currentItem.id;
        }
      )[0];
      if (filteredValue) {
        return { ...filteredValue, key: undefined };
      } else {
        const internalOrderContent = new DirectSalesOrderContent();

        internalOrderContent.item = { ...currentItem };
        internalOrderContent.itemId = internalOrderContent.item.id;
        internalOrderContent.primaryUnitOfMeasure =
          currentItem?.product?.unitOfMeasure;
        internalOrderContent.primaryUnitOfMeasureId =
          currentItem?.product?.unitOfMeasureId;
        internalOrderContent.taxPercentage =
          currentItem?.product?.taxType?.percentage;
        internalOrderContent.factor = 1;
        internalOrderContent.unitOfMeasure =
          currentItem?.product?.unitOfMeasure;
        internalOrderContent.unitOfMeasureId =
          currentItem?.product?.unitOfMeasure?.id;
        internalOrderContent.salePrice = 1 * currentItem?.salePrice ?? 0;
        internalOrderContent.taxPercentage =
          currentItem?.product?.taxType?.percentage;
        internalOrderContent.taxType = currentItem?.product?.taxType;
        internalOrderContent.primaryPrice = currentItem?.salePrice;
        return internalOrderContent;
      }
    });
    handleMappingItems(newInternalOrderContents);
    setOpenItemDialog(false);
  }, [currentItemList, handleMappingItems, directSalesOrderContents]);

  const handleCancelItem = React.useCallback(() => {
    const newFilterValue = new ItemFilter();
    dispatchItemFilter({
      type: ActionFilterEnum.ChangeAllField,
      data: newFilterValue,
    });
    dispatch({
      type: "UPDATE_ID_LIST",
      idList: currentIdList,
      currentItemList: currentItemList,
    });
    setOpenItemDialog(false);
  }, [currentIdList, currentItemList]);

  const handleChangePaginationItem = React.useCallback(
    (skip: number, take: number) => {
      const filterValue = { ...itemFilter };
      filterValue["skip"] = skip;
      filterValue["take"] = take;
      dispatchItemFilter({
        type: ActionFilterEnum.ChangeAllField,
        data: filterValue,
      });
      handleGetItemList(filterValue);
    },
    [itemFilter, handleGetItemList]
  );

  const handleChangeCategory = React.useCallback(
    (id) => {
      const filterValue = { ...itemFilter };
      filterValue["categoryId"]["equal"] = id;
      filterValue["skip"] = 0;
      filterValue["take"] = 10;
      handleGetItemList(filterValue);
    },
    [itemFilter, handleGetItemList]
  );
  const handleChangeFilter = React.useCallback(
    (value) => {
      const itemFilterValue = { ...itemFilter };
      itemFilterValue["search"] = value;
      dispatchItemFilter({
        type: ActionFilterEnum.ChangeAllField,
        data: itemFilterValue,
      });
      handleGetItemList(itemFilterValue);
    },
    [handleGetItemList, itemFilter]
  );

  return {
    openItemDialog,
    itemList,
    itemFilter,
    total,
    checkedAll,
    loadingItem: loading,
    setOpenItemDialog,
    handleOpenItem,
    handleCheckItem,
    handleCheckAllItem,
    handleSaveItem,
    handleCancelItem,
    handleChangePaginationItem,
    handleChangeCategory,
    handleChangeFilter,
  };
}

interface DirectSalesOrderItemModalProps {
  total?: number;
  itemList?: Item[];
  itemFilter?: ItemFilter;
  visibleDialog?: boolean;
  isCheckedAll?: boolean;
  loadingItem?: boolean;
  translate?: TFunction;
  onCancelDialog?: () => void;
  onSaveDialog?: () => void;
  handleChangePaginationItem?: (skip: number, take: number) => void;
  handleCheckItem?: (item: Item, isClick?: boolean) => (event: any) => void;
  handleCheckAllItem?: (event: any) => void;
  handleChangeCategory?: (id) => void;
  handleChangeFilter?: (value: any) => void;
}

export function InternalOrderItemModal(props: DirectSalesOrderItemModalProps) {
  const {
    total,
    itemList,
    itemFilter,
    visibleDialog,
    isCheckedAll,
    loadingItem,
    onSaveDialog,
    onCancelDialog,
    handleChangePaginationItem,
    handleCheckItem,
    handleCheckAllItem,
    handleChangeCategory,
    handleChangeFilter,
  } = props;

  return (
    <>
      <Modal
        title={null}
        visible={visibleDialog}
        onCancel={onCancelDialog}
        handleCancel={onCancelDialog}
        width={1275}
        closable={false}
        handleSave={onSaveDialog}
      >
        {loadingItem && (
          <div className="item-dialog__loading">
            <Spin size="large" />
          </div>
        )}
        <div className="item-dialog__wrapper">
          <div className="item-dialog__container">
            <div className="item-dialog__filter">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={18}>
                  <ItemSearch
                    value={itemFilter["search"]}
                    onChange={handleChangeFilter}
                    isMaterial={false}
                    placeHolder={"Tìm kiếm sản phẩm theo mã và tên..."}
                  />
                </Col>
                <Col className="gutter-row" span={6}>
                  <AdvanceTreeFilter
                    isMaterial={true}
                    onChangeSingleItem={handleChangeCategory}
                    checkStrictly={true}
                    classFilter={CategoryFilter}
                    getTreeData={directSalesOrderRepository.filterListCategory}
                    placeHolder="Danh mục"
                  />
                </Col>
              </Row>
            </div>
            <div className="item-dialog__action">
              <span className="action__result">{total} Kết quả</span>
              <div className="action__check-all">
                <Checkbox onChange={handleCheckAllItem} checked={isCheckedAll}>
                  Chọn tất cả
                </Checkbox>
              </div>
              <div className="action__pagination">
                <Pagination
                  skip={itemFilter.skip}
                  take={itemFilter.take}
                  total={total}
                  onChange={handleChangePaginationItem}
                />
              </div>
            </div>
            <div className="item-dialog__list">
              {itemList &&
                itemList.map((currentItem: Item, index: number) => (
                  <Card key={index}>
                    <div
                      className="list__card"
                      onClick={handleCheckItem(currentItem)}
                    >
                      <div className="item__check-box">
                        <Checkbox
                          checked={currentItem.isChecked}
                          onClick={handleCheckItem(currentItem)}
                        ></Checkbox>
                      </div>

                      <img
                        src={
                          currentItem.images && currentItem.images.length > 0
                            ? currentItem.images[0]?.url
                            : box
                        }
                        alt="Box"
                        className="item__image"
                      />
                      <img
                        src={circle}
                        alt="Circle"
                        className="item__image-circle"
                      />

                      <Tooltip title={currentItem.name}>
                        <div className="item__title">
                          <p className="truncated-title text-center">
                            {currentItem.name}
                            {/* {commonWebService.limitWord(currentItem.name, 38)} */}
                          </p>
                        </div>
                      </Tooltip>
                      <Tooltip title={currentItem.code}>
                        <div className="item__description mt-0">
                          {commonWebService.limitWord(currentItem.code, 15)}
                        </div>
                      </Tooltip>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
