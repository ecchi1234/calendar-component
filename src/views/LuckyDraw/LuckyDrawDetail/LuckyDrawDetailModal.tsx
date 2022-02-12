import Modal from "antd/lib/modal/Modal";
import { LUCKY_DRAW_ROUTE } from "config/route-consts";
import { formatDateTime } from "helpers/date-time";
import { LuckyDraw } from "models/LuckyDraw";
import React from "react";
import star from "../../../assets/images/icon/star.svg";
import { luckyDrawService } from "../LuckyDrawHook";
import "../LuckyDrawMaster/LuckyDrawMaster.scss";
import "./LuckyDrawDetail.scss";

export interface LuckyDrawDetailModalInterface {
  visible: boolean;
  model: LuckyDraw;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tabNumber: number;
  handleClosePreview?: () => void;
}
function LuckyDrawDetailModal(props: LuckyDrawDetailModalInterface) {
  const { visible, model, tabNumber, handleClosePreview } = props;
  const [
    handleGoPlayZone,
    ,
    handleGoPlayHistory,
  ] = luckyDrawService.useLuckyDrawNavigation(LUCKY_DRAW_ROUTE);
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
  return (
    <Modal
      visible={visible}
      width={1200}
      onCancel={handleClosePreview}
      footer={null}
    >
      <div
        style={{ display: "flex", gap: 20, justifyContent: "space-between" }}
      >
        <div style={{ width: "65%" }}>
          <div
            style={{
              whiteSpace: "normal",
              color: "#171725",
              fontWeight: "bold",
              fontSize: "18px",
              lineHeight: "24px",
            }}
          >
            {model?.name}
          </div>
          <div style={{ color: "#b73853", marginTop: 10, fontWeight: "bold" }}>
            {`Thời gian diễn ra: ${formatDateTime(
              model?.startAt
            )} đến ${formatDateTime(model?.endAt)}`}
          </div>
          <div
            className="mt-3"
            contentEditable="false"
            dangerouslySetInnerHTML={{ __html: model?.description }}
          ></div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <img
            width="auto"
            height="206px"
            alt={model?.avatarImage?.name}
            style={{ objectFit: "cover" }}
            src={
              model?.avatarImage?.url
                ? model?.avatarImage?.url
                : require("../../../assets/images/box-image.svg")
            }
            onError={(e) => {
              const image = e.target as HTMLImageElement;
              image.src = require("../../../assets/images/box-image.svg");
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <img src={star} alt=""></img>
            <div
              className={
                listUnUsedTurn.length > 0 && +tabNumber === 1
                  ? "lucky-draw__description--turns"
                  : "lucky-draw__description--no-turns"
              }
            >
              {+tabNumber === 1
                ? listUnUsedTurn.length > 0
                  ? `Có ${listUnUsedTurn.length} lượt`
                  : `Không có lượt nào!`
                : "Chương trình đã kết thúc!"}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              marginTop: "24px",
            }}
          >
            <button
              className={"btn lucky-draw__btn lucky-draw__btn--play-now"}
              onClick={() => handleGoPlayZone(model?.id)}
              disabled={listUnUsedTurn.length === 0 || +tabNumber === 2}
            >
              <span className="component_btn-text">{"Chơi ngay"}</span>
            </button>

            <button
              className={"btn lucky-draw__btn lucky-draw__btn--my-history"}
              onClick={() => handleGoPlayHistory(model?.id)}
            >
              <span className="component_btn-text">{"Giải của tôi"}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default LuckyDrawDetailModal;
