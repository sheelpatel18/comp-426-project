import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ScheduleSelector from 'react-schedule-selector';
import { User } from '../Tools/user';
import { API } from '../Tools/api';
import { setUser } from '../redux/store';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Typography } from '@mui/material';
import LoadingOverlay from '../Tools/LoadingOverlay';

export default function Scheduler(props) {
  const userRaw = useSelector(state => state.user) // gets user data from redux store
  const [schedule, setSchedule] = useState(new User(userRaw).availability?.map?.(s => { // sets schedule to user's existing availability or empty array
    try {
      return new Date(s) 
    } catch (e) {
      console.error(e)
      return null; // if s is not a valid date, return null
    }
  })?.filter?.(s => s) || []); // filter out null values as a safety measure
  const [whenAvailable, setWhenAvailable] = useState('') // used to display when available
  const [open, setOpen] = useState(false) // used for success snackbar
  const [dialogOpen, setDialogOpen] = useState(false); // used for reset dialog
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false) // used for loading overlay
  const dispatch = useDispatch() // used to dispatch actions to redux store

  const handleChange = (newSchedule) => {
    // handles schedule change
    setSchedule(newSchedule);
  };

  const handleSubmit = async () => {
    // handles submit button click
    try {
      setShowLoadingOverlay(true) // start loading overlay
      const user = new User(userRaw) // create new user object from redux store data
      const updatedUser = await API.patch(`/user/${user.id}`, { availability: schedule.map(s => (s?.toUTCString?.() || "") ?? []).filter(s => s) }) // make api call to update database
      // the schedule is parsed to match api requirements above in a similar fashion to how the state is first initialized.
      // the following is completed if the user's schedule is successfully updated in the database:
      dispatch(
        setUser(updatedUser) // update redux store with user data
      )
      setOpen(true) // show success snackbar
      setTimeout(() => {
        setOpen(false) // hide success snackbar after 3 seconds in an async fashion. Meaning the finally statement will still run and NOT wait for this to finish.
      }, 3000);
    } catch (err) {
      console.error(err)
    } finally {
      setShowLoadingOverlay(false) // stop loading overlay
    }
  };

  const handleReset = () => {
    // handles reset button click, resets schedule to empty array
    setSchedule([]);
  };

  const handleWhenAvailabe = async () => {
    // handles find meeting time button click
    try {
      setShowLoadingOverlay(true) // start loading overlay
      const whenAvailable = await API.get(`/whenAvailable/${userRaw?.id || ''}`) || "" // make api call to get when available
      setWhenAvailable(whenAvailable) // set when available
    } catch (err) {
      console.error(err)
      new Promise(resolve => setTimeout(resolve, 5000)) // wait 5 seconds before hiding when available
    } finally {
      setShowLoadingOverlay(false) // stop loading overlay, no matter what happens
    }
    
  };

  const handleClose = (event, reason) => {
    // handles success snackbar close
    if (reason === 'clickaway') {
      return; // if user clicks away, do nothing
    }

    setOpen(false); // hide success snackbar
  };

  const handleDialogClose = () => {
    // handles reset dialog close
    setDialogOpen(false);
  };

  const handleDialogConfirm = () => {
    // handles reset dialog confirm
    handleReset()
    setDialogOpen(false) // hide reset dialog
  }

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '1rem'
    }}>
      <LoadingOverlay open={showLoadingOverlay} /> {/* show loading overlay if showLoadingOverlay is true, this would cover the entire viewport */}
      <h1 style={{
        marginBottom: '1rem',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#007bff',
        textTransform: 'uppercase',
        letterSpacing: '0.2rem'
      }}>Meeting Scheduler</h1>
      <ScheduleSelector // schedule selector component
        selection={schedule}
        numDays={7}
        minTime={10}
        maxTime={22}
        hourlyChunks={1}
        onChange={handleChange}
        style={{
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '1rem'
        }}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '1rem'
      }}>
        <button style={{
          border: 'none',
          borderRadius: '6px',
          backgroundColor: '#dc3545',
          color: '#fff',
          padding: '0.5rem 1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out'
        }} onClick={() => schedule.length && setDialogOpen(true)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}>Reset</button>
        <button style={{
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#28a745',
          color: '#fff',
          padding: '0.5rem 1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out'
        }} onClick={handleSubmit}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}>Submit</button>
        <button style={{
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '0.5rem 1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out'
        }} onClick={handleWhenAvailabe}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0069d9'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}>Find Meeting Time</button>
      </div>
      <div style={{ marginTop: "50px" }} />
      <Typography>{whenAvailable}</Typography>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Success"
      />
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Reset Schedule"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to reset your schedule?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary"> {/* close dialog */}
            Cancel
          </Button>
          <Button onClick={handleDialogConfirm} color="secondary" autoFocus> {/* reset schedule */}
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
