import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.

    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleAddNewSong(event) {
        event.stopPropagation();
        store.addNewSong();
    }
    function handleUndo(event) {
        event.stopPropagation();
        store.undo();
    }
    function handleRedo(event) {
        event.stopPropagation();
        store.redo();
    }
    function handleClose(event) {
        event.stopPropagation();
        store.closeCurrentList();
    }
    return (
        <div id="edit-toolbar">
            <Button
                disabled={!store.canAddNewSong() || store.currentModal !== "NONE" || store.currentList.published}
                id='add-song-button'
                onClick={(event) => { handleAddNewSong(event) }}
                sx={{ backgroundColor: "black" }}
                variant="contained">
                <AddIcon />
            </Button>
            <Button
                disabled={!store.canUndo() || store.currentModal !== "NONE"}
                id='undo-button'
                onClick={(event) => { handleUndo(event) }}
                sx={{ backgroundColor: "black" }}
                variant="contained">
                <UndoIcon />
            </Button>
            <Button
                disabled={!store.canRedo() || store.currentModal !== "NONE"}
                id='redo-button'
                onClick={(event) => { handleRedo(event) }}
                sx={{ backgroundColor: "black" }}
                variant="contained">
                <RedoIcon />
            </Button>
        </div>
    )
}

export default EditToolbar;
