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
import AuthContext from '../auth';
import EditToolbar from './EditToolbar';
import Button from '@mui/material/Button'

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its
    name or deleting it.

    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    function handleLoadList(event, id) {
        if (store.currentModal === "NONE") {
            console.log(store.expandedList);
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
        if (store.currentModal === "NONE") {

            store.clear();
            if (store.currentList && store.currentList._id === idNamePair._id) {
                store.setCurrentList(null);
                return;
            }
            store.setCurrentList(idNamePair._id);
        }

    }

    function handleLike(event, like) {
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
    if (idNamePair.playlist) {
        likes = idNamePair.playlist.likes.length;
        dislikes = idNamePair.playlist.dislikes.length;
    }

    let listColor = "";
    let likeButtonColor = "black";
    let dislikeButtonColor = "black";
    if (idNamePair.playlist.likes.includes(auth.user.email)) {
        likeButtonColor = "green";
    }
    if (idNamePair.playlist.dislikes.includes(auth.user.email)) {
        dislikeButtonColor = "red";
    }

    function handlePublish(event) {
        event.stopPropagation();
        store.publishPlaylist(idNamePair._id);
    }

    if (store.currentList && store.currentList._id === idNamePair._id) {
        listColor = "rgb(52, 125, 235)";
    }
    else if (idNamePair.playlist.published) {
        listColor = "rgb(235, 189, 52)";
    }
    else {
        listColor = "rgb(155, 50, 219)"
    }
    cardElement =
        <Box>
            {
                store.searchCriteria === null || (store.searchCriteria && idNamePair.name.toLowerCase().includes(store.searchCriteria.toLowerCase())) ? <ListItem
                    id={idNamePair._id}
                    key={idNamePair._id}
                    sx={{ marginTop: '15px', display: 'flex', p: 1, borderRadius: "25px" }}
                    style={{ fontSize: '48pt', backgroundColor: listColor }}
                    button
                    onClick={(event) => {
                        handleExpand(event);
                    }}
                >
                    <Grid container>
                        <Grid container xs={12}>
                            <Grid item xs={4} sx={{ fontSize: "20pt", p: 1 }}>{idNamePair.name}</Grid>
                            <Grid item xs={4} sx={{ fontSize: "12pt", p: 1 }}><IconButton onClick={(event) => handleLike(event, true)}><ThumbsUp style={{ color: likeButtonColor }} />
                            </IconButton>{likes}
                            </Grid>
                            <Grid item xs={4} sx={{ fontSize: "12pt", p: 1 }}><IconButton onClick={(event) => handleLike(event, false)}><ThumbsDown style={{ color: dislikeButtonColor }} />
                            </IconButton>{dislikes}
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Box sx={{ fontSize: "20pt", p: 1 }}>By: {auth.user.firstName} {auth.user.lastName} </Box>
                            {idNamePair.playlist.published ? <Box sx={{ fontSize: "20pt", p: 1 }}>Published Date: {new Date(idNamePair.playlist.publishedDate).toLocaleString('en-US', { timezone: "America/New_York", month: 'short', day: '2-digit', year: 'numeric' })} </Box> : null}
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container direction="column">
                                {
                                    store.currentList !== null && idNamePair._id === store.currentList._id ? <Box>
                                        <List
                                            id="playlist-cards"
                                            sx={{ width: '100%', backgroundColor: listColor }}
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

                        <Grid container xs={12}>
                            <Grid item xs={2}>
                                {
                                    store.currentList !== null && idNamePair._id === store.currentList._id && !idNamePair.playlist.published ?
                                        <Button onClick={(event) => { handlePublish(event); }} sx={{ backgroundColor: "black" }}>Publish </Button> : null
                                }

                            </Grid>
                            <Grid item xs={5}>
                                {
                                    store.currentList !== null && idNamePair._id === store.currentList._id ? <EditToolbar /> : null
                                }

                            </Grid>
                            <Grid item xs={4} style={{ display: "flex" }}>

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
                                    {
                                        !idNamePair.playlist.published ?
                                            <IconButton onClick={handleToggleEdit} aria-label='edit'>
                                                <EditIcon style={{ fontSize: '36pt' }} />
                                            </IconButton> : null
                                    }
                                </Box>
                                <Box sx={{ p: 1 }}>
                                    <IconButton onClick={(event) => {
                                        handleDeleteList(event, idNamePair._id)
                                    }} aria-label='delete'>
                                        <DeleteIcon style={{ fontSize: '36pt' }} />
                                    </IconButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid >
                </ListItem> : null
            }

        </Box>




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
