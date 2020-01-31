// @flow
import React from 'react';

import styled from 'styled-components';
import {
  Card,
  CardSegment,
  Colors,
  Skeleton
} from 'lattice-ui-kit';

const { NEUTRALS } = Colors;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 24px;
`;

const StrongWithSubtitle = styled.span`
  font-weight: 600;

  ::after {
    content: 'IN THE LAST YEAR';
    color: ${NEUTRALS[1]};
    font-size: 16px;
    margin-left: 10px;
  }
`;

type Props = {
  count :number;
  isLoading :boolean;
}

const CrisisCountCard = ({ count, isLoading } :Props) => (
  <Card>
    <CardSegment padding="sm">
      <Centered>
        {
          isLoading
            ? <Skeleton width="50%" height={36} />
            : (
              <StrongWithSubtitle>
                {`${count} CRISIS CALLS`}
              </StrongWithSubtitle>
            )
        }
      </Centered>
    </CardSegment>
  </Card>
);

export default CrisisCountCard;
