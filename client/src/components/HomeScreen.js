import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import CommentCard from './CommentCard'
import AuthContext from '../auth'
import Player from './Player';

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
    const { auth } = useContext(AuthContext);
    const [sort, setSort] = useState(0);
    const [text, setText] = useState("");
    const [comment, setComment] = useState("");
    /* useEffect(() => {
         //store.loadIdNamePairs();
         store.sort(sort);
     }, [sort]);*/

    let sortHandler = (event) => {
        setSort(event.target.value);
        store.sort(event.target.value);
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
    const [value, setValue] = useState('0');

    const handleChange = (event, newValue) => {
        console.log(newValue + "new val");
        setValue(newValue);
    };

    function handleKeyPress(event) {
        if (event.code == "Enter") {
            store.search(text);
        }
    }

    const handleComment = (event) => {
        setComment(event.target.value);
    };

    function handleKeyPressComment(event) {
        if (event.code == "Enter") {
            if (!store.currentList.published) {
                event.target.value = "Can't comment on an unpublished playlist";
                return;
            }
            if (auth.isGuest) {
                event.target.value = "Can't comment as guest";
                return;
            }
            event.target.value = "";
            store.comment(comment);
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function changeCurrentView(view) {
        store.setView(view);
    }
    let display = "";
    if (value == 1)
        display = 'none'
    console.log(value + " VALUE");
    console.log(display);
    let playerComponent = store.currentList ? <Box sx={{ display: display }}><Player playlist={store.currentList} /> </Box> : <Box>No playlist selected :( </Box>

    return (

        <div id="playlist-selector">
            <Grid container xs={12}>
                <Grid item xs={12}>
                    <ToolBar sx={{ backgroundColor: "rgb(120, 116, 113)" }}>
                        <Grid container xs={24}>
                            <Grid item xs={1} >
                                <IconButton disabled={auth.isGuest} onClick={() => { changeCurrentView(1) }} >
                                    <HomeIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={1} >
                                <IconButton onClick={() => { changeCurrentView(2) }} >
                                    <GroupsIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={1} >
                                <IconButton onClick={() => { changeCurrentView(3) }} >
                                    <Person />
                                </IconButton>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField onChange={handleUpdateText} onKeyPress={handleKeyPress} fullWidth label="Search"></TextField>
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
                                        {
                                            store.currentView !== 1 ? <MenuItem value={2}>Publish Date (Newest) </MenuItem> : null
                                        }

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
                            {
                                playerComponent
                            }
                            <TabPanel value="0">
                            </TabPanel>
                            <TabPanel value="1">
                                {
                                    <Grid container direction="column">
                                        {
                                            store.currentList ?

                                                <Box>

                                                    <List sx={{ height: "40vh", overflow: "scroll", overflowX: "hidden", maxWidth: "90%" }}>
                                                        {
                                                            store.currentList.comments.map((comment) => (
                                                                CommentCard(comment.username, comment.comment)
                                                            ))
                                                        }

                                                    </List>


                                                </Box>
                                                : <Box>No playlist selected :( </Box>


                                        }
                                        <Grid item xs={12}>
                                            {
                                                value === "1" && store.currentList ? <TextField onChange={(event) => { handleComment(event) }} onKeyPress={handleKeyPressComment}
                                                    fullWidth
                                                    sx={{ marginTop: "15%" }}
                                                    label="Type a comment here!">

                                                </TextField> : null
                                            }
                                        </Grid>
                                    </Grid>
                                }

                            </TabPanel>
                        </Box>


                    </TabContext>


                </Grid>
            </Grid >

        </div >
    )
}

export default HomeScreen;
