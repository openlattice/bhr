/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { faAngleRight, faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import StyledCard from '../../components/cards/StyledCard';
import * as Routes from '../../core/router/Routes';
import { MEDIA_QUERY_MD } from '../../core/style/Sizes';

/*
 * styled components
 */

const ContainerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
  width: 100%;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    margin-top: 50px;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: #113355;
  text-decoration: none;
  &:hover {
    cursor: pointer;
    text-decoration: none;
    > div {
      border-color: #95aabf;
    }
  }

  &:not(:first-child) {
    margin-top: 25px;
  }
`;

const StyledNavCard = styled(StyledCard)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LinkTextWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const LinkText = styled.span`
  font-size: 14px;
  padding: 0 15px;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    font-size: 18px;
    padding: 0 20px;
  }
`;

// HACK
const WASPC_ORG_IDS = [
  '8c732544-4c51-4129-b326-c87c83ac20a7',
  '9a582e49-2607-4817-9157-c0c484706297',
  'b59565ac-251b-476e-8340-97aa2d9a05ab',
  '11351e88-58e5-422c-b0b8-72171d879e7f',
  '820caca5-55c1-40c9-a537-2b56b3574c78',
  'eb27c39b-8c3e-453e-b20e-f3893df8fa3f',
  'c2f5deaf-4acd-4d16-8b43-5adecdef9a99',
  'b39e5188-8bef-42b7-912c-5ca30c42f118',
  '243d713b-cb34-4eab-998a-492cfb47cd43',
  'c83e7cb9-9a7e-46e0-9bf2-62a0789d1942',
  '1197e2b4-ed0c-4656-9b00-604aeef11287',
  '6b8b9830-794f-44be-be04-1a8e4bfde053',
  '977dd0e1-4dee-4a5a-88ec-b01fd0937b34',
  '6712201d-9fbd-49e1-a4bd-b8a88651ffa7',
  '42802c67-7ff0-4ff0-8d9d-f96f0c8ca942'
];

type Props = {
  orgId :string
}

const HomeContainer = ({ orgId } :Props) => (
  <ContainerWrapper>
    <Content>
      <StyledNavLink to={Routes.CRISIS_PATH}>
        <StyledNavCard>
          <LinkTextWrapper>
            <FontAwesomeIcon icon={faFileAlt} size="2x" />
            <LinkText>Crisis Template</LinkText>
          </LinkTextWrapper>
          <FontAwesomeIcon icon={faAngleRight} size="2x" />
        </StyledNavCard>
      </StyledNavLink>
      {
        WASPC_ORG_IDS.includes(orgId) ? null : (
          <>
            <StyledNavLink to={Routes.BHR_PATH}>
              <StyledNavCard>
                <LinkTextWrapper>
                  <FontAwesomeIcon icon={faFileAlt} size="2x" />
                  <LinkText>Behavioral Health Report</LinkText>
                </LinkTextWrapper>
                <FontAwesomeIcon icon={faAngleRight} size="2x" />
              </StyledNavCard>
            </StyledNavLink>
            <StyledNavLink to={Routes.FOLLOW_UP_PATH}>
              <StyledNavCard>
                <LinkTextWrapper>
                  <FontAwesomeIcon icon={faFileAlt} size="2x" />
                  <LinkText>Follow-Up Report</LinkText>
                </LinkTextWrapper>
                <FontAwesomeIcon icon={faAngleRight} size="2x" />
              </StyledNavCard>
            </StyledNavLink>
          </>
        )
      }
    </Content>
  </ContainerWrapper>
);

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    orgId: state.getIn(['app', 'selectedOrganizationId'], '')
  };
}

export default withRouter(
  connect(mapStateToProps, null)(HomeContainer)
);
