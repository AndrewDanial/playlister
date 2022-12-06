import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth';
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers.

    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    LIKE_LIST: "LIKE_LIST",
    EXPAND_LIST: "EXPAND_LIST",
    SEARCH: "SEARCH",
    SORT: "SORT",
    COMMENT: "COMMENT",
    SET_VIEW: "SET_VIEW"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE: "NONE",
    DELETE_LIST: "DELETE_LIST",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG"
}


// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex: -1,
        currentSong: null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        searchCriteria: null,
        sortingCriteria: 0,
        currentView: 1,
    });

    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    currentView: 1
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal: CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    searchCriteria: store.searchCriteria
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    currentView: store.currentView,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria
                });
            }
            //
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal: CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal: CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria
                });
            }
            case GlobalStoreActionType.LIKE_LIST: {
                return setStore({
                    ...store,
                    currentList: payload.currentList,
                    idNamePairs: payload.idNamePairs,
                    searchCriteria: store.searchCriteria,
                    currentView: store.currentView
                });
            }
            case GlobalStoreActionType.SEARCH: {
                return setStore({
                    ...store,
                    searchCriteria: payload,
                    currentView: store.currentView
                });
            }
            case GlobalStoreActionType.SORT: {
                return setStore({
                    ...store,
                    sortingCriteria: payload.sortingCriteria,
                    idNamePairs: payload.idNamePairs,
                    currentView: payload.currentView
                });
            }
            case GlobalStoreActionType.COMMENT: {
                return setStore({
                    ...store,
                    currentList: payload,
                    currentView: store.currentView
                });
            }
            case GlobalStoreActionType.SET_VIEW: {
                return setStore({
                    ...store,
                    currentView: payload.currentView,
                    idNamePairs: payload.idNamePairs,
                })
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                console.log(playlist);
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        await getListPairs(playlist);
                    }
                }
                await updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST
        });
        history.push("/");
    }


    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        console.log("in here");
        let ctr = 0;
        let newListName = "Untitled " + ctr;
        let response2 = await api.getPlaylistPairs();
        if (response2.data.success) {
            let pairs = response2.data.idNamePairs;
            console.log(pairs);
            for (let i in pairs)
                for (let element of pairs) {
                    console.log(element);
                    if (element.name === newListName) {
                        ctr += 1;
                        newListName = "Untitled " + ctr;
                        break;
                    }
                }

            const response = await api.createPlaylist(newListName, [], auth.user.email);
            console.log("createNewList response: " + response);
            if (response.status === 201) {
                tps.clearAllTransactions();
                let newList = response.data.playlist;
                let response3 = await api.getPlaylistPairs();
                if (response3.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: {
                            currentList: newList,
                            idNamePairs: response3.data.idNamePairs
                        }
                    });
                }

            }


            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/playlist/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.like = async function (id, like) {
        let response = "";
        console.log(store);
        console.log(store.currentView);
        if (store.currentView === 1)
            response = await api.getPlaylistById(id);
        else
            response = await api.getPlaylists();
        console.log(response);
        if (response.data.success) {
            let playlist = "";

            console.log(response.data);
            if (store.currentView === 1) {
                console.log("this is the view")
                playlist = response.data.playlist;
            }
            else {
                console.log(id + " main id");
                let pairs = response.data.idNamePairs;
                pairs = pairs.filter((element) => element.playlist.published === true);
                console.log(pairs + " woah pairs")
                for (let element of pairs) {
                    console.log(element);
                    if (element._id === id) {
                        console.log("we broke")
                        playlist = element.playlist;
                        break;
                    }
                }
            }
            console.log(playlist);
            if (like) {
                if (!playlist.likes.includes(auth.user.email)) {
                    if (playlist.dislikes.includes(auth.user.email)) {
                        let index = playlist.dislikes.indexOf(auth.user.email);
                        if (index > -1) {
                            playlist.dislikes.splice(index, 1);
                        }
                    }
                    playlist.likes.push(auth.user.email);
                }
                else {
                    let index = playlist.likes.indexOf(auth.user.email);
                    if (index > -1) {
                        playlist.likes.splice(index, 1);
                    }
                }

            }
            else {
                if (!playlist.dislikes.includes(auth.user.email)) {
                    let index = playlist.likes.indexOf(auth.user.email);
                    if (index > -1) {
                        playlist.likes.splice(index, 1);
                    }
                    playlist.dislikes.push(auth.user.email);
                }
                else {
                    let index = playlist.dislikes.indexOf(auth.user.email);
                    if (index > -1) {
                        playlist.dislikes.splice(index, 1);
                    }
                }
            }


            let response2 = await api.updatePlaylistById(playlist._id, playlist);
            if (response2.data.success) {
                store.sort(store.sortingCriteria);

            }
        }
    }

    store.publishPlaylist = async function (id) {
        const response = await api.getPlaylistById(id);
        if (response.data.success) {
            let playlist = response.data.playlist;
            playlist.published = true;
            playlist.publishedDate = new Date();
            playlist.publisher = auth.user.username;
            console.log(playlist);
            const response2 = await api.updatePlaylistById(id, playlist);
        }
        store.loadIdNamePairs();
    }

    store.search = async function (searchCriteria) {
        storeReducer({
            type: GlobalStoreActionType.SEARCH,
            payload: searchCriteria
        });
    }

    store.comment = async function (comment) {
        let response = "";
        if (store.currentView === 1) {
            console.log("it is in deed 1 d12e12e")
            response = await api.getPlaylistById(store.currentList._id);
        }
        else {
            response = await api.getPlaylists();
            if (response.data.success) {
                for (let element of response.data.idNamePairs) {
                    console.log(element);
                    if (element._id === store.currentList._id) {
                        element.playlist.comments.push({
                            username: auth.user.username,
                            comment: comment
                        });
                        let response2 = await api.updatePlaylistById(store.currentList._id, element.playlist);
                        if (response2.data.success) {
                            storeReducer({
                                type: GlobalStoreActionType.COMMENT,
                                payload: element.playlist
                            });
                        }


                    }
                }
                return;
            }
        }
        if (response.data.success) {
            let playlist = response.data.playlist;
            playlist.comments.push({
                username: auth.user.username,
                comment: comment
            });
            let response2 = await api.updatePlaylistById(store.currentList._id, playlist);
            if (response2.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.COMMENT,
                    payload: playlist
                });
            }
        }
    }


    store.sort = async function (sortingCriteria) {
        let response = "";
        console.log(store.currentView + " in sort");
        if (store.currentView === 1)
            response = await api.getPlaylistPairs();
        else {
            console.log("yuh")

            response = await api.getPlaylists();
        }
        if (response.data.success) {
            let pairs = response.data.idNamePairs;
            console.log(sortingCriteria + " sorting criteria");
            switch (sortingCriteria) {
                case 1: {
                    pairs = pairs.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
                    break;
                }
                case 2: {
                    pairs = pairs.sort((a, b) => (new Date(a.playlist.publishedDate) > new Date(b.playlist.publishedDate)) ? -1 :
                        (new Date(a.playlist.publishedDate) < new Date(b.playlist.publishedDate)) ? 1 : 0);
                    break;
                }
                case 3: {
                    pairs = pairs.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
                    break;
                }
                case 4: {
                    pairs = pairs.sort((a, b) => a.playlist.likes.length > b.playlist.likes.length ? -1 : a.playlist.likes.length < b.playlist.likes.length ? 1 : 0);
                    break;
                }
                case 5: {
                    pairs = pairs.sort((a, b) => a.playlist.dislikes.length > b.playlist.dislikes.length ? -1 : a.playlist.dislikes.length < b.playlist.dislikes.length ? 1 : 0);
                    break;
                }
                default:
                    break;
            }
            if (store.currentView !== 1) {
                console.log("yeah i filtered gwuibgweug");
                pairs = pairs.filter((element) => element.playlist.published === true);
            }

            storeReducer({
                type: GlobalStoreActionType.SORT,
                payload: {
                    idNamePairs: pairs,
                    sortingCriteria: sortingCriteria,
                    currentView: store.currentView
                }
            });
            console.log("post reducer stress disorder");
        }

    }

    store.setView = async function (viewType) {
        // view type of 1 = home
        // 2 = all lists (search by playlist name)
        // 3 = all lists (search by username)
        console.log(store.currentView);
        if (viewType === 1) {
            let response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairs = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.SET_VIEW,
                    payload: {
                        currentView: viewType,
                        idNamePairs: pairs
                    }
                });
                return;
            }
        }
        let response = await api.getPlaylists();
        if (response.data.success) {
            let pairs = response.data.idNamePairs;
            let filteredPairs = pairs.filter((element) => element.playlist.published === true);
            console.log(filteredPairs);
            if (viewType === 2 || viewType === 3) {
                storeReducer({
                    type: GlobalStoreActionType.SET_VIEW,
                    payload: {
                        currentView: viewType,
                        idNamePairs: filteredPairs
                    }
                });
            }
        }
    }
    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: { id: id, playlist: playlist }
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function () {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToEdit }
        });
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToRemove }
        });
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        if (id === null) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: null
            });
            return;
        }
        async function asyncSetCurrentList(id) {
            let response = "";
            if (store.currentView === 1)
                response = await api.getPlaylistById(id);
            else {
                response = await api.getPlaylists();
                if (response.data.success) {
                    for (let element of response.data.idNamePairs) {
                        console.log(element);
                        if (element._id === id) {
                            storeReducer({
                                type: GlobalStoreActionType.SET_CURRENT_LIST,
                                payload: element.playlist
                            });
                        }
                    }
                }

                return;
            }
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    //history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    }
    store.addNewSong = function () {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function (index, song) {
        let list = store.currentList;
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function (start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function (index) {
        let list = store.currentList;
        list.songs.splice(index, 1);

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function (index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function () {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function () {
        return (store.currentList !== null);
    }
    store.canUndo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function () {
        return (store.currentList !== null);
    }

    store.clear = function () {
        tps.clearAllTransactions();
    }
    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
