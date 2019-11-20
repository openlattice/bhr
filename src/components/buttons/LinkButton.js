// @flow
import React from 'react';
import type { Node } from 'react';
import { Button } from 'lattice-ui-kit';

import { useGoToPath } from '../hooks';

type Props = {
  children :Node;
  className ? :string;
  disabled ? :boolean;
  isLoading ? :boolean;
  mode ? :string;
  state ? :any;
  to :string;
}

const LinkButton = (props :Props) => {
  const {
    children,
    className,
    disabled,
    isLoading,
    mode,
    state,
    to,
  } = props;

  const onClick = useGoToPath(to, state);

  return (
    <Button
        className={className}
        disabled={disabled}
        isLoading={isLoading}
        mode={mode}
        onClick={onClick}>
      {children}
    </Button>
  );
};

LinkButton.defaultProps = {
  className: undefined,
  disabled: false,
  isLoading: false,
  mode: undefined,
  state: undefined,
};

export default LinkButton;
