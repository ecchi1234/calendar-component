import { StringFilter } from "@react3l/advanced-filters/StringFilter";
import { DEBOUNCE_TIME_300 } from "@react3l/react3l/config";
import { Model, ModelFilter } from "@react3l/react3l/core";
import { debounce } from "@react3l/react3l/helpers";
import { commonService } from "@react3l/react3l/services/common-service";
import { Tooltip } from "antd";
import Spin from "antd/lib/spin";
import classNames from "classnames";
import React, { RefObject } from "react";
import { ErrorObserver, Observable } from "rxjs";
import { commonWebService } from "services/common-web-service";
import nameof from "ts-nameof.macro";
import InputSearchSelect from "../InputSearchSelect/InputSearchSelect";
import "./SelectSearch.scss";

export interface useSelectSearchProps<
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

  getList?: (TModelFilter?: TModelFilter) => Observable<T[]>;

  onChange?: (id: number, T?: T) => void;

  render?: (t: T) => string;

  classFilter: new () => TModelFilter;

  isEnumerable?: boolean;
}
function defaultRenderObject<T extends Model>(t: T) {
  return t?.name;
}
export function useSearchSelect(
  model?: Model,

  modelFilter?: ModelFilter,

  searchProperty?: string,

  searchType?: string,

  placeHolder?: string,

  disabled?: boolean,

  isMaterial?: boolean,

  getList?: (TModelFilter?: ModelFilter) => Observable<Model[]>,

  onChange?: (id: number, T?: Model) => void,

  render?: (t: Model) => string,

  classFilter?: new () => ModelFilter,

  isEnumerable?: boolean,
  handleUpdateFilter?: React.Dispatch<React.SetStateAction<ModelFilter>>
): {
  searchModel?: Model;

  wrapperRef?: RefObject<HTMLDivElement>;

  handleToggle?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => Promise<void>;

  isExpand?: boolean;

  disabled?: boolean;

  handleSearchChange?: (...params: any[]) => any;

  handleClearItem?: () => void;

  loading?: boolean;

  list?: Model[];

  handleClickItem?: (
    item: Model
  ) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;

  placeHolder?: string;

  isMaterial?: boolean;

  render?: (t: Model) => string;

  handleClickAddBtn?: () => void;
} {
  const searchModel = React.useMemo((): Model => {
    return model || null;
  }, [model]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [list, setList] = React.useState<Model[]>([]);

  const [isExpand, setExpand] = React.useState<boolean>(false);

  const wrapperRef: RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(
    null
  );
  const [subscription] = commonService.useSubscription();

  const handleLoadList = React.useCallback(() => {
    try {
      setLoading(true);
      subscription.add(getList);
      const filter = modelFilter ? modelFilter : new classFilter();
      getList({ ...filter }).subscribe(
        (res: Model[]) => {
          setList(res);
          setLoading(false);
        },
        (err: ErrorObserver<Error>) => {
          setList([]);
          setLoading(false);
        }
      );
    } catch (error) {}
  }, [getList, modelFilter, classFilter, subscription]);

  const handleToggle = React.useCallback(
    async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!disabled) {
        setExpand(true);
        if (isEnumerable) {
          if (list.length === 0) {
            await handleLoadList();
          }
        } else {
          await handleLoadList();
        }
      }
    },
    [handleLoadList, isEnumerable, list, disabled]
  );

  const handleClickAddBtn = React.useCallback(() => {
    if (!disabled) {
      setExpand(true);
      if (isEnumerable) {
        if (list.length === 0) {
          handleLoadList();
        }
      } else {
        handleLoadList();
      }
    }
  }, [handleLoadList, isEnumerable, list, disabled]);

  const handleCloseSelect = React.useCallback(() => {
    setExpand(false);
    // handleUpdateFilter(new ModelFilter());
  }, []);

  const handleClickItem = React.useCallback(
    (item: Model) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onChange(item.id, item);
      handleCloseSelect();
    },
    [handleCloseSelect, onChange]
  );

  const handleSearchChange = React.useCallback(
    debounce((searchTerm: string) => {
      const cloneModelFilter = modelFilter
        ? { ...modelFilter }
        : new classFilter();
      if (!isEnumerable) {
        if (searchType)
          cloneModelFilter[searchProperty][searchType] = searchTerm;
        else cloneModelFilter[searchProperty] = searchTerm;
      }
      // handleUpdateFilter(cloneModelFilter);

      setLoading(true);
      subscription.add(getList);
      getList(cloneModelFilter).subscribe(
        (res: Model[]) => {
          setList(res);
          setLoading(false);
        },
        (err: ErrorObserver<Error>) => {
          setList([]);
          setLoading(false);
        }
      );
    }, DEBOUNCE_TIME_300),
    [isEnumerable, modelFilter, searchProperty, searchType]
  );
  const handleClearItem = React.useCallback(() => {
    onChange(null);
  }, [onChange]);

  commonWebService.useClickOutside(wrapperRef, handleCloseSelect);

  return {
    searchModel,
    wrapperRef,
    handleToggle,
    isExpand,
    disabled,
    handleSearchChange,
    handleClearItem,
    loading,
    list,
    handleClickItem,
    placeHolder,
    isMaterial,
    render,
    handleClickAddBtn,
  };
}

