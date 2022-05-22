/* eslint-disable prettier/prettier */
/* eslint-disable no-template-curly-in-string */
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import link2Fill from '@iconify/icons-eva/link-2-fill';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
  TablePagination,
  Link
} from '@mui/material';

// components
import axios from 'axios';
import { getAccessToken } from '../utils/oauth';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { RepoListHead, RepoListToolbar, RepoMoreMenu } from '../components/_dashboard/repos';

// ----------------------------------------------------------------------

const ORG_ID = process.env.REACT_APP_ORG_ID;
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

const COMMIT_TABLE_HEAD = [
  { id: 'status', label: 'Commit Status', alignRight: false },
  { id: 'commitUrl', label: 'Commit Url', alignRight: false },
  { id: 'pipelines', label: 'Pipelines', alignRight: false },
  { id: '' }
];

const LANGUAGE_TABLE_HEAD = [
  { id: 'language', label: 'Language', alignRight: false },
  { id: 'scanningTool', label: 'Scanning Tool', alignRight: false },
  { id: '' }
];
// ----------------------------------------------------------------------

function descendingComparatorCommits(a, b, orderByCommits) {
  if (b[orderByCommits] < a[orderByCommits]) {
    return -1;
  }
  if (b[orderByCommits] > a[orderByCommits]) {
    return 1;
  }
  return 0;
}

function descendingComparatorLanguages(a, b, orderByLanguages) {
  if (b[orderByLanguages] < a[orderByLanguages]) {
    return -1;
  }
  if (b[orderByLanguages] > a[orderByLanguages]) {
    return 1;
  }
  return 0;
}

function getComparatorCommits(orderCommits, orderByCommits) {
  return orderCommits === 'desc'
    ? (a, b) => descendingComparatorCommits(a, b, orderByCommits)
    : (a, b) => -descendingComparatorCommits(a, b, orderByCommits);
}

function getComparatorLanguages(orderLanguages, orderByLanguages) {
  return orderLanguages === 'desc'
    ? (a, b) => descendingComparatorLanguages(a, b, orderByLanguages)
    : (a, b) => -descendingComparatorLanguages(a, b, orderByLanguages);
}

function applySortFilterCommits(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const orderCommits = comparator(a[0], b[0]);
    if (orderCommits !== 0) return orderCommits;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_commits) => _commits.commitUrl.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

