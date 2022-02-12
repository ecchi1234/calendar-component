import React from "react";
import { Tabs } from "antd";
import Dialer from "./Dialer/Dialer";
import History from "./History/History";
import { WebPhoneComponent } from "../WebPhone";
import phoneIconDark from "../../../../assets/images/web-phone/phone-dark.svg";

import "./Phone.scss";
import { Status } from "../WebPhone.service";

const { TabPane } = Tabs;

interface PhoneProps {
  status: Status;
  onCall: (sip: string) => void;
  onHide: () => void;
}

export default function Phone(props: PhoneProps) {
  const { onHide } = props;

  return (
    <WebPhoneComponent
      icon={phoneIconDark}
      title="Phone"
      classNames="phone"
      onHide={onHide}
    >
      <Tabs defaultActiveKey="dialer">
        <TabPane tab="Bàn phím" key="dialer">
          <Dialer {...props} />
        </TabPane>
        <TabPane tab="Lịch sử" key="history">
          <History {...props} />
        </TabPane>
      </Tabs>
    </WebPhoneComponent>
  );
}
