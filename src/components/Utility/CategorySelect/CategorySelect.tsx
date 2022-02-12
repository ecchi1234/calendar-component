import { StringFilter } from "@react3l/advanced-filters";
import { Model, ModelFilter } from "@react3l/react3l/core";
import { commonService } from "@react3l/react3l/services";
import { Breadcrumb, Spin, Tooltip } from "antd";
import classNames from "classnames";
import { ASSETS_IMAGE } from "config/consts";
import { Category, CategoryFilter } from "models/Category";
import React, { RefObject, useState } from "react";
import { ErrorObserver, Observable } from "rxjs";
import { commonWebService } from "services/common-web-service";
import nameof from "ts-nameof.macro";
import InputSelect from "../Input/InputSelect/InputSelect";
import "./CategorySelect.scss";
export interface AdvanceTreeSelectProps<
  T extends Model,
  TModelFilter extends ModelFilter
  > {
  model?: Model;

  modelFilter?: TModelFilter;

  searchProperty?: string;

  searchType?: string;

  placeHolder?: string;

  disabled?: boolean;

  isMaterial?: boolean;

  // isEnumerable?: boolean;

  getList?: (TModelFilter?: TModelFilter) => Observable<T[]>;

  onChange?: (id: number, T?: Model) => void;

  render?: (t: Model) => string;

  classFilter: new () => TModelFilter;
}

