import { useContext, useState } from 'react'
import AuthContext from '../auth';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';

export default function MUIErrorModal() {
    const { auth } = useContext(AuthContext);
    console.log(auth.err);

    function handleCancel() {
        auth.clearErr();
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '35%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        overflow: 'hidden',
    };


    return (
        <Modal
            open={auth.err}
        >
            <Box sx={style}>
                <div
                    id="remove-song-modal"
                    data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-remove-song-root'>
                        <div className="modal-north">
                            <b>Error!</b>
                        </div>
                        <div className="modal-center" >
                            <Alert severity="error">
                                {auth.err}
                            </Alert>
                        </div>
                        <div className="modal-south" >
                            <Box textAlign='center'>
                                <Button variant="text"
                                    id="cancel-error"
                                    className="modal-button"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </Box>

                        </div>
                    </div>
                </div>
            </Box>
        </Modal >
    );
}
