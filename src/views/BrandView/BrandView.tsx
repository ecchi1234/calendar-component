import React from 'react';
import { Switch } from 'react-router-dom';
import { BRAND_MASTER_ROUTE,  } from 'config/route-consts';
import { ProtectedRoute, useCheckAuthorized } from 'config/protected-route';

import './BrandView.scss';
import BrandMaster from './BrandMaster/BrandMaster';

function BrandView() {
  const { auth } = useCheckAuthorized();
  return (
    <Switch>
        <ProtectedRoute path={ BRAND_MASTER_ROUTE } key={ BRAND_MASTER_ROUTE } component={ BrandMaster } auth={auth(BRAND_MASTER_ROUTE)} />
    </Switch>
  );
}

export { BrandMaster,  };
export default BrandView;
