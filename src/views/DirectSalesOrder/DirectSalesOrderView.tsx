import React from "react";
import { Switch } from "react-router-dom";
import {
  DIRECT_SALES_ORDER_APPROVE_ROUTE,
  DIRECT_SALES_ORDER_DETAIL_ROUTE,
  DIRECT_SALES_ORDER_MASTER_ROUTE,
  DIRECT_SALES_ORDER_PREVIEW_ROUTE,
} from "config/route-consts";
import { ProtectedRoute, useCheckAuthorized } from "config/protected-route";

import "./DirectSalesOrderView.scss";
import DirectSalesOrderMaster from "./DirectSalesOrderMaster/DirectSalesOrderMaster";
import DirectSalesOrderDetail from "./DirectSalesOrderDetail/DirectSalesOrderDetail";
import DirectSalesOrderPreview from "./DirectSalesOrderMaster/DirectSalesOrderPreview";
import DirectSalesOrderApprovePreview from "./DirectSalesOrderMaster/DirectSalesOrderApprovePreview";

function DirectSalesOrderView() {
  const { auth } = useCheckAuthorized();
  return (
    <Switch>
      <ProtectedRoute
        path={DIRECT_SALES_ORDER_MASTER_ROUTE}
        key={DIRECT_SALES_ORDER_MASTER_ROUTE}
        component={DirectSalesOrderMaster}
        auth={auth(DIRECT_SALES_ORDER_MASTER_ROUTE)}
      />

      <ProtectedRoute
        path={DIRECT_SALES_ORDER_DETAIL_ROUTE}
        key={DIRECT_SALES_ORDER_DETAIL_ROUTE}
        component={DirectSalesOrderDetail}
        auth={auth(DIRECT_SALES_ORDER_DETAIL_ROUTE)}
      />

      <ProtectedRoute
        path={DIRECT_SALES_ORDER_PREVIEW_ROUTE}
        key={DIRECT_SALES_ORDER_PREVIEW_ROUTE}
        component={DirectSalesOrderPreview}
        auth={auth(DIRECT_SALES_ORDER_PREVIEW_ROUTE)}
      />

      <ProtectedRoute
        path={DIRECT_SALES_ORDER_APPROVE_ROUTE}
        key={DIRECT_SALES_ORDER_APPROVE_ROUTE}
        component={DirectSalesOrderApprovePreview}
        auth={auth(DIRECT_SALES_ORDER_APPROVE_ROUTE)}
      />
    </Switch>
  );
}

export { DirectSalesOrderMaster, DirectSalesOrderDetail };
export default DirectSalesOrderView;
