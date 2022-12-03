import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import List from '@mui/material/List';
import { Grid, Icon, IconButton, Menu, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ToolBar from '@mui/material/Toolbar';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '@mui/icons-material/Home';
import Person from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import SortIcon from '@mui/icons-material/Sort';
/*
    This React component lists all the top5 lists in the UI.

    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [sort, setSort] = useState(0);
    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    let sortHandler = (event) => {
        setSort(event.target.value);
    }

    let listCard = "";
    if (store) {
        listCard =
            <List sx={{ width: '90%', left: '5%' }}>
                {
                    store.idNamePairs.map((pair) => (
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                        />
                    ))
                }
            </List>;
    }
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (

        <div id="playlist-selector">
            <Grid container xs={12}>
                <Grid item xs={12}>
                    <ToolBar sx={{ backgroundColor: "rgb(120, 116, 113)" }}>
                        <Grid container xs={24}>
                            <Grid item xs={1}>
                                <IconButton>
                                    <HomeIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton>
                                    <GroupsIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton>
                                    <Person />
                                </IconButton>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField fullWidth label="Search"></TextField>
                            </Grid>
                            <Grid item xs={2}>

                            </Grid>
                            <Grid item xs={2}>
                                <FormControl fullWidth>
                                    <InputLabel
                                    ><IconButton>
                                            Sort
                                            <SortIcon />
                                        </IconButton>
                                    </InputLabel>
                                    <Select value={sort} onChange={sortHandler}>
                                        <MenuItem value={1}>Name (A-Z)</MenuItem>
                                        <MenuItem value={2}>Publish Date (Newest) </MenuItem>
                                        <MenuItem value={3}>Listens (High - Low) </MenuItem>
                                        <MenuItem value={4}>Likes (High - Low) </MenuItem>
                                        <MenuItem value={5}>Dislikes (High - Low)</MenuItem>
                                    </Select>
                                </FormControl>

                            </Grid>
                        </Grid>

                    </ToolBar>
                </Grid>
            </Grid >
            <Grid container>
                <Grid item xs={12} sm={6} sx={{ height: '70vh', overflow: 'scroll' }}>
                    {
                        listCard
                    }
                    <MUIDeleteModal />

                </Grid>

                <Grid item xs={12} sm={6}>
                    <TabContext value={value}>
                        <Box>
                            <TabList onChange={handleChange}>
                                <Tab value="0" label="Player" />
                                <Tab value="1" label="Comments" />
                            </TabList>
                            <TabPanel value="0">
                                PLAYER :D
                            </TabPanel>
                            <TabPanel value="1">
                                COMMENTS! :D
                            </TabPanel>
                        </Box>
                    </TabContext>

                </Grid>
            </Grid>

        </div >
    )
}

export default HomeScreen;
