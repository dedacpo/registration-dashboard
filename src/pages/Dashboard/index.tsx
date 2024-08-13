import Collumns from "./components/Columns";
import * as S from "./styles";
import { SearchBar } from "./components/Searchbar";
import { useGetRegistrations, useSearchByKey } from "~/api/hooks";
import { useCallback, useEffect, useState } from "react";
import { Registration } from "~/api";
import { cpf as CPF } from "cpf-cnpj-validator";

const DashboardPage = () => {
  const getRegistrations = useGetRegistrations();
  const searchByKey = useSearchByKey();

  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");

  const search = useCallback(
    async (value: string) => {
      setSearchValue(value || "");
      if (value?.length && CPF.isValid(value)) {
        const result = await searchByKey({
          key: "cpf",
          value: value.replaceAll(".", "").replaceAll("-", ""),
        });
        setRegistrations(result);
      } else {
        const data = await getRegistrations();
        setRegistrations(data);
      }
    },
    [searchByKey, getRegistrations]
  );

  useEffect(() => {
    const fetchRegistrations = async () => {
      const data = await getRegistrations();
      setRegistrations(data);
    };
    fetchRegistrations();
  }, [getRegistrations]);

  return (
    <S.Container>
      <SearchBar refetch={() => search(searchValue)} onChange={(event) => search(event.target.value)} />
      <Collumns registrations={registrations} />
    </S.Container>
  );
};
export default DashboardPage;
