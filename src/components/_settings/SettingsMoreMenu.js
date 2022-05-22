/* eslint-disable prettier/prettier */
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import edit2Fill from '@iconify/icons-eva/edit-2-fill';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getAccessToken } from '../../utils/oauth';

// ----------------------------------------------------------------------
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

export default function SettingsMoreMenu(props) {
  const [open, setOpen] = React.useState(false);
  const valueRef = useRef('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = () => {
    setOpen(false);
    props.clearApiData();
    props.startSpinner();

    sendDataToAPI(
      props.id,
      props.orgId,
      props.name,
      valueRef.current.value
    );

  };


    const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      
      Authorization: `Bearer ${getAccessToken()}`
    }
  });

  const sendDataToAPI = (id, orgId, name, testingTool) => {
    if (testingTool === "") {
      testingTool = "Not configured"; 
    }
    axiosInstance
      .put(`/changeScannignToolInfo/${orgId}`, {
        id,
        name,
        testingTool
      })
      .then(() => {
        props.getLatestApiData();
      });
  };

  return (
    <>
      <Button variant="contained" startIcon={<Icon icon={edit2Fill} />} onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Scanning Tool</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the new scanning tool name here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id= {props.id}
            label="New Scanning Tool"
            fullWidth
            variant="standard"
            inputRef={valueRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleChange}>Change</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
