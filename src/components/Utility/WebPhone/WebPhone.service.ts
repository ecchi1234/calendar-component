import JsSIP, { Socket, WeightedSocket } from "jssip";
import { RTCSession } from "jssip/lib/RTCSession";
import { UA, UAConfiguration } from "jssip/lib/UA";
import React from "react";
import { BehaviorSubject } from "rxjs";
import nameof from "ts-nameof.macro";
import { AudioPlayerService } from "./AudioPlayer.service";

export interface UABasicConf {
  display_name: string;
  uri: string;
  password: string;
  socketUri: string;
  socketTransport: string;
  sockets?: Socket | Socket[] | WeightedSocket[];
  registrar_server: null;
  contact_uri: null;
  authorization_user: null;
  instance_id: null;
  session_timers: boolean;
  use_preloaded_route: boolean;
  pcConfig: RTCConfiguration;
  callstats?: {
    enabled: boolean;
    AppID: string;
    AppSecret: string;
  };
}

export interface CurrentSession {
  value: RTCSession;
}

export interface IncomingSession {
  value: RTCSession;
  seen: boolean;
}

export interface CombineSession {
  session: CurrentSession;
  incomingSessions: IncomingSession[];
}

export interface CombineSessionAction {
  data: CombineSession;
  type: string;
}

export enum Status {
  CONNECTING,
  CONNECTED,
  DISCONECTED,
  REGISTERED,
  UNREGISTERED,
  REGISTRATIONFAILED,
}

export function SessionReducer(
  _preState: CombineSession,
  action: CombineSessionAction
) {
  switch (action.type) {
    case "UPDATE_SESSION":
      return {
        session: action.data.session,
        incomingSessions: action.data.incomingSessions,
      };
  }
}

export interface contextUa {
  webPhoneService: WebPhoneService;
  combineSession: CombineSession;
  updateSession: React.Dispatch<CombineSessionAction>;
  status: Status;
}

export const SipContext = React.createContext<contextUa>(null);

export const defaultUAConf = {
  display_name: null,
  uri: null,
  password: "rangdong",
  socketUri: null,
  socketTransport: "auto",
  sockets: [],
  registrar_server: null,
  contact_uri: null,
  authorization_user: null,
  instance_id: null,
  session_timers: true,
  use_preloaded_route: false,
  pcConfig: {
    rtcpMuxPolicy: "negotiate",
    iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
  },
  callstats: {
    enabled: false,
    AppID: null,
    AppSecret: null,
  },
};

export class WebPhoneService {
  public uaConf: UABasicConf;

  public uaConfRaw: UAConfiguration;

  public ua: UA;

  private combineSession: BehaviorSubject<
    CombineSession
  > = new BehaviorSubject({ session: null, incomingSessions: [] });

  public combineSessionObs = this.combineSession.asObservable();

  private status: BehaviorSubject<Status> = new BehaviorSubject(null);

  public statusObs = this.status.asObservable();

  public validateProp(uaConf: UABasicConf): boolean {
    let isError = true;
    const objectEntries = Object.entries(uaConf);
    for (const [key, value] of objectEntries) {
      if (key === nameof("display_name") && value === null) {
        isError = false;
        throw new Error(`Jssip UA config missing ${key} property`);
      }
      if (key === nameof("uri") && value === null) {
        isError = false;
        throw new Error(`Jssip UA config missing ${key} property`);
      }
      if (key === nameof("socketUri") && value === null) {
        isError = false;
        throw new Error(`Jssip UA config missing ${key} property`);
      }
    }
    return isError;
  }

  public setUAConf(paramConf: UABasicConf) {
    if (paramConf && this.validateProp(paramConf)) {
      this.uaConf = { ...paramConf };
      const socket = new JsSIP.WebSocketInterface(paramConf.socketUri);
      socket["via_transport"] = paramConf.socketTransport;
      if (paramConf.socketTransport !== "auto") {
        socket["via_transport"] = paramConf.socketTransport;
      }
      paramConf.sockets = [socket];
      this.uaConfRaw = { ...paramConf } as UAConfiguration;
    }
  }

