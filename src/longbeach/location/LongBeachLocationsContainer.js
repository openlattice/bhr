// @flow

import React, {
  useCallback,
  useEffect,
  useReducer,
  useState
} from 'react';

import isPlainObject from 'lodash/isPlainObject';
import styled from 'styled-components';
import { faLocation } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Card,
  CardStack,
  IconButton,
  PaginationToolbar,
  SearchResults,
  Select,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import LongBeachLocationResult from './LongBeachLocationResult';
import { getGeoOptions, searchLBLocations } from './LongBeachLocationsActions';

import { usePosition, useTimeout } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { isNonEmptyString } from '../../utils/LangUtils';
import { FlexRow, ResultSegment } from '../styled';

const MAX_HITS = 20;
const INITIAL_STATE = {
  page: 0,
  start: 0,
  selectedOption: undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'location':
      return { page: 0, start: 0, selectedOption: action.payload };
    case 'page':
      return { ...state, page: action.payload };
    default:
      throw new Error();
  }
};

const LocationIcon = <FontAwesomeIcon icon={faLocation} fixedWidth />;
const MarginButton = styled(IconButton)`
  margin-left: 5px;
`;

const LongBeachLocationContainer = () => {

  const searchResults = useSelector((store) => store.getIn(['longBeach', 'locations', 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn(['longBeach', 'locations', 'totalHits'], 0));
  const fetchState = useSelector((store) => store.getIn(['longBeach', 'locations', 'fetchState']));
  const optionsFetchState = useSelector((store) => store.getIn(['longBeach', 'locations', 'options', 'fetchState']));
  const options = useSelector((store) => store.getIn(['longBeach', 'locations', 'options', 'data']));
  const dispatch = useDispatch();
  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);

  const { page, start, selectedOption } = state;
  const [address, setAddress] = useState();
  const position = usePosition();

  const fetchGeoOptions = useCallback(() => {
    if (isNonEmptyString(address)) {
      dispatch(getGeoOptions(address));
    }
  }, [dispatch, address]);

  useTimeout(fetchGeoOptions, 300);

  useEffect(() => {
    const newSearchInputs = Map({
      selectedOption
    });
    const hasValues = isPlainObject(selectedOption);

    if (hasValues) {
      dispatch(searchLBLocations({
        searchInputs: newSearchInputs,
        start,
        maxHits: MAX_HITS
      }));
    }
  }, [dispatch, selectedOption, start]);

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;
  const isFetchingOptions = optionsFetchState === RequestStates.PENDING;

  const filterOption = () => true;

  const handleCurrentLocation = () => {
    const { latitude, longitude } = position;
    if (latitude && longitude) {
      stateDispatch({
        type: 'location',
        payload: {
          label: 'Current Location',
          value: `${latitude},${longitude}`,
          lat: latitude,
          lon: longitude
        }
      });
    }
  };

  const handleChange = (payload) => {
    stateDispatch({ type: 'location', payload });
  };

  const onPageChange = ({ page: newPage, start: startRow }) => {
    stateDispatch({
      type: 'page',
      payload: { page: newPage, start: startRow }
    });
  };

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          <Card>
            <ResultSegment vertical>
              {/* <Title>
                Search By Location
              </Title> */}
              <form>
                <div>
                  {/* <Label htmlFor="address">Address</Label> */}
                  <FlexRow>
                    <Select
                        autoFocus
                        filterOption={filterOption}
                        inputId="address"
                        inputValue={address}
                        isClearable
                        isLoading={isFetchingOptions}
                        onChange={handleChange}
                        onInputChange={setAddress}
                        options={options.toJS()}
                        placeholder="Search Locations"
                        value={selectedOption} />
                    <MarginButton
                        disabled={!!position.error}
                        icon={LocationIcon}
                        onClick={handleCurrentLocation} />
                  </FlexRow>
                </div>
              </form>
            </ResultSegment>
          </Card>
          <SearchResults
              hasSearched={hasSearched}
              isLoading={isLoading}
              resultComponent={LongBeachLocationResult}
              results={searchResults} />
          {
            hasSearched && (
              <PaginationToolbar
                  page={page}
                  count={totalHits}
                  onPageChange={onPageChange}
                  rowsPerPage={MAX_HITS} />
            )
          }
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default LongBeachLocationContainer;