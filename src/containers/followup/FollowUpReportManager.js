/*
 * @flow
 */

import React from 'react';

import { Map } from 'immutable';
import { connect } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  withRouter
} from 'react-router';
import { bindActionCreators } from 'redux';
import type { RouterHistory } from 'react-router';

import StyledCard from '../../components/cards/StyledCard';
import ConsumerSearchContainer from './ConsumerSearchContainer';
import ConsumerNeighborsSearchContainer from './ConsumerNeighborsSearchContainer';
import FollowUpReportContainer from './FollowUpReportContainer';

import { ContainerInnerWrapper, ContainerOuterWrapper } from '../../shared/Layout';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { submitFollowUpReport } from './FollowUpReportActionFactory';
import { SUBMISSION_STATES } from './FollowUpReportReducer';
import {
  PAGE_1,
  PAGE_2,
  PAGE_3,
} from './FollowUpReportConstants';

const {
  APPEARS_IN_FQN,
  FOLLOW_UP_REPORT_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

/*
 * types
 */

type Props = {
  actions :{
    submitFollowUpReport :RequestSequence;
  };
  app :Map<*, *>;
  entitySetIds :{[key :string] :string};
  history :RouterHistory;
  submissionState :number;
};

type State = {
  selectedConsumer :Map<*, *>;
  selectedConsumerNeighbor :Map<*, *>;
};

class FollowUpReportManager extends React.Component<Props, State> {

  constructor(props :Props) {

    super(props);

    this.state = {
      selectedConsumer: Map(),
      selectedConsumerNeighbor: Map()
    };
  }

  componentWillReceiveProps(nextProps :Props) {

    const { submissionState } = this.props;
    if (submissionState === SUBMISSION_STATES.PRE_SUBMIT
        && nextProps.submissionState === SUBMISSION_STATES.IS_SUBMITTING
    ) {
      this.setState({
        selectedConsumer: Map(),
        selectedConsumerNeighbor: Map()
      });
    }
  }

  shouldComponentUpdate(nextProps :Props) {

    // only thing that *should* have changed is "submissionState", which means we don't want to rerender
    // this will probably cause bugs...
    const { submissionState } = this.props;
    if (submissionState === SUBMISSION_STATES.PRE_SUBMIT
        && nextProps.submissionState === SUBMISSION_STATES.IS_SUBMITTING) {
      return false;
    }

    return true;
  }

  handleOnCancel = () => {

    const { history } = this.props;
    history.push(PAGE_1);
  }

  handleOnSelectConsumerSearchResult = (searchResult :Map<*, *>) => {

    const { history } = this.props;
    // TODO: routing between pages needs more thought
    this.setState(
      {
        selectedConsumer: searchResult
      },
      () => {
        history.push(PAGE_2);
      }
    );
  }

  handleOnSelectConsumerNeighborSearchResult = (searchResult :Map<*, *>) => {

    // TODO: routing between pages needs more thought
    const { history } = this.props;
    this.setState(
      {
        selectedConsumerNeighbor: searchResult
      },
      () => {
        history.push(PAGE_3);
      }
    );
  }

  handleOnSubmit = (reportValues :Object) => {

    // TODO: error handling

    const { actions, app } = this.props;
    const { selectedConsumer, selectedConsumerNeighbor } = this.state;
    actions.submitFollowUpReport({
      app,
      consumer: selectedConsumer,
      neighbor: selectedConsumerNeighbor,
      reportInfo: reportValues
    });
  }

  renderConsumerSearchContainer = () => {

    const { entitySetIds } = this.props;
    // using the wrappers here is not the right thing to do
    return (
      <ContainerOuterWrapper>
        <ContainerInnerWrapper>
          <StyledCard>
            <ConsumerSearchContainer
                peopleEntitySetId={entitySetIds[PEOPLE_FQN.toString()]}
                onSelectSearchResult={this.handleOnSelectConsumerSearchResult} />
          </StyledCard>
        </ContainerInnerWrapper>
      </ContainerOuterWrapper>
    );
  }

  renderConsumerNeighborsSearchContainer = () => {

    const { entitySetIds, submissionState } = this.props;
    const { selectedConsumer } = this.state;

    if (
      (!selectedConsumer || selectedConsumer.isEmpty())
      && submissionState === SUBMISSION_STATES.PRE_SUBMIT
    ) {
      // TODO: routing between pages needs more thought
      return (
        <Redirect to={PAGE_1} />
      );
    }

    return (
      <ConsumerNeighborsSearchContainer
          consumer={selectedConsumer}
          peopleEntitySetId={entitySetIds[PEOPLE_FQN.toString()]}
          onSelectSearchResult={this.handleOnSelectConsumerNeighborSearchResult} />
    );
  }

  renderFollowUpReportContainer = () => {

    const { entitySetIds, submissionState } = this.props;
    const { selectedConsumer, selectedConsumerNeighbor } = this.state;

    if (
      (
        !selectedConsumer
        || selectedConsumer.isEmpty()
        || !selectedConsumerNeighbor
        || selectedConsumerNeighbor.isEmpty()
      )
      && submissionState === SUBMISSION_STATES.PRE_SUBMIT
    ) {
      // TODO: routing between pages needs more thought
      return (
        <Redirect to={PAGE_1} />
      );
    }

    return (
      <FollowUpReportContainer
          consumer={selectedConsumer}
          consumerNeighbor={selectedConsumerNeighbor}
          peopleEntitySetId={entitySetIds[PEOPLE_FQN.toString()]}
          onCancel={this.handleOnCancel}
          onSubmit={this.handleOnSubmit} />
    );
  }

  render() {

    return (
      <Switch>
        <Route path={PAGE_1} render={this.renderConsumerSearchContainer} />
        <Route path={PAGE_2} render={this.renderConsumerNeighborsSearchContainer} />
        <Route path={PAGE_3} render={this.renderFollowUpReportContainer} />
        <Redirect to={PAGE_1} />
      </Switch>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganizationId']);

  const appearsInEntitySetId :string = state.getIn([
    'app',
    APPEARS_IN_FQN.toString(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  const peopleEntitySetId :string = state.getIn([
    'app',
    PEOPLE_FQN.toString(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  const reportEntitySetId :string = state.getIn([
    'app',
    FOLLOW_UP_REPORT_FQN.toString(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  return {
    app: state.get('app', Map()),
    entitySetIds: {
      [APPEARS_IN_FQN.toString()]: appearsInEntitySetId,
      [PEOPLE_FQN.toString()]: peopleEntitySetId,
      [FOLLOW_UP_REPORT_FQN.toString()]: reportEntitySetId
    },
    submissionState: state.getIn(['followUpReport', 'submissionState'])
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ submitFollowUpReport }, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FollowUpReportManager)
);
