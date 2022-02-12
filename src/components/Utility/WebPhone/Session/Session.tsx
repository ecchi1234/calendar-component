import React, { Reducer } from "react";
import { Button } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { WebPhoneComponent } from "../WebPhone";
import callIcon from "../../../../assets/images/web-phone/phone-session.svg";
import "./Session.scss";
import { CurrentSession } from "../WebPhone.service";

export interface SessionProps {
  session: CurrentSession;
  onHide: () => void;
  onCallEnded?: () => void;
}

export enum SessionState {
  PROGRESS,
  ACCEPTED,
  FAILED,
  ENDED,
}

interface SessionAction {
  type: string;
  data: SessionState;
}

function sessionReducer(
  _state: SessionState,
  action: SessionAction
): SessionState {
  switch (action.type) {
    case "UPDATE_STATE":
      return action.data;
  }
  return;
}

export function Session(props: SessionProps) {
  const _mounted = React.useRef(false);
  const { session, onHide, onCallEnded } = props;

  const { name, uri } = React.useMemo(() => {
    const displayName = session.value.remote_identity.display_name;
    return {
      name: displayName ? displayName : "No Name", // TODO: get name from API or props
      uri: session.value.remote_identity.uri.toString(),
    };
  }, [session]);

  // Call timer stuff
  const [timer, setTimer] = React.useState<number>(0);
  const [timerStarted, setTimerStarted] = React.useState<boolean>(false);

  const [sessionState, dispatch] = React.useReducer<
    Reducer<SessionState, SessionAction>
  >(sessionReducer, null);

  const audioRef: React.LegacyRef<HTMLAudioElement> = React.useRef<
    HTMLAudioElement
  >();

  const handleRemoteStream = React.useCallback((stream: MediaStream) => {
    // Display remote stream
    audioRef.current.srcObject = stream;

    stream.addEventListener("addtrack", (event) => {
      const track = event.track;

      if (audioRef.current.srcObject !== stream) return;

      // Refresh remote audio
      audioRef.current.srcObject = stream;

      track.addEventListener("ended", () => {});
    });

    stream.addEventListener("removetrack", () => {
      if (audioRef.current.srcObject !== stream) return;

      // Refresh remote video
      audioRef.current.srcObject = stream;
    });
  }, []);

  function handleHangUp() {
    session.value.terminate();
  }

  const handleCallEnded = React.useCallback(() => {
    if (typeof onCallEnded === "function") onCallEnded();
  }, [onCallEnded]);

  function displayTime(time: number) {
    return new Date(time * 1000).toISOString().substr(11, 8);
  }

  React.useEffect(() => {
    if (timerStarted) {
      const interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [timerStarted]);

  React.useEffect(() => {
    _mounted.current = true;

    const peerconnection = session.value.connection;
    const remoteStream = peerconnection.getRemoteStreams()[0];

    if (remoteStream) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play();
    }

    // For incoming call
    if (session.value.isEstablished()) {
      setTimeout(() => {
        if (!timerStarted) setTimerStarted(true);
        if (!_mounted.current) return;
      });
    }

    // For outgoing call
    session.value.on("progress", (data) => {
      if (!_mounted.current) return;
      dispatch({
        type: "UPDATE_STATE",
        data: SessionState.PROGRESS,
      });
    });

    session.value.on("accepted", (data) => {
      if (!_mounted.current) return;
      if (!timerStarted) setTimerStarted(true);
      dispatch({
        type: "UPDATE_STATE",
        data: SessionState.ACCEPTED,
      });
    });

    session.value.on("failed", (data) => {
      if (!_mounted.current) return;
      dispatch({
        type: "UPDATE_STATE",
        data: SessionState.FAILED,
      });
    });

    session.value.on("ended", (data) => {
      dispatch({
        type: "UPDATE_STATE",
        data: SessionState.ENDED,
      });
      // if (!_mounted.current) return;
    });

    peerconnection.addEventListener("addstream", (event: any) => {
      handleRemoteStream(event.stream as MediaStream);
    });
  }, [handleRemoteStream, handleCallEnded, session, timerStarted]);

  React.useEffect(() => {
    if (sessionState === SessionState.ENDED) handleCallEnded();
  }, [handleCallEnded, sessionState]);

  // Terminate all connections before unloading
  const onUnload = React.useCallback(() => {
    session.value.terminate();
  }, [session]);

  window.onbeforeunload = function(e) {
    return onUnload();
  };

  React.useEffect(() => {
    return () => {
      _mounted.current = false;
    };
  }, []);

  return (
    <>
      <WebPhoneComponent
        icon={callIcon}
        title="Đang trong cuộc gọi"
        classNames="session"
        onHide={onHide}
      >
        <audio ref={audioRef} style={{ display: "none" }}></audio>

        <div className="session__header">
          <img
            src="https://media.discordapp.net/attachments/663753852184428596/847406738138595348/7ab2cd69-80fe-4106-ba8d-218d78b131d4.png"
            alt=""
          />
          <div className="session__info">
            <p className="session__info__name">{name}</p>
            <p className="session__info__uri">{uri}</p>
          </div>
          <div className="session__status">
            {timer !== 0 ? (
              <p>{displayTime(timer)}</p>
            ) : sessionState === SessionState.PROGRESS ? (
              <p>Đang rung</p>
            ) : sessionState === SessionState.ACCEPTED ? (
              <p>Kết nối</p>
            ) : sessionState === SessionState.ENDED ? (
              <p>Kết thúc</p>
            ) : sessionState === SessionState.FAILED ? (
              <p>Thất bại</p>
            ) : (
              <p>Đang gọi</p>
            )}
          </div>
        </div>
        <div className="session__note">
          <TextArea />
        </div>
        <div className="session__action">
          <Button type="primary" danger onClick={handleHangUp}>
            Dừng cuộc gọi
          </Button>
        </div>
      </WebPhoneComponent>
    </>
  );
}
