import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';

const CenteredBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const Loading = () => {
  return (
    <CenteredBox>
      <CircularProgress />
    </CenteredBox>
  );
};

export default Loading;