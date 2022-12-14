import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
};

export default function MUIRemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleConfirmRemoveSong() {
        store.addRemoveSongTransaction();
    }

    function handleCancelRemoveSong() {
        store.hideModals();
    }

    let modalClass = "modal modal-dialog";
    if (store.isRemoveSongModalOpen()) {
        console.log("This is so true");
        modalClass += " is-visible";
    }
    let songTitle = "";
    if (store.currentSong) {
        songTitle = store.currentSong.title;
    }

    return (
        <Modal
            open={store.currentModal === "REMOVE_SONG"}
        >
            <Box sx={style}>
                <div
                    id="remove-song-modal"
                    className={modalClass}
                    data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-remove-song-root'>
                        <div className="modal-north" style={{ fontSize: "24pt" }}>
                            <b>Remove {songTitle}?</b>
                        </div>
                        <div className="modal-center">
                            <div className="modal-center-content">
                                Are you sure you wish to permanently remove {songTitle} from the playlist?
                            </div>
                        </div>
                        <div className="modal-south">
                            <input type="button"
                                id="remove-song-confirm-button"
                                className="modal-button"
                                onClick={handleConfirmRemoveSong}
                                value='Confirm' />
                            <input
                                type="button"
                                id="remove-song-cancel-button"
                                className="modal-button"
                                onClick={handleCancelRemoveSong}
                                value='Cancel' />
                        </div>
                    </div>
                </div>
            </Box>
        </Modal >
    );
}
