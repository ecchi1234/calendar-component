import React from "react";
import "./History.scss";
import { Button } from "antd";
import phoneIconDark from "../../../../../assets/images/web-phone/phone-dark.svg";
import { Status } from "../../WebPhone.service";

const sampleData = [
  {
    key: 1,
    name: "wb_102",
    phone: "102",
  },
  {
    key: 2,
    name: "wb_103",
    phone: "103",
  },
  {
    key: 3,
    name: "Ichirou",
    phone: "0354429302",
  },
  {
    key: 4,
    name: "Ichirou",
    phone: "0354429302",
  },
  {
    key: 5,
    name: "Ichirou",
    phone: "0354429302",
  },
  {
    key: 6,
    name: "Ichirou",
    phone: "0354429302",
  },
  {
    key: 7,
    name: "Ichirou",
    phone: "0354429302",
  },
];

export default function History(props: any) {
  const { busy, status, onCall } = props;

  const handleCall = (uri: string) => {
    if (!_canCall() || !uri) return;

    onCall(uri);
  };

  function _canCall() {
    return (
      !busy && (status === Status.CONNECTED || status === Status.REGISTERED)
    );
  }

  return (
    <div className="history">
      <ul>
        {sampleData.map((item) => (
          <li key={item.key}>
            <img
              src="https://media.discordapp.net/attachments/663753852184428596/847406738138595348/7ab2cd69-80fe-4106-ba8d-218d78b131d4.png"
              alt="icon"
            />
            <div className="history__info">
              <p className="history__info__name">{item.name}</p>
              <p className="history__info__phone">{item.phone}</p>
            </div>
            <div className="history__call">
              <Button type="primary" onClick={() => handleCall(item.phone)}>
                <img src={phoneIconDark} alt="icon" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
