import * as React from "react"
import { ColorModeScript } from "@chakra-ui/react"
import { AuthProvider } from "providers/AuthProvider";
import ReactDOM from "react-dom"
import { BrowserRouter } from 'react-router-dom';

import { App } from "./App"

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
)