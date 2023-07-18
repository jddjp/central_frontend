import * as React from "react"
import { AuthProvider } from "providers/AuthProvider";
import ReactDOM from "react-dom/client"
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider} from "react-query";
import { App } from "./App"
import { ChakraProvider } from "@chakra-ui/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      keepPreviousData: false,
      staleTime: 5*(60*1000), // 5 mins
      cacheTime: 10*(60*1000), // 10 mins
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
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ChakraProvider>
)