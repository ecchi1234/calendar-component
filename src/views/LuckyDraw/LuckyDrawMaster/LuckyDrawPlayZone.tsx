import { Col, Row, Spin } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { LUCKY_DRAW_MASTER_ROUTE, LUCKY_DRAW_ROUTE } from "config/route-consts";
import { LuckyDraw } from "models/LuckyDraw";
import { LuckyDrawStructure } from "models/LuckyDrawStructure/LuckyDrawStructure";
import React from "react";
import { luckyDrawRepository } from "repositories/lucky-draw-repository";
import detailService from "services/pages/detail-service";
import { luckyDrawService } from "../LuckyDrawHook";
import "./LuckyDrawMaster.scss";
import { drawWheel } from "./WheelEffectService";
import AlertPrizeModal from "./AlertPrizeModal";
import { Moment } from "moment";
import { formatDateTime } from "helpers/date-time";
import notification from "antd/lib/notification";
import { sortBy } from "lodash";

notification.config({
  placement: "bottomRight",
});

function LuckyDrawPlayZone() {
  const drawButtonRef = React.useRef();
  const wheelRef = React.useRef();
  const [, handleGoBase] = luckyDrawService.useLuckyDrawNavigation(
    LUCKY_DRAW_ROUTE
  );
  const { model, handleUpdateNewModel } = detailService.useDetail<LuckyDraw>(
    LuckyDraw,
    luckyDrawRepository.get,
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
  const [newModel, setNewModel] = React.useState<LuckyDraw>(model);

  const [isPreview, setIsPreview] = React.useState<boolean>(false);
  const [isSpinning, setIsSpinning] = React.useState<boolean>(false);
  const [winningPrize, setWinningPrize] = React.useState<string>("");
  React.useEffect(() => {
    if (
      drawButtonRef &&
      drawButtonRef.current &&
      wheelRef &&
      wheelRef.current &&
      model?.image?.url
    ) {
      drawWheel(setIsPreview, setIsSpinning);
    }
  }, [model]);

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

  // danh sách lượt chưa quay
  const listUnUsedTurn = React.useMemo(() => {
    if (model?.luckyDrawWinners && model?.luckyDrawWinners.length > 0) {
      return model.luckyDrawWinners.filter((item) => {
        if (!item.luckyDrawNumberId) {
          return true;
        }
        return false;
      });
    }
    return [];
  }, [model]);

  // get thông tin của chương trình quay thưởng
  const handleGetLuckyDraw = React.useCallback(() => {
    // lấy lucky draw id từ url
    const luckyDrawId = window.location.href.split("?")[1].split("=")[1];
    // thực hiện lấy lại thông tin chương trình quay thưởng
    luckyDrawRepository.get(luckyDrawId).subscribe((res: LuckyDraw) => {
      handleUpdateNewModel(res);
    });
  }, [handleUpdateNewModel]);

  const handleDraw = React.useCallback(() => {
    setIsSpinning(true);
    luckyDrawRepository.draw(listUnUsedTurn[0].id).subscribe(
      (res: LuckyDraw) => {
        setWinningPrize(
          res?.luckyDrawStructure?.name + " - " + res?.luckyDrawStructure?.value
        );
        setNewModel(res);
      },
      (err) =>
        notification.error({
          message: "Quay thưởng lỗi",
          description: "Không thể quay thưởng",
        })
    );
  }, [listUnUsedTurn]);

  return !model ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="loading-block">
        <Spin tip="Loading..." />
      </div>
    </div>
  ) : (
    <div style={{ padding: "16px 45px 16px 45px" }}>
      <div style={{ display: "flex", marginBottom: "16px" }}>
        <i
          className="tio-caret_left"
          style={{ width: "24px", height: "24px", fontSize: "24px" }}
          onClick={() => (isSpinning ? null : handleGoBase())}
        ></i>
        <span
          style={{ fontWeight: "bold", fontSize: "18px", lineHeight: "24px" }}
        >
          Quay lại
        </span>
      </div>
      <div className={"play-zone"}>
        <Row>
          <Col span={12}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
              }}
            >
              {model?.image?.url ? (
                <img
                  src={model?.image?.url}
                  alt=""
                  style={{ width: "440px", height: "440px" }}
                  className={"wheel"}
                  ref={wheelRef}
                ></img>
              ) : (
                <div
                  style={{
                    width: "440px",
                    height: "440px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div className="loading-block">
                    <Spin tip="Loading..." />
                  </div>
                </div>
              )}

              <div className={"play-zone__turn--count"}>
                {`${
                  listUnUsedTurn.length > 0 ? listUnUsedTurn.length : 0
                } lượt`}{" "}
              </div>
              <button
                className={
                  "btn lucky-draw__btn lucky-draw__btn--play-now button"
                }
                onClick={() => handleDraw()}
                ref={drawButtonRef}
                disabled={listUnUsedTurn.length === 0 || isSpinning}
              >
                {" "}
                <span className="component_btn-text">{"QUAY"}</span>
              </button>
              <div className={"play-zone__prize--list-item"}>
                {model &&
                  model?.luckyDrawStructures &&
                  model?.luckyDrawStructures.map((item: LuckyDrawStructure) => (
                    <div key={item?.id} className={"play-zone__prize--item"}>
                      {`${item?.quantity} ${item?.name} - ${item?.value}`}
                    </div>
                  ))}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                color: "#B73853",
                fontWeight: "bold",
                fontSize: "32px",
                lineHeight: "40px",
                marginBottom: "16px",
              }}
            >
              {model?.name}
            </div>
            <div
              style={{
                marginBottom: "24px",
                fontSize: "18px",
                color: "#181819",
              }}
            >
              Giải thưởng của tôi
            </div>
            <Table
              dataSource={listUsedTurn.reverse()}
              columns={timeColumns}
              pagination={false}
              style={{ marginBottom: "24px" }}
              scroll={{ y: 240 }}
            ></Table>
            <Table
              dataSource={model.luckyDrawStructures}
              columns={countPrizesColumns}
              pagination={false}
            ></Table>
          </Col>
        </Row>
      </div>
      <AlertPrizeModal
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        winningPrize={winningPrize}
        updatedModel={newModel}
        handleUpdateNewModel={handleGetLuckyDraw}
      />
    </div>
  );
}

export default LuckyDrawPlayZone;
