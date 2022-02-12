import React from "react";
import { Switch } from "react-router-dom";
import {
  LUCKY_DRAW_MASTER_ROUTE,
  LUCKY_DRAW_PLAY_HISTORY_ROUTE,
  LUCKY_DRAW_PLAY_ZONE_ROUTE,
} from "config/route-consts";
import { ProtectedRoute, useCheckAuthorized } from "config/protected-route";

import "./LuckyDrawView.scss";
import LuckyDrawMaster from "./LuckyDrawMaster/LuckyDrawMaster";
import LuckyDrawPlayZone from "./LuckyDrawMaster/LuckyDrawPlayZone";
import LuckyDrawPlayHistory from "./LuckyDrawMaster/LuckyDrawPlayHistory";

function LuckyDrawView() {
  const { auth } = useCheckAuthorized();
  return (
    <Switch>
      <ProtectedRoute
        path={LUCKY_DRAW_MASTER_ROUTE}
        key={LUCKY_DRAW_MASTER_ROUTE}
        component={LuckyDrawMaster}
        auth={auth(LUCKY_DRAW_MASTER_ROUTE)}
      />
      <ProtectedRoute
        path={LUCKY_DRAW_PLAY_ZONE_ROUTE}
        key={LUCKY_DRAW_PLAY_ZONE_ROUTE}
        component={LuckyDrawPlayZone}
        auth={auth(LUCKY_DRAW_PLAY_ZONE_ROUTE)}
      />
      <ProtectedRoute
        path={LUCKY_DRAW_PLAY_HISTORY_ROUTE}
        key={LUCKY_DRAW_PLAY_HISTORY_ROUTE}
        component={LuckyDrawPlayHistory}
        auth={auth(LUCKY_DRAW_PLAY_HISTORY_ROUTE)}
      />
    </Switch>
  );
}

export { LuckyDrawMaster };
export default LuckyDrawView;
