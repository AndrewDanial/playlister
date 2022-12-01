import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import List from '@mui/material/List';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

/*
    This React component lists all the top5 lists in the UI.

    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);


    let listCard = "";
    if (store) {
        listCard =
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
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
            <Grid container>
                <Grid item xs={12} sm={6} sx={{ height: '75vh', overflow: 'scroll' }}>
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