function applySortFilterLanguages(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const orderLanguages = comparator(a[0], b[0]);
    if (orderLanguages !== 0) return orderLanguages;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_languages) => _languages.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Repos() {
  const RepoDetails = useLocation();
  const { name, descript, url, updatedDate, createdDate, repoLanguages, repoLastCommits } =
    RepoDetails.state;

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      // "API-Key":`${API_TOKEN}`,
      Authorization: `Bearer ${getAccessToken()}`
    }
  });

  // const [apiData, setApiData] = useState([]);
  const [languageData, setLanguageData] = useState({});
  const [loading, setLoading] = useState(false);
  const languageDict = {};

  const startSpinner = () => {
    setLoading(true);
  };

  const stopSpinner = () => {
    setLoading(false);
  };

  useEffect(() => {
    getLanguages();
  }, []);

  async function getLanguages() {
    startSpinner();
    axiosInstance.get(`/getLanguages/${ORG_ID}`).then((getData) => {
      getData.data.map(createLanDict);
      // console.log(languageData);
      stopSpinner();
    });
  }

  const createLanDict = (languageData) => {
    languageDict[languageData.id] = languageData.testingTool;
    setLanguageData(languageDict);
  };

  // const getLatestRepoData = () => {
  //   // Function to go previous page and get repo data
  // };
  // const clearApiData = () => {
  //   setApiData([]);
  // };

  const [pageCommits, setPageCommits] = useState(0);
  const [orderCommits, setOrderCommits] = useState('asc');
  const [selectedCommits, setSelectedCommits] = useState([]);
  const [orderByCommits, setOrderByCommits] = useState('commitUrl');
  const [filterNameCommits, setFilterNameCommits] = useState('');
  const [rowsPerPageCommits, setRowsPerPageCommits] = useState(5);

  const [pageLanguages, setPageLanguages] = useState(0);
  const [orderLanguages, setOrderLanguages] = useState('asc');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [orderByLanguages, setOrderByLanguages] = useState('language');
  const [filterNameLanguages, setFilterNameLanguages] = useState('');
  const [rowsPerPageLanguages, setRowsPerPageLanguages] = useState(5);

  const handleCommitsRequestSort = (event, property) => {
    const isAsc = orderByCommits === property && orderCommits === 'asc';
    setOrderCommits(isAsc ? 'desc' : 'asc');
    setOrderByCommits(property);
  };

  const handleLanguagesRequestSort = (event, property) => {
    const isAsc = orderByLanguages === property && orderLanguages === 'asc';
    setOrderLanguages(isAsc ? 'desc' : 'asc');
    setOrderByLanguages(property);
  };

  const handleCommitSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = repoLastCommits.map((n) => n.status);
      setSelectedCommits(newSelecteds);
      return;
    }
    setSelectedCommits([]);
  };

  const handleLanguageSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = repoLanguages.map((n) => n.name);
      setSelectedLanguages(newSelecteds);
      return;
    }
    setSelectedLanguages([]);
  };

  const handleCommitsClick = (event, commitUrl) => {
    const selectedIndex = selectedCommits.indexOf(commitUrl);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCommits, commitUrl);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCommits.slice(1));
    } else if (selectedIndex === selectedCommits.length - 1) {
      newSelected = newSelected.concat(selectedCommits.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedCommits.slice(0, selectedIndex),
        selectedCommits.slice(selectedIndex + 1)
      );
    }
    setSelectedCommits(newSelected);
  };

  const handleLanguagesClick = (event, language) => {
    // change this
    const selectedIndex = selectedLanguages.indexOf(language);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedLanguages, language);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedLanguages.slice(1));
    } else if (selectedIndex === selectedLanguages.length - 1) {
      newSelected = newSelected.concat(selectedLanguages.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedLanguages.slice(0, selectedIndex),
        selectedLanguages.slice(selectedIndex + 1)
      );
    }
    setSelectedLanguages(newSelected);
  };

  const handleCommitsChangePage = (event, newPage) => {
    setPageCommits(newPage);
  };

  const handleLanguagesChangePage = (event, newPage) => {
    setPageLanguages(newPage);
  };

  const handleCommitsChangeRowsPerPage = (event) => {
    setRowsPerPageCommits(parseInt(event.target.value, 10));
    setPageCommits(0);
  };

  const handleLanguagesChangeRowsPerPage = (event) => {
    setRowsPerPageLanguages(parseInt(event.target.value, 10));
    setPageLanguages(0);
  };

  const handleCommitsFilterByName = (event) => {
    setFilterNameCommits(event.target.value);
  };

  const handleLanguagesFilterByName = (event) => {
    setFilterNameLanguages(event.target.value);
  };
  const emptyRowsCommits =
    pageCommits > 0
      ? Math.max(0, (1 + pageCommits) * rowsPerPageCommits - repoLastCommits.length)
      : 0;

  const emptyRowsLanguages =
    pageLanguages > 0
      ? Math.max(0, (1 + pageLanguages) * rowsPerPageLanguages - repoLanguages.length)
      : 0;

  const filteredCommits = applySortFilterCommits(
    repoLastCommits,
    getComparatorCommits(orderCommits, orderByCommits),
    filterNameCommits
  );

  const filteredLanguages = applySortFilterLanguages( 
    repoLanguages,
    getComparatorLanguages(orderLanguages, orderByLanguages), 
    filterNameLanguages
  );

  const isCommitNotFound = filteredCommits.length === 0;

  const isLanguageNotFound = filteredLanguages.length === 0;

  return (
    <Page title="Specific Repos | CSSMT">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={0.5}
          >
            <Typography variant="h4" gutterBottom>
              {name}
            </Typography>
            <Typography variant="body1" color="blue" gutterBottom>
              {descript}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-even"
              spacing={2}
              mb={5}
            >
              <Typography variant="body2">( last updated at : {updatedDate}</Typography>
              <Typography variant="body2">created at : {createdDate} )</Typography>
            </Stack>
          </Stack>
          <Button
            variant="contained"
            startIcon={<Icon icon={link2Fill} />}
            component={Link}
            target="_blank"
            href={url}
          >
            Visit Repo
          </Button>
        </Stack>
        <Typography variant="h6" color="green" paddingY={3}>
          Details of Last Commit in all OPEN PRs
        </Typography>
        <Card>
          <RepoListToolbar
            numSelected={selectedCommits.length}
            filterNameCommits={filterNameCommits}
            searchBarText="Search Commits..."
            onFilterName={handleCommitsFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <RepoListHead
                  orderCommits={orderCommits}
                  orderByCommits={orderByCommits}
                  headLabel={COMMIT_TABLE_HEAD}
                  rowCount={repoLastCommits.length}
                  numSelected={selectedCommits.length}
                  onRequestSort={handleCommitsRequestSort}
                  onSelectAllClick={handleCommitSelectAllClick}
                />
                <TableBody>
                  {filteredCommits
                    .slice(
                      pageCommits * rowsPerPageCommits,
                      pageCommits * rowsPerPageCommits + rowsPerPageCommits
                    )
                    .map((row) => {
                      const { oid, commitUrl, status } = row;
                      const isItemSelected = selectedCommits.indexOf(status) !== -1;

                      return (
                        <TableRow
                          hover
                          key={oid}
                          tabIndex={-1}
                          role="checkbox"
                          selectedCommits={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleCommitsClick(event, status)}
                            />
                          </TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={
                                (status != null && status.state === 'SUCCESS' && 'success') ||
                                (status != null && status.state === 'FAILURE' && 'error') ||
                                'warning'
                              }
                            >
                              {status == null ? 'NULL' : status.state}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Button
                              variant="contained"
                              startIcon={<Icon icon={link2Fill} />}
                              component={Link}
                              target="_blank"
                              href={commitUrl}
                            >
                              Visit
                            </Button>
                          </TableCell>
                          {status != null && (
                            <TableCell align="left">
                              {status.contexts.map((el, index) => (
                                <Stack
                                  direction="column"
                                  alignItems="left"
                                  justifyContent="left"
                                  mb={5}
                                  key={index}
                                >
                                  <Typography variant="body1" gutterBottom color="brown">
                                    Context: {el.context}
                                  </Typography>
                                  <Typography variant="body1" gutterBottom color="blue">
                                    Description: {el.description}
                                  </Typography>
                                  <Typography variant="subtitle1" gutterBottom>
                                    State: {el.state}
                                  </Typography>
                                  <Button
                                    variant="contained"
                                    startIcon={<Icon icon={link2Fill} />}
                                    component={Link}
                                    target="_blank"
                                    href={el.targetUrl}
                                  >
                                    Visit Pipeline
                                  </Button>
                                </Stack>
                              ))}
                            </TableCell>
                          )}
                          {status == null && (
                            <TableCell>
                              <Typography variant="body1" gutterBottom>
                                NULL
                              </Typography>
                            </TableCell>
                          )}
                          {/* <TableCell align="right">
                            <RepoMoreMenu
                              getLatestRepoData={getLatestRepoData}
                              clearApiData={clearApiData}
                              startSpinner={startSpinner}
                              id={oid}
                              orgId={ORG_ID}
                              commitUrl={commitUrl}
                              // status={status}
                            />
                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                  {emptyRowsCommits > 0 && (
                    <TableRow style={{ height: 53 * emptyRowsCommits }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {!loading && isCommitNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterNameCommits} />
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
            count={repoLastCommits.length}
            rowsPerPage={rowsPerPageCommits}
            page={pageCommits}
            onPageChange={handleCommitsChangePage}
            onRowsPerPageChange={handleCommitsChangeRowsPerPage}
          />
        </Card>

        {/* languages--------------------------------------------- */}
        <Typography variant="h6" color="green" paddingTop={6} paddingBottom={3}>
          Details of Languages and Configured Scanning Tools
        </Typography>
        <Card>
          <RepoListToolbar
            numSelected={selectedLanguages.length}
            filterNameLanguages={filterNameLanguages}
            searchBarText="Search Languages..."
            onFilterName={handleLanguagesFilterByName}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <RepoListHead
                  orderLanguages={orderLanguages}
                  orderByLanguages={orderByLanguages}
                  headLabel={LANGUAGE_TABLE_HEAD}
                  rowCount={repoLanguages.length} // change this
                  numSelected={selectedLanguages.length}
                  onRequestSort={handleLanguagesRequestSort}
                  onSelectAllClick={handleLanguageSelectAllClick}
                />
                <TableBody>
                  {filteredLanguages
                    .slice(
                      pageLanguages * rowsPerPageLanguages,
                      pageLanguages * rowsPerPageLanguages + rowsPerPageLanguages
                    )
                    .map((row) => {
                      const { name, id, color } = row;
                      const isItemSelected = selectedLanguages.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selectedLanguages={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleLanguagesClick(event, name)}
                            />
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="subtitle2" noWrap color={color}>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="subtitle2" noWrap color={color}>
                              {languageData[id]}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Button
                              variant="contained"
                              startIcon={<Icon icon={link2Fill} />}
                              component={Link}
                              target="_blank"
                              // href={commitUrl}
                            >
                              Configure Scanning Tool
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRowsLanguages > 0 && (
                    <TableRow style={{ height: 53 * emptyRowsLanguages }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {!loading && isLanguageNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterNameLanguages} />
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
            count={repoLanguages.length} // change this
            rowsPerPage={rowsPerPageLanguages}
            page={pageLanguages}
            onPageChange={handleLanguagesChangePage}
            onRowsPerPageChange={handleLanguagesChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
