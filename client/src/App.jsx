import React from "react";
import { Typography, AppBar } from "@material-ui/core";
import Notifications from "./components/Notifications";
import Options from "./components/Options";
import Video from "./components/Video";

export default function App() {
  return (
    <div>
      <AppBar position="static">
        <Typography variant="h2" align="center">
          VidCom
        </Typography>
      </AppBar>
      <Video />
      <Options>
        <Notifications />
      </Options>
    </div>
  );
}
