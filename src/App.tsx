import Router from "~/router";
import { Header } from "./components/Header";
import { QueryProvider } from "~/api/query-provider";
import { LoaderProvider } from "./components/Loader";
import { SnackbarProvider } from 'notistack';


function App() {
  return (
    <>
      <SnackbarProvider maxSnack={3}>
        <QueryProvider>
          <LoaderProvider>
            <Header>
              <h1>Caju Front Teste</h1>
            </Header>
            <Router />
          </LoaderProvider>
        </QueryProvider>
      </SnackbarProvider>
    </>
  );
}

export default App;