function defaultRenderObject<T extends Model>(t: T) {
  if (t?.name.length > 30) {
    return (
      <Tooltip title={t?.name}>
        {commonWebService.limitWord(t?.name, 30)}
      </Tooltip>
    );
  } else return t?.name;
}
function CategorySelect(props: AdvanceTreeSelectProps<Model, ModelFilter>) {
  const {
    model,
    modelFilter,
    placeHolder,
    disabled,
    isMaterial,
    // isEnumerable,
    getList,
    onChange,
    render,
    classFilter: ClassFilter,
  } = props;
  const internalModel = React.useMemo((): Model => {
    return model || null;
  }, [model]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [list, setList] = React.useState<Model[]>([]);
  const [listLevel1, setListLevel1] = React.useState<Model[]>([]);
  const [listLevel2, setListLevel2] = React.useState<Model[]>([]);
  const [listLevel3, setListLevel3] = React.useState<Model[]>([]);
  const [listLevel4, setListLevel4] = React.useState<Model[]>([]);
  const [valueSearch1, setValueSearch1] = React.useState<string>("");
  const [valueSearch2, setValueSearch2] = React.useState<string>("");
  const [valueSearch3, setValueSearch3] = React.useState<string>("");
  const [valueSearch4, setValueSearch4] = React.useState<string>("");
  const [confirm, setConfirm] = React.useState<boolean>(true);
  const [isExpand, setExpand] = React.useState<boolean>(false);
  const [selectedList, setSelectedList] = React.useState<Model[]>([]);

  const wrapperRef: RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(
    null
  );

  const [subscription] = commonService.useSubscription();

  const handleLoadList = React.useCallback(() => {
    try {
      setLoading(true);
      subscription.add(getList);
      const filter = modelFilter ? modelFilter : new ClassFilter();
      getList(filter).subscribe(
        (res: Model[]) => {
          setList(
            res.map((item) => {
              item.isShow = true;
              return item;
            })
          );
          const arr = [];
          res.map((item) => {
            if (item?.level === 1) {
              item.isShow = true;
              arr.push(item);
            }
            return arr;
          });
          setListLevel1([...arr]);
          setLoading(false);
          setExpand(true);
        },
        (err: ErrorObserver<Error>) => {
          setLoading(false);
        }
      );
    } catch (error) { }
  }, [getList, modelFilter, ClassFilter, subscription]);

  const handleToggle = React.useCallback(
    async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setExpand(true);
      if (selectedList.length <= 0) await handleLoadList();
    },
    [handleLoadList, selectedList.length]
  );

  const handleCloseSelect = React.useCallback(() => {
    setExpand(false);
  }, []);

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(
    new CategoryFilter()
  );
  const [isFilter, setFilter] = useState<boolean>(false);

  const handleClearItem = React.useCallback(() => {
    onChange(null);
  }, [onChange]);

  const handleClickItem = React.useCallback(
    (item: Model, index) => (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      if (selectedList && selectedList.length > 0) {
        selectedList.map((t: Model, index: number) => {
          if (t?.level === item?.level) {
            selectedList.splice(index, selectedList.length - index);
          }
          return selectedList;
        });
        selectedList.push(item);
      } else {
        selectedList.push(item);
      }
      setSelectedList([...selectedList]);
      if (item?.level === 1) {
        listLevel1.forEach((i) => {
          if (item.id === i.id) i.isActive = true;
          else i.isActive = false;
        });
        setListLevel1(listLevel1);
        setListLevel2(
          list
            .filter((i) => i.parentId === item.id)
            .map((item) => {
              item.isActive = false;
              return item;
            })
        );
        setListLevel3([]);
        setListLevel4([]);
      }
      if (item?.level === 2) {
        listLevel2.forEach((i) => {
          if (item.id === i.id) i.isActive = true;
          else i.isActive = false;
        });
        setListLevel2(listLevel2);
        setListLevel3(
          list
            .filter((i) => i.parentId === item.id)
            .map((item) => {
              item.isActive = false;
              return item;
            })
        );
        setListLevel4([]);
      }
      if (item?.level === 3) {
        listLevel3.forEach((i) => {
          if (item.id === i.id) i.isActive = true;
          else i.isActive = false;
        });
        setListLevel3(listLevel3);
        setListLevel4(
          list
            .filter((i) => i.parentId === item.id)
            .map((item) => {
              item.isActive = false;
              return item;
            })
        );
      }
      if (item?.level === 4) {
        listLevel4.forEach((i) => {
          if (item.id === i.id) i.isActive = true;
          else i.isActive = false;
        });
        setListLevel4(listLevel4);
      }
      if (!item?.hasChildren) {
        setConfirm(false);
      } else setConfirm(true);
    },
    [selectedList, listLevel1, list, listLevel2, listLevel3, listLevel4]
  );

  commonWebService.useClickOutside(wrapperRef, handleCloseSelect);
  const handleFilter = React.useCallback(
    (level: number) => {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (level) {
          case 1: {
            setValueSearch1(event.target.value);
            break;
          }
          case 2: {
            setValueSearch2(event.target.value);
            break;
          }
          case 3: {
            setValueSearch3(event.target.value);
            break;
          }
          case 4: {
            setValueSearch4(event.target.value);
            break;
          }
        }
        setCategoryFilter({
          ...categoryFilter,
          name: { contain: event.target.value },
          level: { equal: level },
        });
        setFilter(true);
      };
    },
    [categoryFilter, setValueSearch1, setValueSearch2, setValueSearch3]
  );
  const handleClearFilter = React.useCallback(
    (level: number) => {
      switch (level) {
        case 1: {
          setValueSearch1("");
          setListLevel1(
            listLevel1.map((item) => {
              item.isShow = true;
              return item;
            })
          );
          break;
        }
        case 2: {
          setValueSearch2("");
          setListLevel2(
            listLevel2.map((item) => {
              item.isShow = true;
              return item;
            })
          );
          break;
        }
        case 3: {
          setValueSearch3("");
          setListLevel3(
            listLevel3.map((item) => {
              item.isShow = true;
              return item;
            })
          );
          break;
        }
        case 4: {
          setValueSearch4("");
          setListLevel4(
            listLevel4.map((item) => {
              item.isShow = true;
              return item;
            })
          );
          break;
        }
      }
    },
    [listLevel1, listLevel2, listLevel3, listLevel4]
  );
  React.useEffect(() => {
    if (isFilter) {
      if (valueSearch1 !== "") {
        let arr = [];
        if (categoryFilter.name.contain !== "" && categoryFilter.name.contain) {
          arr = listLevel1.map((category: Category) => {
            if (
              category.name
                ?.toLocaleLowerCase()
                ?.includes(categoryFilter?.name?.contain.toLocaleLowerCase())
            ) {
              category.isShow = true;
            } else {
              category.isShow = false;
            }
            return category;
          });
          setListLevel1(arr);
        }
      } else {
        setListLevel1(
          listLevel1.map((item) => {
            item.isShow = true;
            return item;
          })
        );
      }

      if (valueSearch2 !== "") {
        let arr = [];
        if (categoryFilter.name.contain !== "" && categoryFilter.name.contain) {
          arr = listLevel2.map((category: Category) => {
            if (
              category.name
                ?.toLocaleLowerCase()
                ?.includes(categoryFilter?.name?.contain.toLocaleLowerCase())
            ) {
              category.isShow = true;
            } else {
              category.isShow = false;
            }
            return category;
          });
          setListLevel2(arr);
        }
      } else {
        setListLevel2(
          listLevel2.map((item) => {
            item.isShow = true;
            return item;
          })
        );
      }
      if (valueSearch3 !== "") {
        let arr = [];
        if (categoryFilter.name.contain !== "" && categoryFilter.name.contain) {
          arr = listLevel3.map((category: Category) => {
            if (
              category.name
                ?.toLocaleLowerCase()
                ?.includes(categoryFilter?.name?.contain.toLocaleLowerCase())
            ) {
              category.isShow = true;
            } else {
              category.isShow = false;
            }
            return category;
          });
          setListLevel3(arr);
        }
      } else {
        setListLevel3(
          listLevel3.map((item) => {
            item.isShow = true;
            return item;
          })
        );
      }
      if (valueSearch4 !== "") {
        let arr = [];
        if (categoryFilter.name.contain !== "" && categoryFilter.name.contain) {
          arr = listLevel4.map((category: Category) => {
            if (
              category.name
                ?.toLocaleLowerCase()
                ?.includes(categoryFilter?.name?.contain.toLocaleLowerCase())
            ) {
              category.isShow = true;
            } else {
              category.isShow = false;
            }
            return category;
          });
          setListLevel4(arr);
        }
      } else {
        setListLevel4(
          listLevel4.map((item) => {
            item.isShow = true;
            return item;
          })
        );
      }

      setFilter(false);
    }
  }, [
    categoryFilter,
    categoryFilter.name,
    isFilter,
    list,
    listLevel1,
    listLevel2,
    listLevel3,
    listLevel4,
    valueSearch1,
    valueSearch2,
    valueSearch3,
    valueSearch4,
  ]);
  const handleChange = React.useCallback(() => {
    onChange(
      selectedList[selectedList.length - 1]?.id,
      selectedList[selectedList.length - 1]
    );
    handleCloseSelect();
  }, [handleCloseSelect, onChange, selectedList]);
  return (
    <>
      <div className="tree-select__container" ref={wrapperRef}>
        <div className="tree-select__input" onClick={handleToggle}>
          <InputSelect
            model={internalModel}
            isMaterial={isMaterial}
            placeHolder={placeHolder}
            expanded={isExpand}
            disabled={disabled}
            onClear={handleClearItem}
          />
        </div>

        {isExpand && (
          <div>
            {!loading ? (
              <div className="category__dropdown">
                <div className="categoty__list-container">
                  <div
                    className={classNames("category__list ", {
                      "category__list-boder": listLevel1.length,
                    })}
                  >
                    <>
                      <div className="category__title">
                        Danh mục cấp {listLevel1[0]?.level}
                      </div>
                      <div className="d-flex justify-content-between ml-1 mr-1">
                        <input
                          type="text"
                          value={valueSearch1}
                          onChange={handleFilter(listLevel1[0]?.level)}
                          placeholder="Tìm kiếm từ khóa danh mục "
                          className={classNames(
                            "component__input component__input--material"
                          )}
                        />
                        {valueSearch1 ? (
                          <i
                            className=" tio-clear mt-3"
                            onClick={() => handleClearFilter(1)}
                          ></i>
                        ) : (
                          <i className="tio-search mt-3" />
                        )}
                      </div>

                      <div className="category">
                        {listLevel1.length > 0 ? (
                          listLevel1.map(
                            (item, index) =>
                              item.isShow && (
                                <div
                                  className={classNames("category__item", {
                                    "item-active": item.isActive,
                                  })}
                                  key={index}
                                  onClick={handleClickItem(item, index)}
                                >
                                  <span className="select__text">
                                    {render(item)}
                                  </span>
                                </div>
                              )
                          )
                        ) : (
                          <img
                            className="img-emty"
                            src={ASSETS_IMAGE + "/no-data.png"}
                            alt="No data"
                          />
                        )}
                      </div>
                    </>
                  </div>
                  <div
                    className={classNames("category__list", {
                      "category__list-boder": listLevel2.length,
                      // 'category__list-hidden': listLevel2.length <= 0,
                    })}
                  >
                    {listLevel2.length ? (
                      <>
                        <div className="category__title">
                          Danh mục cấp {listLevel2[0]?.level}
                        </div>
                        <div className="d-flex justify-content-between ml-1 mr-1">
                          <input
                            type="text"
                            value={valueSearch2}
                            onChange={handleFilter(listLevel2[0]?.level)}
                            placeholder="Tìm kiếm từ khóa danh mục"
                            className={classNames(
                              "component__input component__input--material"
                            )}
                          />
                          {valueSearch2 ? (
                            <i
                              className=" tio-clear mt-3"
                              onClick={() => handleClearFilter(2)}
                            ></i>
                          ) : (
                            <i className="tio-search mt-3" />
                          )}
                        </div>
                        <div className="category">
                          {listLevel2.length > 0 ? (
                            listLevel2.map(
                              (item, index) =>
                                item.isShow && (
                                  <div
                                    className={classNames("category__item", {
                                      "item-active": item.isActive,
                                    })}
                                    key={index}
                                    onClick={handleClickItem(item, index)}
                                  >
                                    <span className="select__text">
                                      {render(item)}
                                    </span>
                                  </div>
                                )
                            )
                          ) : (
                            <img
                              className="img-emty"
                              src={ASSETS_IMAGE + "/no-data.png"}
                              alt="No data"
                            />
                          )}
                        </div>
                      </>
                    ) : (
                      <> </>
                    )}
                  </div>

                  <div
                    className={classNames("category__list", {
                      "category__list-boder": listLevel3.length,
                      // 'category__list-hidden': listLevel3.length <= 0,
                    })}
                  >
                    {listLevel3.length ? (
                      <>
                        <div className="category__title">
                          Danh mục cấp {listLevel3[0]?.level}
                        </div>
                        <div className="d-flex justify-content-between ml-1 mr-1">
                          <input
                            type="text"
                            value={valueSearch3}
                            onChange={handleFilter(listLevel3[0]?.level)}
                            placeholder="Tìm kiếm từ khóa danh mục"
                            className={classNames(
                              "component__input component__input--material"
                            )}
                          />
                          {valueSearch3 ? (
                            <i
                              className=" tio-clear mt-3"
                              onClick={() => handleClearFilter(3)}
                            ></i>
                          ) : (
                            <i className="tio-search mt-3" />
                          )}
                        </div>
                        <div className="category">
                          {listLevel3.length > 0 ? (
                            listLevel3.map(
                              (item, index) =>
                                item.isShow && (
                                  <div
                                    className={classNames("category__item", {
                                      "item-active": item.isActive,
                                    })}
                                    key={index}
                                    onClick={handleClickItem(item, index)}
                                  >
                                    <span className="select__text">
                                      {render(item)}
                                    </span>
                                  </div>
                                )
                            )
                          ) : (
                            <img
                              className="img-emty"
                              src={ASSETS_IMAGE + "/no-data.png"}
                              alt=""
                            />
                          )}
                        </div>
                      </>
                    ) : (
                      <> </>
                    )}
                  </div>
                  <div
                    className={classNames("category__list", {
                      "category__list-boder": listLevel4.length,
                      // 'category__list-hidden': listLevel4.length <= 0,
                    })}
                  >
                    {listLevel4.length ? (
                      <>
                        <div className="category__title">
                          Danh mục cấp {listLevel4[0]?.level}
                        </div>
                        <div className="d-flex justify-content-between ml-1 mr-1">
                          <input
                            type="text"
                            value={valueSearch4}
                            onChange={handleFilter(listLevel4[0]?.level)}
                            placeholder="Tìm kiếm từ khóa danh mục"
                            className="component__input component__input--material"
                          />
                          {valueSearch4 ? (
                            <i
                              className=" tio-clear mt-3"
                              onClick={() => handleClearFilter(4)}
                            ></i>
                          ) : (
                            <i className="tio-search mt-3" />
                          )}
                        </div>
                        <div className="category">
                          {listLevel4.length > 0 ? (
                            listLevel4.map(
                              (item, index) =>
                                item.isShow && (
                                  <div
                                    className={classNames("category__item", {
                                      "item-active": item.isActive,
                                    })}
                                    key={index}
                                    onClick={handleClickItem(item, index)}
                                  >
                                    <span className="select__text">
                                      {render(item)}
                                    </span>
                                  </div>
                                )
                            )
                          ) : (
                            <img
                              className="img-emty"
                              src={ASSETS_IMAGE + "/no-data.png"}
                              alt=""
                            />
                          )}
                        </div>
                      </>
                    ) : (
                      <> </>
                    )}
                  </div>
                </div>
                <div className="category_footer">
                  <div className="d-flex justify-content-start mt-4">
                    {selectedList && selectedList.length > 0 && (
                      <>
                        <span className="mr-1">Đang chọn:</span>
                        <Breadcrumb separator=" > " className="">
                          {selectedList.map((item) => (
                            <Breadcrumb.Item
                              key={item.id}
                              className="text-active"
                            >
                              {item.name.length > 30 ? (
                                <Tooltip title={item.name}>
                                  {commonWebService.limitWord(item.name, 30)}
                                </Tooltip>
                              ) : (
                                item.name
                              )}
                            </Breadcrumb.Item>
                          ))}
                        </Breadcrumb>
                      </>
                    )}
                  </div>
                  <div className="mb-2 mt-2">
                    <button
                      className="btn component__btn-primary mr-4 mt-2"
                      disabled={confirm}
                      onClick={handleChange}
                    >
                      <i className="tio-checkmark_circle_outlined mr-2" />
                      Xác nhận
                    </button>
                    <button
                      className="btn component__btn-cancel mt-2"
                      onClick={handleCloseSelect}
                    >
                      <i className="tio-clear_circle_outlined mr-2" />
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="select__loading">
                <Spin />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
CategorySelect.defaultProps = {
  searchProperty: nameof(Model.prototype.name),
  searchType: nameof(StringFilter.prototype.contain),
  // isEnumerable: false,
  render: defaultRenderObject,
  isMaterial: false,
  disabled: false,
};

export default CategorySelect;
