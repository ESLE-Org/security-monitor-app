/* eslint-disable prettier/prettier */
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import axios from 'axios';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import { getAccessToken } from '../../../utils/oauth';

// ----------------------------------------------------------------------
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

export default function RepoMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      
      Authorization: `Bearer ${getAccessToken()}`
    }
  });
  const sendDataToAPI = (
    id,
    orgId,
    description,
    repoName,
    repoUrl,
    createdAt,
    updatedAt,
    repoWatchStatus
  ) => {
    axiosInstance
      .put(`/changeWatchStatus/${orgId}/${id}/${repoWatchStatus === '1' ? 1 : 0}`, {
        id,
        createdAt,
        description,
        orgId,
        repoName,
        repoUrl,
        updatedAt
      })
      .then(() => {
        props.getLatestApiData();
      });
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            setIsOpen(false);

            props.clearApiData();
            props.startSpinner();

            sendDataToAPI(
              props.id,
              props.orgId,
              props.description,
              props.repoName,
              props.repoUrl,
              props.createdAt,
              props.updatedAt,
              '1'
            );
          }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Watch" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            setIsOpen(false);

            props.clearApiData();
            props.startSpinner();

            sendDataToAPI(
              props.id,
              props.orgId,
              props.description,
              props.repoName,
              props.repoUrl,
              props.createdAt,
              props.updatedAt,
              '0'
            );
          }}
        >
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Unwatch" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
