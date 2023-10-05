import ReactDOM from "react-dom/client"
import { AuthProvider } from "providers/AuthProvider";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { App } from "./App"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      keepPreviousData: true
    }
  }
})

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
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
)