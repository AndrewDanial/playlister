import { ButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom'
export default function SplashScreen() {

    const buttonStyle = {
        marginLeft: "10%",
        marginRight: "10%",
        width: "20vw",
        height: "10vh",
        transform: "translate(0, -50%)"
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
                <Button href="/register/" variant="contained" sx={buttonStyle} >Register</Button>
                <Button href="/login/" variant="contained" sx={buttonStyle}>Login</Button>
                <Button href="/" variant="contained" sx={buttonStyle} >Continue As Guest</Button>
            </ButtonGroup>
        </div >

    )
}
