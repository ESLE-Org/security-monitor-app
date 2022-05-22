/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-template-curly-in-string */
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import downloadFill from '@iconify/icons-eva/download-fill';
import CircularProgress from '@mui/material/CircularProgress';

// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';

import axios from 'axios';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { getAccessToken } from '../utils/oauth';
import { RepoListHead, RepoListToolbar } from '../components/_dashboard/repos';
import SettingsMoreMenu from '../components/_settings/SettingsMoreMenu';
import SearchNotFound from '../components/SearchNotFound';
import Scrollbar from '../components/Scrollbar';
import Label from '../components/Label';
import Page from '../components/Page';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const ORG_ID = process.env.REACT_APP_ORG_ID;
const ORG_NAME = process.env.REACT_APP_ORG_NAME;
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

const TABLE_HEAD = [
  { id: 'name', label: 'Language', alignRight: false },
  { id: 'testingTool', label: 'Scanning Tool', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_repo) => _repo.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Settings() {
  const [open, setOpen] = React.useState(false);
  const [downloadItemToggle, setDownloadItemToggle] = useState(false);

  const repoHandleClickOpen = () => {
    setDownloadItemToggle(true);
    setOpen(true);
  };

  const languageHandleClickOpen = () => {
    setDownloadItemToggle(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const repoHandleAgree = () => {
    getLatestRepoDetails();
    setOpen(false);
  };

  const languageHandleAgree = () => {
    getLatestLanguageDetails();
    setOpen(false);
  };
    const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      
      Authorization: `Bearer ${getAccessToken()}`
    }
  });

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const startSpinner = () => {
    setLoading(true);
  };
  const stopSpinner = () => {
    setLoading(false);
  };
  const clearApiData = () => {
    setApiData([]);
  };

  async function getLatestRepoDetails() {
    startSpinner();
    axiosInstance.post(`/addRepos/${ORG_NAME}/${ORG_ID}`).then(() => {
      console.log('Successfully updated');
      stopSpinner();
    });
  }
  async function getLatestLanguageDetails() {
    startSpinner();
    axiosInstance.post(`/addLanguages/${ORG_NAME}/${ORG_ID}`).then(() => {
      console.log('Successfully updated');
      stopSpinner();
    });
  }

  async function getLanguages() {
    startSpinner();
    axiosInstance.get(`/getLanguages/${ORG_ID}`).then((getData) => {
      console.log(getData.data);
      setApiData(getData.data);
      stopSpinner();
    });
  }

  useEffect(() => {
    getLanguages();
  }, []);

  const getLatestApiData = () => {
    getLanguages();
  };

  let LANGUAGELIST = [];
  LANGUAGELIST = apiData;

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = LANGUAGELIST.map((n) => n.name);
      console.log('newSelecteds');
      console.log(LANGUAGELIST);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - LANGUAGELIST.length) : 0;

  const filteredRepos = applySortFilter(LANGUAGELIST, getComparator(order, orderBy), filterName);

  const isRepoNotFound = filteredRepos.length === 0;

  return (
    <Page title="Settings | CSSMT">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-even" spacing={2} mb={5}>
            <Button
              variant="contained"
              startIcon={<Icon icon={downloadFill} />}
              onClick={repoHandleClickOpen}
            >
              Get Latest Repo Details
            </Button>

            <Button
              variant="contained"
              startIcon={<Icon icon={downloadFill} />}
              onClick={languageHandleClickOpen}
            >
              Get Latest Language Details
            </Button>

            <div>
              <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle>
                  Get Latest {downloadItemToggle ? <row>Repo</row> : <row>Language</row>} Details
                  Now?
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description">
                    Please note that this will take few minutes to visible all the{' '}
                    {downloadItemToggle ? <row>repos</row> : <row>languages</row>} with the latest
                    updates.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Disagree</Button>
                  <Button onClick={downloadItemToggle ? repoHandleAgree : languageHandleAgree}>
                    Agree
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Stack>
        </Stack>

        <Card sx={{ minWidth: 300, maxWidth: 900 }}>
          <RepoListToolbar
            numSelected={selected.length}
            filterName={filterName}
            searchBarText="Search Language..."
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer>
              <Table>
                <RepoListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={LANGUAGELIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredRepos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, testingTool } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2">{name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{testingTool}</TableCell>
                          <TableCell align="center">
                            <SettingsMoreMenu
                              getLatestApiData={getLatestApiData}
                              clearApiData={clearApiData}
                              startSpinner={startSpinner}
                              id={id}
                              orgId={ORG_ID}
                              name={name}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {!loading && isRepoNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                {loading && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={LANGUAGELIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
