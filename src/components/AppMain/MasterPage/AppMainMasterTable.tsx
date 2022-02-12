import { Model } from "@react3l/react3l/core";
import nameof from "ts-nameof.macro";
import { Card, Table, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import Pagination from "components/Utility/Pagination/Pagination";
import { TFunction } from "i18next";
import React, { ReactNode } from "react";
import { UseMaster } from "services/pages/master-service";

export interface AppMainMasterTableProps extends UseMaster {
  columns?: ColumnProps<Model>[];
  translate?: TFunction;
  repository?: any;
  children?: ReactNode;
}

export function AppMainMasterTable(props: AppMainMasterTableProps) {
  const {
    list,
    columns,
    filter,
    loadingList,
    canBulkDelete,
    rowSelection,
    total,
    translate,
    handleTableChange,
    handlePagination,
    handleServerBulkDelete,
  } = props;

  return (
    <>
      <div className="page__master-table custom-scrollbar">
        <Card bordered={false}>
          <Table
            rowKey={nameof(list[0].id)}
            columns={columns}
            pagination={false}
            dataSource={list}
            loading={loadingList}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            scroll={{ y: 400, x: "max-content" }}
            title={() => (
              <>
                <div className="d-flex justify-content-end">
                  <div className="flex-shrink-1 d-flex align-items-center">
                    <Tooltip
                      title={translate("general.button.bulkDelete")}
                      key="bulkDelete"
                    >
                      <button
                        className="btn border-less component__btn-delete grow-animate-2"
                        style={{ border: "none", backgroundColor: "unset" }}
                        onClick={handleServerBulkDelete}
                        disabled={!canBulkDelete}
                      >
                        <i className="tio-delete" />
                      </button>
                    </Tooltip>

                    <Pagination
                      skip={filter.skip}
                      take={filter.take}
                      total={total}
                      onChange={handlePagination}
                      style={{ margin: "10px" }}
                    />
                  </div>
                </div>
              </>
            )}
          />
        </Card>
      </div>
    </>
  );
}
