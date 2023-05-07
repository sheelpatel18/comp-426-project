// Header.js
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Popover, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../Tools/user';
import { API } from '../Tools/api';
import { LoadingButton } from '@mui/lab';
import { setUser } from '../redux/store';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null); // decides whether to show the popover or not
  const open = Boolean(anchorEl); // creates var for popover
  const userData = useSelector(state => state.user) // gets user data from redux store
  const [name, setName] = useState(userData?.name || "") // sets name to user's name or empty string, used for popover
  const [phone, setPhone] = useState(userData?.phone || "") // sets phone to user's phone or empty string, used for popover
  const [loading, setLoading] = useState(false) // used for popover submit button loading state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // used for delete account dialog
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false) // used for delete account dialog delete button loading state
  const [logoutButtonLoading, setLogoutButtonLoading] = useState(false) // used for logout button loading state
  const dispatch = useDispatch() // used to dispatch actions to redux store

  const handleClick = (event) => {
    // handles click on avatar icon, resets name and phone to user's name and phone, and shows popover
    // we need to reset name and phone in case the user has changed them since the last time they opened the popover
    setName(userData?.name || "")
    setPhone(userData?.phone || "")
    setAnchorEl(event.currentTarget); // open popover
  };

  const handleClose = () => {
    // handles popover close, resets name and phone to user's name and phone, and hides popover
    // we need to reset name and phone in case the user has changed them since the last time they opened the popover
    setName(userData?.name || "")
    setPhone(userData?.phone || "")
    setAnchorEl(null); // close popover
  };

  const parsePhone = p => {
    // if first two chars of p are NOT +1, add it in
    // if first two chars of p are +1, return p
    // if p is empty, return p
    if (p.length === 0) return p
    if (p.slice(0, 2) === '+1') return p
    if (p.slice(0, 2) !== '+1') return `+1${p}`
    return p // back-fall return statement
  }

  const handleSave = async () => {
    // handles save button click on popover
    try {
        setLoading(true) // start button loading
        const user = new User(userData) // create new user object from redux store data
        user.name = name // set user's name to name
        user.phone = parsePhone(phone) // set user's phone to phone
        await API.patch(`/user/${user.id}`, { name, phone: parsePhone(phone) }) // make api call to update database
        // if api call is successful, update redux store with new user data
        dispatch(
            setUser(user.toJSON())
        )
        // Implement your logic to save the user's name and phone number
        handleClose(); // close popover on successful user edit
    } catch (err) {
        console.error(err)
    } finally {
        setLoading(false) // no matter what, stop button loading
    }
  };

  const handleLogout = async () => {
    // handles logout button click
    try {
        setLogoutButtonLoading(true) // start button loading
        await API.post(`/user/logout/${userData.id}`) // makes api call to server for logging purposes
        window.location.reload(); // reloads page
    } catch (err) {
        console.error(err)
        await new Promise(r => setTimeout(r, 1000)) // wait 1 second before moving onto finally statement, this is so the user can see that the logout button is loading even if the api call fails instantaneously. 
    } finally {
        setLogoutButtonLoading(false) // no matter what, stop button loading
    }
  };

  const handleDeleteAccount = async () => {
    // handles delete account button click
    try {
        setDeleteButtonLoading(true) // start button loading
        await API.delete(`/user/${userData.id}`) // makes api call to server to delete user
        window.location.reload(); // reloads page
    } catch (err) {
        console.error(err)
        await new Promise(r => setTimeout(r, 1000)) // wait 1 second before moving onto finally statement, this is so the user can see that the logout button is loading even if the api call fails instantaneously. 
    } finally {
        setDeleteButtonLoading(false) // no matter what, stop button loading
    }
  }

  const handleDeleteDialogClose = () => {
    // handles delete account dialog close
    setDeleteDialogOpen(false);
  };

  const handleDeleteDialogConfirm = async () => {
    // handles delete account dialog confirm
    await handleDeleteAccount(); 
    // wait for handleDeleteAccount to finish before closing dialog
    handleDeleteDialogClose(); // no matter if handleDeleteAccount succeeds or fails, close dialog
  };

  return (
    <>
      <AppBar position="static"> 
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, {userData?.name || ''}! {/** If user is logged in, show their name, otherwise show nothing. */}
          </Typography>
          <Button color="inherit" onClick={() => setDeleteDialogOpen(true)}> {/** Clicking this button will open the delete account dialog */}
            Delete Account
          </Button>
          <LoadingButton loading={logoutButtonLoading} color="inherit" onClick={handleLogout}> {/** Clicking this button will make the api call in the onClick function */}
            Logout
          </LoadingButton>
          <IconButton edge="end" color="inherit" onClick={handleClick}> {/** Clicking this button will launch the popover for editing user details */}
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Popover /** This is the popover that allows the user to edit their details */
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ 
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ padding: '16px' }}>
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Phone Number" fullWidth margin="normal" value={phone.replace('+1', '')} onChange={e => setPhone(e.target.value)} />
          <LoadingButton loading={loading} variant="contained" color="primary" onClick={handleSave}> {/** Clicking this button will make the api cal in the onClick function */}
            Submit
          </LoadingButton>
        </div>
      </Popover>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary"> {/** Clicking this button will simply close the dialogue */}
            Cancel
          </Button>
          <LoadingButton loading={deleteButtonLoading} onClick={handleDeleteDialogConfirm} color="secondary" autoFocus> {/** Clicking this button will confirm the action */}
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
