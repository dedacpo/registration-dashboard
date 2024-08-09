import Collumns from "./components/Columns";
import * as S from "./styles";
import { SearchBar } from "./components/Searchbar";
import { useGetRegistrations } from "~/api/hooks";

const DashboardPage = () => {

  const {data: registrations} = useGetRegistrations();
  console.log("Testando github actions CI/CD")
  return (
    <S.Container>
      <SearchBar />
      <Collumns registrations={registrations} />
    </S.Container>
  );
};
export default DashboardPage;
