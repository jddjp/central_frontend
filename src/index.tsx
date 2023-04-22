import * as React from "react"
import { AuthProvider } from "providers/AuthProvider";
import ReactDOM from "react-dom"
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider} from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'
import { App } from "./App"
import { ChakraProvider } from "@chakra-ui/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}> 
        <BrowserRouter>
          <AuthProvider>
            <App />
          <ReactQueryDevtools/>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root"),
)