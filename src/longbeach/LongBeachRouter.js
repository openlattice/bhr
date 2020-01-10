// @flow
import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import LongBeachHome from './LongBeachHome';
import LongBeachPeopleContainer from './people/LongBeachPeopleContainer';
import {
  HOME_PATH,
  LOCATION_PATH,
  PEOPLE_PATH,
  PROFILE_PATH,
  PROVIDER_PATH,
} from './routes';

const LongBeachRouter = () => (
  <Switch>
    <Route exact strict path={HOME_PATH} component={LongBeachHome} />
    <Route path={LOCATION_PATH} component={LongBeachHome} />
    <Route path={PEOPLE_PATH} component={LongBeachPeopleContainer} />
    <Route path={PROFILE_PATH} component={LongBeachHome} />
    <Route path={PROVIDER_PATH} component={LongBeachHome} />
    <Redirect to={HOME_PATH} />
  </Switch>
);

export default LongBeachRouter;
