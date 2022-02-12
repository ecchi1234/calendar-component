import React from "react";
import { Session } from "./Session/Session";
import Phone from "./Phone/Phone";

import chevronIcon from "../../../assets/images/web-phone/chevron.svg";
import phoneIcon from "../../../assets/images/web-phone/phone.svg";

import Incoming from "./Incoming/Incoming";
import { SipContext } from "./WebPhone.service";
import { Button } from "antd";
import "./WebPhone.scss";

export function WebPhoneComponent(props: any) {
  const { icon, title, classNames, children, onHide } = props;

  return (
    <div className={classNames}>
      <header>
        <img src={icon} alt="icon" />
        {title}
        <img src={chevronIcon} alt="icon" onClick={onHide} />
      </header>
      <section>{children}</section>
    </div>
  );
}

interface WebPhoneProps {
  onCallEnded?: () => void;
}

export function WebPhone(props: WebPhoneProps) {
  const sipContext = React.useContext(SipContext);

  const { onCallEnded } = props;

  const {
    webPhoneService: { startCall, answerIncoming, rejectIncoming },
    combineSession: { session, incomingSessions },
    status,
  } = sipContext;

  const [showPhone, setShowPhone] = React.useState<boolean>(false);

  const hidePhone = () => setShowPhone(false);

  return (
    <>
      <div className="web-phone">
        {showPhone && (
          <div className="web-phone-body">
            {!session && incomingSessions.length === 0 && (
              <Phone status={status} onCall={startCall} onHide={hidePhone} />
            )}
            {session && (
              <Session
                session={session}
                onHide={hidePhone}
                onCallEnded={onCallEnded}
              />
            )}

            {incomingSessions.length !== 0 && (
              <Incoming
                sessions={incomingSessions}
                onAnswer={answerIncoming}
                onReject={rejectIncoming}
                onHide={hidePhone}
              />
            )}
          </div>
        )}

        <div style={{ height: "100%" }} onClick={() => setShowPhone(true)}>
          {!session && incomingSessions.length === 0 && (
            <Button type="primary">
              <img src={phoneIcon} alt="icon" />
              Phone
            </Button>
          )}
          {session && (
            <Button type="primary">
              <img src={phoneIcon} alt="icon" />
              Đang gọi
            </Button>
          )}

          {incomingSessions.length !== 0 && (
            <Button type="primary" danger>
              <img src={phoneIcon} alt="icon" />
              Cuộc gọi đến
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
