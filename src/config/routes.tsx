import {
  DIRECT_SALES_ORDER_ROUTE,
  LUCKY_DRAW_ROUTE,
} from "config/route-consts";
import DirectSalesOrderView from "views/DirectSalesOrder/DirectSalesOrderView";
// import AppUserView from "views/AppUserView/AppUserView";

// import { BRAND_ROUTE } from "config/route-consts";
// import BrandView from "views/BrandView/BrandView";

// import { CATEGORY_ROUTE } from "config/route-consts";
// import CategoryTreeView from "views/CategoryTreeView/CategoryTreeView";
import LuckyDrawView from "views/LuckyDraw/LuckyDrawView";

export interface Route {
  path: string;
  component: () => JSX.Element;
}

export const routes: Route[] = [
  // {
  //   path: APP_USER_ROUTE,
  //   component: AppUserView,
  // },

  // {
  //   path: BRAND_ROUTE,
  //   component: BrandView,
  // },

  {
    path: LUCKY_DRAW_ROUTE,
    component: LuckyDrawView,
  },

  { path: DIRECT_SALES_ORDER_ROUTE, component: DirectSalesOrderView },
];
