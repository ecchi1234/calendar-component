import React from "react";
import "./Incoming.scss";
import { Button } from "antd";
import { WebPhoneComponent } from "../WebPhone";
import incomingIcon from "../../../../assets/images/web-phone/phone-incoming.svg";
import acceptIcon from "../../../../assets/images/web-phone/accept.svg";
import denyIcon from "../../../../assets/images/web-phone/deny.svg";
import { IncomingSession } from "../WebPhone.service";

export interface IncomingProps {
  sessions: IncomingSession[];
  onAnswer: (idx: number) => void;
  onReject: (idx: number) => void;
  onHide: () => void;
}

export default function Incoming(props: IncomingProps) {
  const { sessions, onAnswer, onReject, onHide } = props;

  const handleAnswer = React.useCallback(
    (idx: number) => {
      onAnswer(idx);
    },
    [onAnswer]
  );

  const handleReject = React.useCallback(
    (idx: number) => {
      onReject(idx);
    },
    [onReject]
  );

  // Terminate all connections before unloading
  const onUnload = React.useCallback(() => {
    sessions.forEach((s) => s.value.terminate());
  }, [sessions]);

  window.onbeforeunload = function(e) {
    return onUnload();
  };

  return (
    <>
      <WebPhoneComponent
        icon={incomingIcon}
        title="Phone"
        classNames="incoming"
        onHide={onHide}
      >
        <div className="incoming-header">
          <p>Cuộc gọi tới</p>
        </div>
        <div className="incoming-list">
          <ul>
            {sessions.map((s, i) => {
              const { name, uri } = {
                name: s.value.remote_identity.display_name,
                uri: s.value.remote_identity.uri.toString(),
              };
              return (
                <li key={i}>
                  <img
                    src="https://media.discordapp.net/attachments/663753852184428596/847406738138595348/7ab2cd69-80fe-4106-ba8d-218d78b131d4.png"
                    alt="icon"
                  />
                  <div className="incoming__info">
                    <p className="incoming__info__name">{name}</p>
                    <p className="incoming__info__phone">{uri}</p>
                  </div>
                  <div className="incoming__action">
                    <Button
                      type="primary"
                      onClick={() => handleAnswer(i)}
                      style={{ marginRight: 8 }}
                    >
                      <img src={acceptIcon} alt="icon" />
                    </Button>
                    <Button type="primary" onClick={() => handleReject(i)}>
                      <img src={denyIcon} alt="icon" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </WebPhoneComponent>
    </>
  );
}
