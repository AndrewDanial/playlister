import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography, Fab } from '@mui/material'
import AuthContext from '../auth'
import AddIcon from '@mui/icons-material/Add';

/*
    Our Status bar React component goes at the bottom of our UI.

    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    function handleCreateNewList() {
        store.createNewList();
    }
    if (auth.loggedIn === true && store.currentList == null && store.currentView === 1) {
        return (
            <div id="playlister-statusbar">
                <div id="list-selector-heading">
                    <Fab
                        sx={{ transform: "translate(-50%, 70%)" }}
                        color="primary"
                        aria-label="add"
                        id="add-list-button"
                        onClick={handleCreateNewList}
                    >
                        <AddIcon />
                    </Fab>
                    <Typography variant="h4" sx={{
                        transform: "translate(-10%, 100%)"
                    }}>Your Lists</Typography>
                </div>
            </div>
        );
    }
    else {
        return (
            <div></div>
        )
    }

}

export default Statusbar;
