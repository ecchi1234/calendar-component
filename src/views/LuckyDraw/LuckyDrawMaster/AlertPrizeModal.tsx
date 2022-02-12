import React from "react";
import Modal from "antd/lib/modal/Modal";
import { LuckyDraw } from "models/LuckyDraw";

export interface AlertPrizeModalInterface {
  isPreview: boolean;
  setIsPreview: React.Dispatch<React.SetStateAction<boolean>>;
  winningPrize: string;
  updatedModel: LuckyDraw;
  handleUpdateNewModel: () => void;
}

function AlertPrizeModal(props: AlertPrizeModalInterface) {
  const {
    isPreview,
    setIsPreview,
    winningPrize,
    updatedModel,
    handleUpdateNewModel,
  } = props;
  const handleOk = React.useCallback(() => {
    setIsPreview(false);
    handleUpdateNewModel();
  }, [handleUpdateNewModel, setIsPreview]);

  const handleCancel = React.useCallback(() => {
    setIsPreview(false);
    handleUpdateNewModel();
  }, [handleUpdateNewModel, setIsPreview]);
  return (
    <Modal
      visible={isPreview}
      onCancel={handleCancel}
      onOk={handleOk}
      footer={null}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "15px",
        }}
      >
        {`Chúc mừng bạn đã trúng giải ${updatedModel?.luckyDrawNumberId}`}
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "25px",
          display: "flex",
          justifyContent: "center",
          lineHeight: "24px",
        }}
      >
        {winningPrize}
      </div>
    </Modal>
  );
}

export default AlertPrizeModal;
