import * as React from "react"
import { ColorModeScript } from "@chakra-ui/react"
import { AuthProvider } from "providers/AuthProvider";
import ReactDOM from "react-dom"
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider} from "react-query";
import { App } from "./App"

const queryClient = new QueryClient()

ReactDOM.render(
 
  <React.StrictMode>
    <ColorModeScript />
    <QueryClientProvider client={queryClient}> 
      <BrowserRouter>
        <AuthProvider>
        <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root"),
)