import Router from "~/router";
import { Header } from "./components/Header";
import { QueryProvider } from "~/api/query-provider";
import { LoaderProvider } from "./shared/loader";

function App() {
  return (
    <>
      <QueryProvider>
        <LoaderProvider>
          <Header>
            <h1>Caju Front Teste</h1>
          </Header>
          <Router />
        </LoaderProvider>
      </QueryProvider>
    </>
  );
}

export default App;
