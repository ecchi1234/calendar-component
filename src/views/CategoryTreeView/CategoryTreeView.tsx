import React from 'react';
import { Switch } from 'react-router-dom';
import { CATEGORY_MASTER_ROUTE,  } from 'config/route-consts';
import { ProtectedRoute, useCheckAuthorized } from 'config/protected-route';

import './CategoryView.scss';
import CategoryTreeMaster from './CategoryTreeMaster/CategoryTreeMaster';

function CategoryTreeView() {
  const { auth } = useCheckAuthorized();
  return (
        <Switch>
            <ProtectedRoute path={ CATEGORY_MASTER_ROUTE } key={ CATEGORY_MASTER_ROUTE } component={  CategoryTreeMaster } auth={auth(CATEGORY_MASTER_ROUTE)}/>
        </Switch>
  );
}

export { CategoryTreeMaster,  };
export default CategoryTreeView;
