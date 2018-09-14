import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map, List, fromJS, toJS } from 'immutable';

import ReportSearchResult from '../search/ReportSearchResult';
import { getBHRReports } from './ConsumerSummaryActionFactory';
import { REQUEST_STATUSES } from './ConsumerSummaryReducer';
import { APP_TYPES_FQNS, REPORT_INFO } from '../../shared/Consts';
import { ContainerInnerWrapper, ContainerOuterWrapper } from '../../shared/Layout';
import { PAGE_2 } from './ConsumerSummaryConstants';

const {
  BEHAVIORAL_HEALTH_REPORT_FQN
} = APP_TYPES_FQNS;


class ReportsListContainer extends React.Component {
  componentWillMount() {
    this.props.actions.getBHRReports({
      entitySetId: this.props.bhrEntitySetId,
      propertyTypeIds: []
    });
  }

  renderListItems = () => {
    const { reports } = this.props;

    return reports && reports
      .sort((a,b) => {
        const dateA = new Date(a.getIn([REPORT_INFO.DATE_REPORTED_FQN, 0]));
        const dateB = new Date(b.getIn([REPORT_INFO.DATE_REPORTED_FQN, 0]));
        return dateB - dateA;
      })
      .map(
        report => (
          <ReportSearchResult
              searchResult={report}
              onSelectSearchResult={this.props.onSelectSearchResult}
              key={report.getIn(['openlattice.@id', 0])} />
      )
    )
  }

  render() {

    return (
      <ContainerOuterWrapper>
        <ContainerInnerWrapper>
          { this.renderListItems() }
        </ContainerInnerWrapper>
      </ContainerOuterWrapper>
    );
  }
};

function mapStateToProps(state :Map<*, *>) :Object {

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganization']);

  const bhrEntitySetId :string = state.getIn([
    'app',
    BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  const submissionState :number = state.getIn([
    'consumerSummary',
    'submissionState'
  ]);

  const reports = state.getIn([
    'consumerSummary',
    'reports'
  ], List());

  return {
    bhrEntitySetId,
    submissionState,
    reports
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ getBHRReports }, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ReportsListContainer)
);