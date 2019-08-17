// @flow

import React from 'react';
import styled from 'styled-components';
import {
  Card,
  CardSegment,
  CardHeader,
} from 'lattice-ui-kit';
import { Map } from 'immutable';
import {
  faHome,
  faEdit,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import * as FQN from '../../../edm/DataModelFqns';
import LinkButton from '../../buttons/LinkButton';
import { BASIC_PATH } from '../../../core/router/Routes';
import { formatCityStateZip } from './AddressUtils';
import Address from './Address';

const IconWrapper = styled.span`
  vertical-align: middle;
  margin-right: 10px;
`;

const H1 = styled.h1`
  display: flex;
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  align-items: center;
`;

const EditButton = styled(LinkButton)`
  margin-left: auto;
  padding: 2px;
`;

type Props = {
  address :Map;
  isLoading :boolean;
  match :Match;
};

const AddressCard = (props :Props) => {

  const { address, isLoading, match } = props;

  const name = address.getIn([FQN.LOCATION_NAME_FQN, 0]);
  const street = address.getIn([FQN.LOCATION_STREET_FQN, 0]);
  const line2 = address.getIn([FQN.LOCATION_ADDRESS_LINE_2_FQN, 0]);
  const city = address.getIn([FQN.LOCATION_CITY_FQN, 0]);
  const state = address.getIn([FQN.LOCATION_STATE_FQN, 0]);
  const zip = address.getIn([FQN.LOCATION_ZIP_FQN, 0]);
  const cityStateZip = formatCityStateZip(city, state, zip);

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faHome} />
          </IconWrapper>
          Address
          <EditButton mode="primary" to={`${match.url}${BASIC_PATH}`}>
            <FontAwesomeIcon icon={faEdit} fixedWidth />
          </EditButton>
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        <Address
            cityStateZip={cityStateZip}
            isLoading={isLoading}
            line2={line2}
            name={name}
            street={street} />
      </CardSegment>
    </Card>
  );

};

export default withRouter(AddressCard);