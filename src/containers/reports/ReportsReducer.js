/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_REPORT,
  deleteReport,
  getReport,
  updateReport,
  getReportsByDateRange,
} from './ReportsActions';

const INITIAL_STATE :Map<*, *> = fromJS({
  deleteState: RequestStates.STANDBY,
  fetchState: RequestStates.STANDBY,
  lastUpdatedStaff: Map(),
  reportsByDateRange: List(),
  submittedStaff: Map(),
  updateState: RequestStates.STANDBY,
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case CLEAR_REPORT: {
      return INITIAL_STATE;
    }

    case getReport.case(action.type): {
      return getReport.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => {
          const { submitted, lastUpdated } = action.value;
          return state
            .set('fetchState', RequestStates.SUCCESS)
            .set('submittedStaff', submitted)
            .set('lastUpdatedStaff', lastUpdated);
        },
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case getReportsByDateRange.case(action.type): {
      return getReportsByDateRange.reducer(state, (action :any), {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('reportsByDateRange', action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case updateReport.case(action.type): {
      return updateReport.reducer(state, action, {
        REQUEST: () => state.set('updateState', RequestStates.PENDING),
        SUCCESS: () => state.set('updateState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.FAILURE),
      });
    }

    case deleteReport.case(action.type): {
      return deleteReport.reducer(state, action, {
        REQUEST: () => state.set('deleteState', RequestStates.PENDING),
        SUCCESS: () => state.set('deleteState', RequestStates.SUCCESS),
        FAILURE: () => state.set('deleteState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
}
