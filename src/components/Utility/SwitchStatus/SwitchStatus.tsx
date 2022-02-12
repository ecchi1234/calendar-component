import React from 'react';
import { Model } from "@react3l/react3l/core";
import { Switch } from 'antd';

export interface SwitchEnumProps<T> {
    onChange?: (
        value: string | number,
        subject?: T,
    ) => void;

    checked: boolean;
    list: T[];
    disabled?: boolean;
}

function SwitchStatus<T extends Model>(props: SwitchEnumProps<T>) {
    const { onChange, checked, list, disabled } = props;
    const handleChangeStatus = React.useCallback(
        value => {
            const statusId = value ? 1 : 0;
            const status = list.filter(item => item.id === statusId)[0];

            if (onChange && typeof onChange === 'function') {
                return onChange(statusId, status);
            }
            return;
        },
        [list, onChange],
    );

    return <Switch checked={checked} onChange={handleChangeStatus} disabled={disabled} />;
}

export default SwitchStatus;
