// @flow
import React from 'react';
import styled from 'styled-components';
import {
  Card,
  CardHeader,
  CardSegment,
  IconSplash,
  Spinner,
} from 'lattice-ui-kit';
import { Constants } from 'lattice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardListCheck, faEdit } from '@fortawesome/pro-solid-svg-icons';
import { List } from 'immutable';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import LinkButton from '../../../components/buttons/LinkButton';
import { RESPONSE_PLAN_PATH } from '../../../core/router/Routes';
import { TITLE_FQN, DESCRIPTION_FQN, INDEX_FQN } from '../../../edm/DataModelFqns';
import InteractionStrategy from '../../../components/premium/responseplan/InteractionStrategy';

const { OPENLATTICE_ID_FQN } = Constants;

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
  isLoading ? :boolean;
  interactionStrategies :List;
  match :Match;
};

const ResponsePlanCard = ({ isLoading, interactionStrategies, match } :Props) => (
  <Card>
    <CardHeader mode="primary" padding="sm">
      <H1>
        <IconWrapper>
          <FontAwesomeIcon icon={faClipboardListCheck} fixedWidth />
        </IconWrapper>
        Response Plan
        <EditButton mode="primary" to={`${match.url}${RESPONSE_PLAN_PATH}`}>
          <FontAwesomeIcon icon={faEdit} fixedWidth />
        </EditButton>
      </H1>
    </CardHeader>
    <CardSegment vertical padding="sm">
      { isLoading && <Spinner size="2x" /> }
      { (!isLoading && interactionStrategies.isEmpty()) && <IconSplash caption="No response plan." /> }
      { (!isLoading && !interactionStrategies.isEmpty())
        && (
          interactionStrategies
            .sort((stratA, stratB) => {
              const indexA = stratA.getIn([INDEX_FQN, 0]);
              const indexB = stratB.getIn([INDEX_FQN, 0]);

              if (typeof indexA === 'number' && typeof indexB === 'number') {
                return indexA - indexB;
              }
              return 1;
            })
            .map((strategy, step) => {
              const title = strategy.getIn([TITLE_FQN, 0]) || '';
              const description = strategy.getIn([DESCRIPTION_FQN, 0]) || '';
              const ekid = strategy.getIn([OPENLATTICE_ID_FQN, 0]);
              return <InteractionStrategy key={ekid} description={description} index={step + 1} title={title} />;
            })
        )
      }
    </CardSegment>
  </Card>
);

ResponsePlanCard.defaultProps = {
  isLoading: false,
};

export default withRouter(ResponsePlanCard);
