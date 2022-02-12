import React from "react";
import { Input, Button } from "antd";
import "./Dialer.scss";
import { Status } from "../../WebPhone.service";

export default function Dialer(props: any) {
  const { busy, status, onCall } = props;
  const [uri, setUri] = React.useState("");

  function handleUriChange(event: any) {
    setUri(event.target.value);
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    if (!_canCall() || !uri) return;

    _doCall();
  }

  function _doCall() {
    const _uri = uri;

    setUri("");
    onCall(_uri);
  }

  function _canCall() {
    return (
      !busy && (status === Status.CONNECTED || status === Status.REGISTERED)
    );
  }

  function renderNumpad() {
    let rows = [];
    const numpads = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "*",
      "0",
      "#",
    ];

    numpads.map((item) => {
      rows.push(
        <div
          className="dialer-body__number"
          key={item}
          onClick={() => setUri(`${uri}${item}`)}
        >
          {item}
        </div>
      );
      return rows;
    });

    return <>{rows}</>;
  }

  return (
    <div className="dialer">
      <div className="dialer-body__dialer">
        <Input
          placeholder="Nhập số điện thoại"
          value={uri}
          onChange={handleUriChange}
        />
        <div className="dialer-body__numbers">{renderNumpad()}</div>
        <div className="dialer-body__call">
          <Button type="primary" onClick={handleSubmit}>
            Gọi
          </Button>
        </div>
      </div>
    </div>
  );
}
