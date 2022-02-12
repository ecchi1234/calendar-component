import { storiesOf } from "@storybook/react";
import React, { Reducer } from "react";
import { Subscription } from "rxjs";
import nameof from "ts-nameof.macro";
import {
  CombineSession,
  CombineSessionAction,
  SessionReducer,
  SipContext,
  webPhoneService,
  defaultUAConf,
  Status,
} from "./WebPhone.service";
import { WebPhone } from "./WebPhone";

function Default() {
  const [combineSession, updateSession] = React.useReducer<
    Reducer<CombineSession, CombineSessionAction>
  >(SessionReducer, { session: null, incomingSessions: [] });
  const [status, setStatus] = React.useState<Status>(Status.DISCONECTED);

  React.useEffect(() => {
    const subcription = new Subscription();

    let uaConf = JSON.parse(localStorage.getItem("uaConf"));

    if (!uaConf) {
      uaConf = defaultUAConf;
      uaConf.display_name = "wb_100";
      uaConf.uri = "sip:wb_100@192.168.26.250";
      uaConf.password = "rangdong";
      uaConf.socketUri = "wss://192.168.26.250:8089/ws";
      uaConf.sockets = [
        {
          uri: "wss://192.168.26.250:8089/ws",
          via_transport: "auto",
        },
      ];
      localStorage.setItem("uaConf", JSON.stringify(uaConf));
    }

    webPhoneService.setUAConf(uaConf);
    webPhoneService.startUA();

    // subscribe to session change
    const webPhoneSessionSub = webPhoneService.combineSessionObs.subscribe(
      (res: CombineSession) => {
        //update session:
        if (res) {
          updateSession({
            type: "UPDATE_SESSION",
            data: {
              session: res.session,
              incomingSessions: [...res.incomingSessions],
            },
          });
        }
      }
    );

    // subscribe to status change
    const webPhoneStatusSub = webPhoneService.statusObs.subscribe(
      (res: Status) => {
        //update session:
        if (res) {
          setStatus(res);
        }
      }
    );

    subcription.add(webPhoneSessionSub);
    subcription.add(webPhoneStatusSub);
    return () => {
      subcription.unsubscribe();
      localStorage.removeItem("uaConf");
    };
  }, []);

  return (
    <SipContext.Provider
      value={{
        webPhoneService,
        combineSession,
        updateSession,
        status,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
        }}
      >
        <WebPhone onCallEnded={() => {}} />
      </div>
    </SipContext.Provider>
  );
}

storiesOf("WebPhone", module).add(nameof(Default), Default);
