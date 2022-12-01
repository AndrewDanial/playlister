import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import DownArrowIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import UpArrowIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import SongCard from './SongCard.js';
import List from '@mui/material/List';
import { Grid } from '@mui/material';
import MUIRemoveSongModal from './MUIRemoveSongModal';
import MUIEditSongModal from './MUIEditSongModal';
import ThumbsUp from '@mui/icons-material/ThumbUp';
import ThumbsDown from '@mui/icons-material/ThumbDown';

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

    /*function handleLoadList(event, id) {
        if (store.currentModal === "NONE") {
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

    }*/

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
        if (store.currentModal === "NONE") {
            event.stopPropagation();
            store.clear();
            if (store.currentList && store.currentList._id === idNamePair._id)
            {
                store.setCurrentList(null);
                return;
            }
            store.setCurrentList(idNamePair._id);
        }

    }

    function handleLike(event, like)
    {
        event.stopPropagation();
        store.like(idNamePair._id, like);
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

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    let likes = 0;
    let dislikes = 0;
    if (idNamePair.playlist)
    {
        likes = idNamePair.playlist.likes.length;
        dislikes = idNamePair.playlist.dislikes.length;
    }

    cardElement =
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ marginTop: '15px', display: 'flex', p: 1 }}
                style={{ width: '100%', fontSize: '48pt' }}
                button
                onClick={(event) => {
                    handleExpand(event);
                }}
            >
                <Grid container>
                        <Grid container xs={12}>
                            <Grid item xs={4} sx={{ fontSize: "20pt", p: 1 }}>{idNamePair.name}</Grid>
                            <Grid item xs={4} sx={{ fontSize: "12pt", p: 1 }}><IconButton onClick={(event) => handleLike(event, true)}><ThumbsUp />
                                </IconButton>{likes}
                            </Grid>
                            <Grid item xs={4} sx={{ fontSize: "12pt", p: 1 }}><IconButton onClick={(event) => handleLike(event, false)}><ThumbsDown />
                                </IconButton>{dislikes}
                            </Grid>
                        </Grid>

                    <Grid item xs={12}>
                        <Grid container direction="column">
                            {
                                store.currentList !== null && idNamePair._id === store.currentList._id ? <Box>
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
                                    {modalJSX}
                                </Box> : null
                            }

                        </Grid>

                    </Grid>

                    <Grid item xs={12} style={{ display: "flex" }}>
                        <Box sx={{ p: 1 }}>
                            <IconButton onClick={handleExpand}>
                                {
                                  store.currentList && store.currentList._id === idNamePair._id ?
                                  <UpArrowIcon style={{ fontSize: '36pt' }} />
                                  : <DownArrowIcon style={{ fontSize: '36pt' }} />
                                }

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
