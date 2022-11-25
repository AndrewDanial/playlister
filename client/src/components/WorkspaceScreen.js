import { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.

    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();
    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, []);
    if (store.currentList == null) {
        store.history.push("/");
        return null;
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    function keyDownHandler(event) {
        if (event.ctrlKey && event.key === 'z') {
            let undo = document.getElementById("undo-button");
            if (undo.disabled === false) {
                undo.click();
            }
        }

        if (event.ctrlKey && event.key === 'y') {
            let redo = document.getElementById("redo-button");
            if (redo.disabled === false) {
                redo.click();
            }
        }
    }




    return (
        <Box>
            <List
                id="playlist-cards"
                sx={{ width: '100%', bgcolor: 'background.paper' }}
            >
                {
                    store.currentList.songs.map((song, index) => (
                        <SongCard
                            id={'playlist-song-' + (index)}
                            key={'playlist-song-' + (index)}
                            index={index}
                            song={song}
                        />
                    ))
                }
            </List>
            {modalJSX}
        </Box>
    )
}

export default WorkspaceScreen;
