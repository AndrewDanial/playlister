import React, { useRef, useState } from "react";
import YouTube from "react-youtube";
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"

function Player(props) {
    const [curr_song, setIndex] = useState(0);
    const playerRef = useRef(null);
    console.log(props.playlist);
    let songIds = []
    for (let i of props.playlist.songs) {
        songIds.push(i.youTubeId);
    }
    const playerOptions = {
        height: "300",
        width: "640",
        playerVars: {
            'playsinline': 1,
            'origin': "https://www.youtube.com"
        }
    };

    function onPlayerReady(event) {
        playerRef.current = event.target;
        loadAndPlayCurrentSong();
        event.target.playVideo();

    }

    function loadAndPlayCurrentSong() {
        let song = props.playlist.songs[curr_song].youTubeId;
        console.log(song);
        playerRef.current.loadVideoById(song);
        playerRef.current.playVideo();
    }

    function incSong() {
        setIndex((curr_song + 1) % props.playlist.songs.length);
    }
    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {

        let playerStatus = event.data;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            incSong();
            loadAndPlayCurrentSong();
            console.log("0 Video ended");
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    return (
        < div >

            {
                props.playlist.songs.length > 0 ? <YouTube
                    opts={playerOptions}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}
                    videoId={props.playlist.songs[curr_song].youTubeId}
                /> : null
            }

            <div>
                <button
                    onClick={() => {
                        if (playerRef.current.getPlayerState() !== 1) {
                            playerRef.current.mute();
                            playerRef.current.playVideo();
                            playerRef.current.unMute();
                        }
                    }}
                >
                    Play
                </button>
                <button
                    onClick={() => {
                        if (playerRef.current.getPlayerState() !== 2) {
                            playerRef.current.pauseVideo();
                        }
                    }}
                >
                    Pause
                </button>
            </div>
            <Grid container direction="column" sx={{ fontSize: "32pt" }}>
                {
                    props.playlist.songs.length > 0 ?
                        <Box>
                            Playlist: {props.playlist.name}
                        </Box> : null
                }

                {
                    props.playlist.songs.length > 0 ?
                        <Box>
                            Song #: {curr_song + 1}
                        </Box> : null
                }
                {
                    props.playlist.songs.length > 0 ?
                        <Box>
                            Title: {props.playlist.songs[curr_song].title}
                        </Box> : null
                }

                {
                    props.playlist.songs.length > 0 ?
                        <Box>
                            Artist: {props.playlist.songs[curr_song].artist}
                        </Box> : null
                }

            </Grid>


        </div >
    );
};


export default Player;