export interface SelectSearchProps<
  T extends Model,
  TModelFilter extends ModelFilter
> {
  searchModel?: Model;

  wrapperRef?: RefObject<HTMLDivElement>;

  handleToggle?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => Promise<void>;

  isExpand?: boolean;

  disabled?: boolean;

  handleSearchChange?: (...params: any[]) => any;

  handleClearItem?: () => void;

  loading?: boolean;

  list?: Model[];

  handleClickItem?: (
    item: Model
  ) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;

  placeHolder?: string;

  isMaterial?: boolean;

  render?: (t: T) => string;
}

function SelectSearch(props: SelectSearchProps<Model, ModelFilter>) {
  const {
    searchModel,
    placeHolder,
    disabled,
    isMaterial,
    render,
    wrapperRef,
    handleToggle,
    isExpand,
    handleSearchChange,
    handleClearItem,
    loading,
    list,
    handleClickItem,
  } = props;

  return (
    <>
      <div className="select__container" ref={wrapperRef}>
        <div className="select__input" onClick={handleToggle}>
          <InputSearchSelect
            model={searchModel} // value of input, event should change these on update
            render={render}
            isMaterial={isMaterial}
            placeHolder={placeHolder}
            expanded={isExpand}
            disabled={disabled}
            onSearch={handleSearchChange}
            onClear={handleClearItem}
          />
        </div>
        {isExpand && (
          <div className="select__list-container">
            {!loading ? (
              <>
                <div className="select__list">
                  {list.length > 0 ? (
                    list.map((item, index) => (
                      <div
                        className={classNames("select__item", {
                          "select__item--selected": item.id === searchModel?.id,
                        })}
                        key={index}
                        onClick={handleClickItem(item)}
                      >
                        <span className="select__text">
                          {item !== undefined &&
                          item?.images !== undefined &&
                          item?.images !== null &&
                          item?.images[0]?.url ? (
                            <img
                              src={item?.images[0]?.url}
                              alt=""
                              width={40}
                              height={40}
                              className="mr-1"
                            />
                          ) : (
                            <img
                              alt=""
                              src={require("assets/images/box-image.svg")}
                              width={40}
                              height={40}
                              className="mr-1"
                            />
                          )}
                          <div className="select__item--detail">
                            <Tooltip title={item?.name}>
                              {/* {render(item)} */}
                              <p>{item?.name}</p>
                              <p>{item?.code}</p>
                            </Tooltip>
                          </div>
                        </span>
                      </div>
                    ))
                  ) : (
                    <img
                      className="img-emty"
                      src={require("assets/images/empty.svg")}
                      alt=""
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="select__loading">
                <Spin tip="Loading..."></Spin>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

SelectSearch.defaultProps = {
  searchProperty: nameof(Model.prototype.name),
  searchType: nameof(StringFilter.prototype.contain),
  isEnumerable: false,
  render: defaultRenderObject,
  isMaterial: false,
  disabled: false,
};

export default SelectSearch;
