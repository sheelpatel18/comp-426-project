// Header.js
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Popover, TextField, Button } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../Tools/user';
import { API } from '../Tools/api';
import { LoadingButton } from '@mui/lab';
import { setUser } from '../redux/store';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const userData = useSelector(state => state.user)
  const [name, setName] = useState(userData?.name || "")
  const [phone, setPhone] = useState(userData?.phone || "")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setName(userData?.name || "")
    setPhone(userData?.phone || "")
    setAnchorEl(null);
  };

  const parsePhone = p => {
    // if first two chars of p are NOT +1, add it in
    // if first two chars of p are +1, return p
    // if p is empty, return p
    if (p.length === 0) return p
    if (p.slice(0, 2) === '+1') return p
    if (p.slice(0, 2) !== '+1') return `+1${p}`
    return p
  }

  const handleSave = async () => {
    try {
        setLoading(true)
        const user = new User(userData)
        user.name = name
        user.phone = parsePhone(phone)
        await API.patch(`/user/${user.id}`, { name, phone: parsePhone(phone) })
        dispatch(
            setUser(user.toJSON())
        )
        // Implement your logic to save the user's name and phone number
        handleClose();
    } catch (err) {
        console.error(err)
    } finally {
        setLoading(false)
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, {userData?.name || ''}!
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleClick}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Popover
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
          <LoadingButton loading={loading} variant="contained" color="primary" onClick={handleSave}>
            Submit
          </LoadingButton>
        </div>
      </Popover>
    </>
  );
};

export default Header;
