// @flow
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { Map, get } from 'immutable';
import { Colors, StyleUtils, Tag } from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';

import { getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import {
  resetIssue,
  selectIssue,
} from './issue/IssueActions';
import IssueRowDetails from './IssueRowDetails';
import {
  TITLE_FQN,
  PRIORITY_FQN,
  STATUS_FQN,
  DATE_TIME_FQN,
} from '../../edm/DataModelFqns';

const { NEUTRALS } = Colors;
const { getHoverStyles } = StyleUtils;

const CustomRowWrapper = styled.tr.attrs(() => ({ tabIndex: '1' }))`
  border-bottom: ${(props) => (props.expanded ? null : `1px solid ${NEUTRALS[4]}`)};
  outline: none;
  ${getHoverStyles};
`;

const CellContent = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledCell = styled.td`
  padding: 10px;
`;

type Props = {
  data :any;
  expanded :boolean;
  setExpandedRowId :(id ?:string) => void;
};

const IssueRow = (props :Props) => {
  const {
    data,
    expanded,
    setExpandedRowId,
  } = props;

  const dispatch = useDispatch();

  const id = get(data, 'id');
  const title = get(data, TITLE_FQN);
  const priority = get(data, PRIORITY_FQN);
  const status = get(data, STATUS_FQN) || 'Open';
  const created = DateTime.fromISO(get(data, DATE_TIME_FQN, ''))
    .toLocaleString(DateTime.DATE_SHORT);

  // const subject = useSelector((store :Map) => {
  //   const subjectEKID = store.getIn(['issues', 'filteredIssues', 'subjectEKIDsByIssueEKID', id]);
  //   return store.getIn(['issues', 'filteredIssues', 'subjectsByEKID', subjectEKID]);
  // }) || Map();

  // const subjectName = getLastFirstMiFromPerson(subject, true);

  const icon = expanded ? faChevronUp : faChevronDown;

  const onClick = () => {
    if (expanded) {
      dispatch(resetIssue());
      setExpandedRowId();
    }
    else {
      dispatch(selectIssue(data));
      setExpandedRowId(id);
    }
  };

  return (
    <>
      <CustomRowWrapper onClick={onClick} expanded={expanded}>
        <StyledCell>
          <CellContent>
            { title }
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            { priority }
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            { status && <Tag mode="neutral">{status}</Tag> }
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            { created }
          </CellContent>
        </StyledCell>
        <StyledCell>
          <FontAwesomeIcon icon={icon} fixedWidth />
        </StyledCell>
      </CustomRowWrapper>
      {
        expanded && (<IssueRowDetails />)
      }
    </>
  );
};

export default React.memo<Props>(IssueRow);