import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function LoadingOverlay({open}) {

    return (
        <Backdrop style={{
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }} open={open}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );

}

export default LoadingOverlay