import { join } from "path";

export const ROOT_ROUTE: string = process.env.PUBLIC_URL;

export const LOGIN_ROUTE: string = ROOT_ROUTE + "/login"; // login route, dont delete
export const FORBIDENT_ROUTE: string = "/403"; // forbident route, add project prefix if necessary
export const NOT_FOUND_ROUTE: string = "/404"; // notFounded route, add project prefix if necessary

export const APP_USER_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/app-user"
  : "/app-user";
export const APP_USER_MASTER_ROUTE: string = join(
  APP_USER_ROUTE,
  "app-user-master"
);

export const BRAND_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/brand"
  : "/brand";
export const BRAND_MASTER_ROUTE: string = join(BRAND_ROUTE, "brand-master");

export const CATEGORY_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/category"
  : "/category";
export const CATEGORY_MASTER_ROUTE: string = join(
  CATEGORY_ROUTE,
  "category-master"
);

export const LUCKY_DRAW_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/lucky-draw"
  : "/lucky-draw";
export const LUCKY_DRAW_MASTER_ROUTE: string = join(
  LUCKY_DRAW_ROUTE,
  "lucky-draw-master"
);
export const LUCKY_DRAW_PLAY_ZONE_ROUTE: string = join(
  LUCKY_DRAW_ROUTE,
  "lucky-draw-gamification"
);
export const LUCKY_DRAW_PLAY_HISTORY_ROUTE: string = join(
  LUCKY_DRAW_ROUTE,
  "lucky-draw-history"
);

export const PROFILE_ROUTE: string = "/portal/profile";

export const CHANGE_PASSWORD_ROUTE: string = "/portal/profile/change-password";

export const USER_NOTIFICATION_ROUTE: string = "/portal/user-notification";

export const DIRECT_SALES_ORDER_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/direct-sales-order"
  : "/direct-sales-order";
export const DIRECT_SALES_ORDER_MASTER_ROUTE: string = join(
  DIRECT_SALES_ORDER_ROUTE,
  "direct-sales-order-master"
);
export const DIRECT_SALES_ORDER_DETAIL_ROUTE: string = join(
  DIRECT_SALES_ORDER_ROUTE,
  "direct-sales-order-detail"
);

export const DIRECT_SALES_ORDER_PREVIEW_ROUTE: string = join(
  DIRECT_SALES_ORDER_ROUTE,
  "direct-sales-order-preview"
);

export const DIRECT_SALES_ORDER_APPROVE_ROUTE: string = join(
  DIRECT_SALES_ORDER_ROUTE,
  "direct-sales-order-approve"
);

export const USER_DASHBOARD_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/dashboard/user"
  : "/dashboard/user";
