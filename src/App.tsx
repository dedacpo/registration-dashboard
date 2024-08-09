import Router from "~/router";
import { Header } from "./components/Header";
import { QueryProvider } from "~/api/query-provider";

function App() {
  return (
    <>
    <QueryProvider>
      <Header>
        <h1>Caju Front Teste</h1>
      </Header>
      <Router />
      </QueryProvider>
    </>
  );
}

export default App;
