import Sidebar from "./components/Sidebar";
import { Box } from "@mui/material";



export default function Page(){
    return(
        <div>
        <Box sx={{display:"flex",height:"100vh",overflow:"hidden"}}>
        <Sidebar/>
        </Box>
       
    </div>
    );
  
   

}