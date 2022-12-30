import * as React from "react"
import { ColorModeScript } from "@chakra-ui/react"
import { AuthProvider } from "providers/AuthProvider";
import ReactDOM from "react-dom"
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider} from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'
import { App } from "./App"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.render(
 
  <React.StrictMode>
    <ColorModeScript />
    <QueryClientProvider client={queryClient}> 
      <BrowserRouter>
        <AuthProvider>
        <App />
        <ReactQueryDevtools/>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root"),
)