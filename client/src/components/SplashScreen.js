import { ButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom'
import GlobalStoreContext from "../store";
import { useContext } from 'react';
import { useHistory } from 'react-router-dom'
export default function SplashScreen() {

    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
    const buttonStyle = {
        marginLeft: "10%",
        marginRight: "10%",
        width: "20vw",
        height: "10vh",
        transform: "translate(0, -50%)"
    }

    function continueAsGuest() {
        store.continueAsGuest();
    }

    function handleLogin() {
        history.push("/login/");
    }

    function handleRegister() {
        history.push("/register/")
    }

    return (
        <div id="splash-screen">
            <div>
                <img src="playlisterlogo.png" alt="Playlister Logo"></img>
                <div id="subtitle">
                    Create, edit, and share playlists here!
                </div>
            </div>

            <ButtonGroup id="splashbuttons">
                <Button onClick={handleRegister} variant="contained" sx={buttonStyle} >Register</Button>
                <Button onClick={handleLogin} variant="contained" sx={buttonStyle}>Login</Button>
                <Button onClick={continueAsGuest} href="" variant="contained" sx={buttonStyle} >Continue As Guest</Button>
            </ButtonGroup>
        </div >

    )
}
