import React from "react";
import "./AdvanceDateRangeFilter.scss";
import { Model } from "@react3l/react3l/core";
import { Moment } from "moment";
import { DatePicker } from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import { commonWebService } from "services/common-web-service";
import classNames from "classnames";

const { RangePicker } = DatePicker;

function SuffixDateIcon() {
  return (
    <span className="advance-date-range-filter__icon">
      <i className="tio-calendar_note"></i>
    </span>
  );
}

interface AdvanceDateRangeFilterProps<T extends Model> {
  value?: [Moment, Moment];
  dateFormat?: string[];
  isMaterial?: boolean;
  onChange?: (value: [Moment, Moment], dateString?: [string, string]) => void;
  placeholder?: string[];
  title?: string;
}

function AdvanceDateRangeFilter(
  props: AdvanceDateRangeFilterProps<Model> & RangePickerProps
) {
  const { value, dateFormat, isMaterial, onChange, placeholder, title } = props;

  const internalValue: [Moment, Moment] = React.useMemo(() => {
    return [
      typeof value[0] === "string"
        ? commonWebService.toMomentDate(value[0])
        : value[0],
      typeof value[1] === "string"
        ? commonWebService.toMomentDate(value[1])
        : value[1],
    ];
  }, [value]);

  const handleClearDate = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      onChange([null, null]);
    },
    [onChange]
  );

  const handleChange = React.useCallback(
    (values: [Moment, Moment], formatString: [string, string]) => {
      onChange([values[0].startOf("day"), values[1].endOf("day")]);
    },
    [onChange]
  );

  return (
    <div className="advance-date-range-filter__container">
      {title && <div className="advance-date-filter__title">{title}</div>}
      <RangePicker
        {...props}
        value={internalValue}
        onChange={handleChange}
        style={{ width: "100%" }}
        allowClear={false}
        format={dateFormat}
        className={classNames({
          "ant-picker--material": isMaterial,
          "ant-picker--bordered": !isMaterial,
        })}
        placeholder={placeholder}
        suffixIcon={<SuffixDateIcon />}
      />
      {value[0] && (
        <span
          className={classNames("advance-date-range-filter__icon-wrapper", {
            "advance-date-range-filter__icon-wrapper--material": isMaterial,
          })}
        >
          <i
            className="advance-date-range-filter__icon-clear tio-clear"
            onClick={handleClearDate}
          ></i>
        </span>
      )}
    </div>
  );
}

AdvanceDateRangeFilter.defaultProps = {
  isMaterial: false,
  dateFormat: ["DD/MM/YYYY", "YYYY/MM/DD"],
  placeholder: ["Từ ngày", "Đến ngày"],
};

export default AdvanceDateRangeFilter;
