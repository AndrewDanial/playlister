import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

function CommentCard(username, comment) {

    return (
        <Grid container direction="column" sx={{ marginTop: '15px', display: 'flex', backgroundColor: "pink", padding: 2, borderStyle: "solid", borderColor: "black" }}>
            <Box sx={{ fontSize: "40px", color: "blue", fontWeight: "bold" }}>
                {username}
            </Box>
            <Box sx={{ fontSize: "24px", maxWidth: "100%", overflowWrap: "break-word" }}>
                {comment}
            </Box>
        </Grid>
    )

}

export default CommentCard;
