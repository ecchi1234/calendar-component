import React, { ReactNode } from "react";
import {
  DIRECT_SALES_ORDER_MASTER_ROUTE,
  LUCKY_DRAW_MASTER_ROUTE,
  // USER_DASHBOARD_ROUTE,
} from "config/route-consts";

// import { BRAND_MASTER_ROUTE } from "config/route-consts";

// import { CATEGORY_MASTER_ROUTE } from "config/route-consts";

import game from "../assets/images/icon/game.svg";
import { appTranslation } from "app/app-translation";

export interface MenuItem {
  title?: string;
  icon?: ReactNode;
  type?: string;
  badge?: string;
  badgetxt?: string;
  active?: boolean;
  path?: string;
  children?: MenuItem[];
  bookmark?: boolean;
  isShow?: boolean;
}

const translate = appTranslation.translate;

export interface Menu {
  menutitle?: string;
  menucontent?: string;
  isShow?: boolean;
  Items?: MenuItem[];
  checkVisible?: (mapper: Record<string, number>) => boolean;
}

export const menu: Menu[] = [
  {
    menutitle: "Side Bar Menu",
    menucontent: "Content",
    Items: [
      // {
      //   title: translate("menu.dashboards"),
      //   path: USER_DASHBOARD_ROUTE,
      //   icon: (
      //     <img
      //       alt=""
      //       src={require("../assets/images/icon/home.svg")}
      //       style={{ marginRight: 10 }}
      //     />
      //   ),
      //   type: "link",
      //   active: false,
      // },

      {
        title: translate("menu.saleOrders"),
        path: DIRECT_SALES_ORDER_MASTER_ROUTE,
        icon: (
          <img
            alt=""
            src={require("../assets/images/icon/shopping-cart.svg")}
            style={{ marginRight: 10 }}
          />
        ),
        type: "link",
        active: false,
      },

      {
        title: translate("menu.luckyDraws"),
        path: LUCKY_DRAW_MASTER_ROUTE,
        icon: <img alt="" src={game} style={{ marginRight: 10 }} />,
        type: "link",
        active: false,
      },
    ],
  },
];
