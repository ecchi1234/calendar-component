import { StringFilter } from "@react3l/advanced-filters";
import { DEBOUNCE_TIME_300 } from "@react3l/react3l/config";
import { Model, ModelFilter } from "@react3l/react3l/core";
import { debounce } from "@react3l/react3l/helpers";
import InputSelect from "components/Utility/Input/InputSelect/InputSelect";
import InputTag from "components/Utility/Input/InputTag/InputTag";
import Tree from "components/Utility/Tree/Tree";
import React, { Reducer, RefObject } from "react";
import { Observable, Subscription } from "rxjs";
import { commonWebService } from "services/common-web-service";
import nameof from "ts-nameof.macro";
import './AdvanceTreeFilter.scss';

export interface AdvanceTreeFilter<
  T extends Model,
  TModelFilter extends ModelFilter
  > {
  title?: string;
  listItem?: Model[];
  value?: Model;
  isMaterial?: boolean;
  searchProperty?: string;
  searchType?: string;
  checkable?: boolean;
  selectable?: boolean;
  checkStrictly?: boolean;
  disabled?: boolean;
  modelFilter?: TModelFilter;
  placeHolder?: string;
  error?: string;
  render?: (T: T) => string;
  getTreeData?: (TModelFilter?: TModelFilter) => Observable<T[]>;
  onChange?: (T: Model[], TT: boolean) => void;
  onChangeSingleItem?: (T: Model, TT: boolean) => void;
  classFilter?: new () => TModelFilter;
}

export interface filterAction<T extends Model> {
  type: string;
  data?: ModelFilter;
}

function filterReducer(
  state: ModelFilter,
  action: filterAction<Model>
): ModelFilter {
  switch (action.type) {
    case "UPDATE":
      return action.data;
  }
  return;
}

export function AdvanceTreeFilter(
  props: AdvanceTreeFilter<Model, ModelFilter>
) {
  const {
    title,
    listItem,
    value,
    isMaterial,
    checkStrictly,
    searchProperty,
    searchType,
    checkable,
    selectable,
    disabled,
    classFilter: ClassFilter,
    modelFilter,
    placeHolder,
    render,
    getTreeData,
    onChange,
    onChangeSingleItem,
  } = props;

  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [item, setItem] = React.useState<Model>(new Model());

  const listIds = React.useMemo(() => {
    if (item) return [item.id];
    if (listItem) return listItem.map((currentItem) => currentItem.id);
    return [];
  }, [listItem, item]);

  const wrapperRef: RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(
    null
  );

  const [filter, dispatch] = React.useReducer<
    Reducer<ModelFilter, filterAction<Model>>
  >(filterReducer, new ClassFilter());

  const handleClearItem = React.useCallback(
    (item: Model) => {
      if (checkable) {
        const newListItem = listItem.filter(
          (currentItem) => currentItem.id !== item.id
        );
        onChange(newListItem, checkable);
      } else {
        setItem(null);
        onChangeSingleItem(null, checkable);
      }
    },
    [checkable, listItem, onChange, onChangeSingleItem]
  );

  const handleSearchItem = React.useCallback(
    debounce((searchTerm: string) => {
      const cloneFilter = modelFilter ? { ...modelFilter } : { ...filter };
      cloneFilter[searchProperty][searchType] = searchTerm;
      dispatch({ type: "UPDATE", data: cloneFilter });
    }, DEBOUNCE_TIME_300),
    []
  );

  const handleCloseList = React.useCallback(() => {
    setExpanded(false);
  }, []);

  const handleExpand = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!expanded) {
        const filterData = modelFilter ? { ...modelFilter } : new ClassFilter();
        dispatch({ type: "UPDATE", data: filterData });
      }
      setExpanded(true);
    },
    [ClassFilter, expanded, modelFilter]
  );

  const handleOnchange = React.useCallback(
    (selectedNodes: Model[]) => {
      setItem(selectedNodes[0]);
      if (!checkable) {
        onChangeSingleItem(selectedNodes[0]?.id, checkable);
        setExpanded(false);
      } else onChange([...selectedNodes], checkable);
    },
    [checkable, onChange, onChangeSingleItem]
  );

  commonWebService.useClickOutside(wrapperRef, handleCloseList);
  React.useEffect(() => {
    const subscription = new Subscription();
    if (value !== null && value !== undefined) {
      const filterValue = new ClassFilter();
      filterValue["id"]["equal"] = Number(value);
      subscription.add(getTreeData);
      getTreeData(filterValue).subscribe((res: Model[]) => {
        if (res) {
          res = res.filter((current) => current.id === Number(value));
          setItem(res[0]);
        }
      });
    } else {
      setItem(null);
    }

    return function cleanup() {
      subscription.unsubscribe();
    };
  }, [value, ClassFilter, getTreeData]);

  return (
    <>
      <div className="advance-tree-filter__container" ref={wrapperRef}>
        {title && <div className='advance-tree-filter__title'>{title}</div>}

        <div className="advance-tree-filter__input" onClick={handleExpand}>
          {checkable ? (
            <InputTag
              listItem={listItem}
              isMaterial={isMaterial}
              render={render}
              placeHolder={placeHolder}
              disabled={disabled}
              onSearch={handleSearchItem}
              onClear={handleClearItem}
            />
          ) : (
            <InputSelect
              model={item}
              render={render}
              isMaterial={isMaterial}
              placeHolder={placeHolder}
              expanded={expanded}
              disabled={disabled}
              onSearch={handleSearchItem}
              onClear={handleClearItem}
            />
          )}
        </div>
        {expanded && (
          <div className="advance-tree-filter__list">
            <Tree
              getTreeData={getTreeData}
              checkedKeys={listIds}
              modelFilter={filter}
              checkStrictly={checkStrictly}
              height={300}
              onChange={handleOnchange}
              selectable={selectable}
              checkable={checkable}
              titleRender={render}
            />
          </div>
        )}
      </div>
    </>
  );
}

AdvanceTreeFilter.defaultProps = {
  placeHolder: `Select ${nameof(AdvanceTreeFilter)}...`,
  searchProperty: nameof(Model.prototype.name),
  searchType: nameof(StringFilter.prototype.contain),
  classFilter: ModelFilter,
  isMaterial: false,
  checkable: false,
  disabled: false,
  selectable: true,
};

export default AdvanceTreeFilter;
