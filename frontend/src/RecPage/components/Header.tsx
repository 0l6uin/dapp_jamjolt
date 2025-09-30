import React, { CSSProperties } from "react";
import { User } from "../recpage";
import {HomeButton} from '../styles/RecPage';

interface Props {
  onSignIn: () => void;
  onSignOut: () => void;
  user: User | null
}

const headerStyle: CSSProperties = {
  padding: 0,
  backgroundColor: "transparent",
  color: "white",
  width: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export default function Header(props: Props) {
  return (
    <header style={headerStyle}>
      <div style={{ fontWeight: "bold" }}></div>

      <div>
        {props.user === null ? (
          <HomeButton onClick={props.onSignIn}>Sign in</HomeButton>
        ) : (
          <div>
            @{props.user.username} <button type="button" onClick={props.onSignOut}>Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
}
