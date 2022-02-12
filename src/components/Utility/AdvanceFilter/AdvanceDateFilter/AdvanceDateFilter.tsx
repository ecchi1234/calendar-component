import React from "react";
import "./AdvanceDateFilter.scss";
import { DatePicker } from "antd";
import { DatePickerProps } from "antd/lib/date-picker";
import { Model } from "@react3l/react3l/core";
import { Moment } from "moment";
import { commonWebService } from "services/common-web-service";
import classNames from "classnames";
import moment from "moment";

interface AdvanceFilterDateProps<T extends Model> {
  value?: Moment | [Moment, Moment];
  dateFormat?: string[];
  isMaterial?: boolean;
  title?: string;
  onChange?: (value: Moment | [Moment, Moment], dateString?: string) => void;
}

function AdvanceFilterDate(
  props: AdvanceFilterDateProps<Model> & DatePickerProps
) {
  const { value, dateFormat, isMaterial, title, onChange } = props;

  const dateRef = React.useRef<any>();

  const internalValue = React.useMemo(() => {
    return typeof value === "string"
      ? commonWebService.toMomentDate(value)
      : value;
  }, [value]);

  const handleClearDate = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      onChange([null, null]);
    },
    [onChange]
  );

  const handleChangeDate = React.useCallback(
    (date: Moment, dateString: string) => {
      const startOfDay = moment(date).startOf("day");
      const endOfDay = moment(date).endOf("day");
      onChange([startOfDay, endOfDay]);
    },
    [onChange]
  );

  return (
    <div className="advance-filter-date__container">
      {title && <div className="advance-date-filter__title">{title}</div>}
      <DatePicker
        {...props}
        value={internalValue}
        onChange={handleChangeDate}
        style={{ width: "100%" }}
        ref={dateRef}
        allowClear={false}
        format={dateFormat}
        className={classNames({
          "ant-picker--material": isMaterial,
          "ant-picker--bordered": !isMaterial,
        })}
      />
      {value && (
        <span
          className={classNames("advance-filter-date__icon-wrapper", {
            "advance-filter-date__icon-wrapper--material": isMaterial,
            "no-title": title === undefined,
          })}
        >
          <i
            className="advance-filter-date__icon-clear tio-clear"
            onClick={handleClearDate}
          ></i>
        </span>
      )}
    </div>
  );
}

AdvanceFilterDate.defaultProps = {
  isMaterial: false,
  dateFormat: ["DD/MM/YYYY", "YYYY/MM/DD"],
};

export default AdvanceFilterDate;
