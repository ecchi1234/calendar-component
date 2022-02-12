import { Col, Row } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { LUCKY_DRAW_MASTER_ROUTE, LUCKY_DRAW_ROUTE } from "config/route-consts";
import { formatDateTime } from "helpers/date-time";
import { LuckyDraw } from "models/LuckyDraw";
import { LuckyDrawStructure } from "models/LuckyDrawStructure/LuckyDrawStructure";
import { Moment } from "moment";
import React from "react";
import { luckyDrawRepository } from "repositories/lucky-draw-repository";
import detailService from "services/pages/detail-service";
import { luckyDrawService } from "../LuckyDrawHook";
import { sortBy } from "lodash";
import "./LuckyDrawMaster.scss";

function LuckyDrawPlayHistory() {
  const [, handleGoBase] = luckyDrawService.useLuckyDrawNavigation(
    LUCKY_DRAW_ROUTE
  );
  const { model } = detailService.useDetail<LuckyDraw>(
    LuckyDraw,
    luckyDrawRepository.getDrawHistory,
    null,
    LUCKY_DRAW_MASTER_ROUTE
  );

  const timeColumns: ColumnProps<any>[] = React.useMemo(
    () => [
      {
        title: <div className="text-center gradient-text">{"Giải thưởng"}</div>,
        key: "luckyDrawStructure",
        dataIndex: "luckyDrawStructure",
        align: "center",
        render(luckyDrawStructure: LuckyDrawStructure, record) {
          return `${record?.luckyDrawNumberId} - ${luckyDrawStructure?.name}`;
        },
      },

      {
        title: <div className="text-center gradient-text">{"Ngày quay"}</div>,
        key: "time",
        dataIndex: "time",
        align: "center",
        render(time: Moment) {
          return time ? formatDateTime(time) : "";
        },
      },
    ],
    []
  );

  const countPrizesColumns: ColumnProps<any>[] = React.useMemo(
    () => [
      {
        title: <div className="text-center gradient-text">{"Giải thưởng"}</div>,
        key: "name",
        dataIndex: "name",
        align: "center",
      },

      {
        title: (
          <div className="text-center gradient-text">{"Số lượng trúng"}</div>
        ),
        key: "prizeCounter",
        dataIndex: "prizeCounter",
        align: "center",
      },
    ],
    []
  );
  // danh sách lượt đã quay
  const listUsedTurn = React.useMemo(() => {
    if (model?.luckyDrawWinners && model?.luckyDrawWinners.length > 0) {
      const tempListModel = model.luckyDrawWinners.filter((item) => {
        if (item.luckyDrawNumberId) {
          return true;
        }
        return false;
      });

      return sortBy(tempListModel, "time");
    }
    return [];
  }, [model]);
  return (
    <div
      style={{ padding: "16px 45px 16px 45px" }}
      className={"lucky-draw__history"}
    >
      <div style={{ display: "flex", marginBottom: "16px" }}>
        <i
          className="tio-caret_left"
          style={{ width: "24px", height: "24px", fontSize: "24px" }}
          onClick={() => handleGoBase()}
        ></i>
        <span
          style={{ fontWeight: "bold", fontSize: "18px", lineHeight: "24px" }}
        >
          Quay lại
        </span>
      </div>
      <div className={"lucky-draw__history--title"}>{model?.name}</div>
      <Row>
        <Col span={12}>
          <div
            style={{
              marginBottom: "24px",
              fontSize: "18px",
              color: "#181819",
            }}
          >
            Lịch sử quay thưởng
          </div>
          <Table
            dataSource={listUsedTurn.reverse()}
            columns={timeColumns}
            pagination={false}
            style={{ marginRight: "24px" }}
            scroll={{ y: 450 }}
          ></Table>
        </Col>
        <Col span={12}>
          <div
            style={{
              marginBottom: "24px",
              fontSize: "18px",
              color: "#181819",
            }}
          >
            Số lượng giải thưởng
          </div>
          <Table
            dataSource={model?.luckyDrawStructures}
            columns={countPrizesColumns}
            pagination={false}
          ></Table>
        </Col>
      </Row>
    </div>
  );
}

export default LuckyDrawPlayHistory;
