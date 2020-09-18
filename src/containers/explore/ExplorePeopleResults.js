// @flow
import React, { useEffect, useReducer, useState } from 'react';

import { List } from 'immutable';
import {
  PaginationToolbar,
  SearchResults,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import { explorePeople } from './ExploreActions';
import { ExploreResultsWrapper } from './styled';

import Accordion from '../../components/accordion';
import PersonResult from '../people/PersonResult';
import ReportSelectionModal from '../people/ReportSelectionModal';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const { PEOPLE_FQN } = APP_TYPES_FQNS;

const MAX_HITS = 10;
const INITIAL_STATE = {
  selectedPerson: undefined,
  isVisible: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'open': {
      return {
        selectedPerson: action.payload,
        isVisible: true
      };
    }
    case 'close':
      return INITIAL_STATE;
    default:
      return state;
  }
};

const ExplorePeopleResults = () => {
  const dispatch = useDispatch();
  const searchResults = useSelector((store) => store.getIn(['explore', PEOPLE_FQN, 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn(['explore', PEOPLE_FQN, 'totalHits'], 0));
  const searchTerm = useSelector((store) => store.getIn(['explore', PEOPLE_FQN, 'searchTerm']));
  const fetchState = useSelector((store) => store.getIn(['explore', PEOPLE_FQN, 'fetchState']));
  const [page, setPage] = useState(0);
  const [modalState, modalDispatch] = useReducer(reducer, INITIAL_STATE);

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const dispatchSearch = (start = 0) => {
    if (searchTerm.trim().length) {
      dispatch(explorePeople({
        searchTerm: searchTerm.trim(),
        start,
        maxHits: MAX_HITS
      }));
    }
  };

  const onPageChange = ({ page: newPage, start }) => {
    dispatchSearch(start);
    setPage(newPage);
  };

  const handleOpenReportSelection = (result) => {
    modalDispatch({ type: 'open', payload: result });
  };

  const handleCloseReportSelection = () => {
    modalDispatch({ type: 'close' });
  };

  const caption = totalHits ? `(${totalHits} results)` : '';

  if (hasSearched) {
    return (
      <div>
        <Accordion>
          <div caption={caption} headline="People" defaultOpen>
            <ExploreResultsWrapper>
              <SearchResults
                  hasSearched={hasSearched}
                  isLoading={isLoading}
                  onResultClick={handleOpenReportSelection}
                  resultComponent={PersonResult}
                  results={searchResults} />
              <PaginationToolbar
                  page={page}
                  count={totalHits}
                  onPageChange={onPageChange}
                  rowsPerPage={MAX_HITS} />
            </ExploreResultsWrapper>
            <ReportSelectionModal
                selectedPerson={modalState.selectedPerson}
                isVisible={modalState.isVisible}
                onClose={handleCloseReportSelection} />
          </div>
        </Accordion>
      </div>
    );
  }
  return null;
};

export default ExplorePeopleResults;
