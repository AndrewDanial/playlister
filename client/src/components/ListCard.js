import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import DownArrowIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import SongCard from './SongCard.js'
import List from '@mui/material/List';
import { Grid } from '@mui/material';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its
    name or deleting it.

    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleExpand(event) {
        event.stopPropagation();
        store.setCurrentList(idNamePair._id)
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let cardElement = "";

    if (store.currentList === null) {
        cardElement =
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ marginTop: '15px', display: 'flex', p: 1 }}
                style={{ width: '100%', fontSize: '48pt' }}
                button
                onClick={(event) => {
                    handleLoadList(event, idNamePair._id)
                }}
            >
                <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={handleExpand}>
                        <DownArrowIcon style={{ fontSize: '36pt' }} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={handleToggleEdit} aria-label='edit'>
                        <EditIcon style={{ fontSize: '36pt' }} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                        <DeleteIcon style={{ fontSize: '36pt' }} />
                    </IconButton>
                </Box>
            </ListItem>
    }
    else {
        cardElement =
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ marginTop: '15px', display: 'flex', p: 1 }}
                style={{ width: '100%', fontSize: '48pt' }}
                button
                onClick={(event) => {
                    handleLoadList(event, idNamePair._id)
                }}
            >
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container direction="column">
                            {
                                idNamePair._id === store.currentList._id ? <Box>
                                    <List
                                        id="playlist-cards"
                                        sx={{ width: '100%', bgcolor: 'background.paper' }}
                                    >

                                        {
                                            store.currentList.songs.map((song, index) => (
                                                <Grid item xs={12}>
                                                    <SongCard
                                                        id={'playlist-song-' + (index)}
                                                        key={'playlist-song-' + (index)}
                                                        index={index}
                                                        song={song}
                                                    />
                                                </Grid>

                                            ))
                                        }

                                    </List>
                                </Box> : <Box></Box>
                            }

                        </Grid>
                    </Grid>

                    <Grid item xs={12} style={{ display: "flex" }}>
                        <Box sx={{ p: 1 }}>
                            <IconButton onClick={handleExpand}>
                                <DownArrowIcon style={{ fontSize: '36pt' }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ p: 1 }}>
                            <IconButton onClick={handleToggleEdit} aria-label='edit'>
                                <EditIcon style={{ fontSize: '36pt' }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ p: 1 }}>
                            <IconButton onClick={(event) => {
                                handleDeleteList(event, idNamePair._id)
                            }} aria-label='delete'>
                                <DeleteIcon style={{ fontSize: '36pt' }} />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid >
            </ListItem>



    }


    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{ style: { fontSize: 48 } }}
                InputLabelProps={{ style: { fontSize: 24 } }}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;
