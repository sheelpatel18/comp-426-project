import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// import { makeStyles } from '@mui/styles';

function LoadingOverlay({open}) {
    // const classes = useStyles();

    return (
        <Backdrop style={{
            // zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }} open={open}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );

}


// const useStyles = makeStyles((theme) => ({
//     backdrop: {
//         zIndex: theme.zIndex.drawer + 1,
//         color: '#fff',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
// }));

export default LoadingOverlay