  public startUA() {
    if (this.uaConfRaw) {
      try {
        this.ua = new JsSIP.UA(this.uaConfRaw);
        this.uaEventHandler(this.ua);
      } catch (error) {
        throw new Error(error);
      }
      this.ua.start();
    }
  }

  public registerUA() {
    this.ua.register();
  }

  public unregisterUA() {
    this.ua.unregister();
  }

  startCall = (sipAccount: string) => {
    const options = {
      mediaConstraints: {
        audio: true,
        video: false,
      },
    };
    const sessionValue = this.ua.call(sipAccount, options);
    const session: CurrentSession = { value: sessionValue };

    session.value.on("connecting", () => {
      this.combineSession.next({
        session: { value: session.value },
        incomingSessions: [],
      });
    });

    session.value.on("progress", () => {
      AudioPlayerService.play("ringback", true);
    });

    session.value.on("failed", (data) => {
      AudioPlayerService.stop("ringback");
      AudioPlayerService.play("rejected");
      this.combineSession.next({
        session: null,
        incomingSessions: [],
      });
    });

    session.value.on("ended", () => {
      AudioPlayerService.stop("ringback");
      AudioPlayerService.play("rejected");
      this.combineSession.next({
        session: null,
        incomingSessions: [],
      });
    });

    session.value.on("accepted", () => {
      AudioPlayerService.stop("ringback");
      AudioPlayerService.play("answered");
    });
  };

  answerIncoming = (index: number) => {
    const incSess = this.combineSession.getValue().incomingSessions;
    const session = incSess.filter((_, i) => i === index);
    if (session.length > 0) {
      session[0].value.answer({
        mediaConstraints: {
          audio: true,
          video: false,
        },
      });
    } else return;
    // terminate all other sessions
    incSess.forEach((s, i) => {
      if (i !== index) s.value.terminate();
    });
    // update combine session
    this.combineSession.next({
      session: { value: session[0].value },
      incomingSessions: [],
    });
  };

  rejectIncoming = (index: number) => {
    const incSess = this.combineSession.getValue().incomingSessions;
    const session = incSess[index];
    session.seen = true;
    session.value.terminate();
  };

  private uaEventHandler = (ua) => {
    ua.on("connecting", () => {
      //code for connecting status
      this.status.next(Status.CONNECTING);
    });

    ua.on("connected", () => {
      //code for connected status
      this.status.next(Status.CONNECTED);
    });

    ua.on("disconnected", () => {
      //code for disconnected status
      this.status.next(Status.DISCONECTED);
    });

    ua.on("registered", () => {
      //code for registered status
      this.status.next(Status.REGISTERED);
    });

    ua.on("unregistered", () => {
      //code for unregistered status
      this.status.next(Status.UNREGISTERED);
    });

    ua.on("registrationFailed", (data) => {
      //code for registrationFailed status
      this.status.next(Status.REGISTRATIONFAILED);
    });

    ua.on("newRTCSession", (data) => {
      if (data.originator === "local") return;

      let sessIndex = 0;
      const session: IncomingSession = { value: data.session, seen: false };

      if (this.combineSession.getValue().session) {
        session.value.terminate({
          status_code: 486,
          reason_phrase: "Busy Here",
        });
        return;
      }
      AudioPlayerService.play("ringing", true);
      const currentIncSess = this.combineSession.getValue().incomingSessions;
      this.combineSession.next({
        session: null,
        incomingSessions: [...currentIncSess, session],
      });
      sessIndex = currentIncSess.length;

      session.value.on("failed", () => {
        if (session.seen) console.log("Call ended");
        else console.log("Call missed");

        AudioPlayerService.stop("ringing");
        AudioPlayerService.play("rejected");

        // update combine session
        const incSess = this.combineSession.getValue().incomingSessions;

        this.combineSession.next({
          session: null,
          incomingSessions: incSess.filter((_, i) => i !== sessIndex),
        });
      });

      session.value.on("ended", () => {
        AudioPlayerService.play("rejected");
        this.combineSession.next({
          session: null,
          incomingSessions: [],
        });
      });

      session.value.on("accepted", () => {
        AudioPlayerService.stop("ringing");
        AudioPlayerService.play("answered");
        // let answer function handle state
      });
    });
  };
}

export const webPhoneService = new WebPhoneService();
