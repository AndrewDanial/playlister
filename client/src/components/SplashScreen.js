import { ButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
export default function SplashScreen() {

    const buttonStyle = {
        marginLeft: "10%",
        marginRight: "10%",
        width: "500px",
        height: "100px"
    }

    return (
        <div id="splash-screen">
            <div>
                <img src="playlisterlogo.png" alt="Playlister Logo"></img>
                <div id="subtitle">
                    Create, edit, and share playlists here!
                </div>
            </div>

            <ButtonGroup id="splashbuttons" sx={{}}>
                <Button variant="contained" sx={buttonStyle}>Register</Button>
                <Button variant="contained" sx={buttonStyle}>Login</Button>
                <Button variant="contained" sx={buttonStyle}>Continue As Guest</Button>
            </ButtonGroup>
        </div >

    )
}
