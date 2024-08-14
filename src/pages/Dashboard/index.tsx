import Collumns from "./components/Columns";
import * as S from "./styles";
import { SearchBar } from "./components/Searchbar";
import { useGetRegistrations, useSearchByKey } from "~/api/hooks";
import { useCallback, useEffect, useState } from "react";
import { cpf as CPF } from "cpf-cnpj-validator";
import { Registration } from "~/api";

const DashboardPage = () => {
  const { data: registrations } = useGetRegistrations();

  const searchByKey = useSearchByKey();

  const [searchValue, setSearchValue] = useState<string>("");

  const [registrationsFromSearch, setRegistrationsFromSearch] = useState<
    Registration[] | null
  >(null);

  const search = useCallback(
    async (value: string) => {
      setSearchValue(value || "");
      if (value?.length && CPF.isValid(value)) {
        const result = await searchByKey({
          key: "cpf",
          value: value.replaceAll(".", "").replaceAll("-", ""),
        });
        setRegistrationsFromSearch(result);
      } else {
        const result = await searchByKey({ key: "cpf", value: "" });
        setRegistrationsFromSearch(result);
      }
    },
    [searchByKey]
  );

  useEffect(() => {
    const searchByKeyAsync = async () => {
      const result = await searchByKey({
        key: "cpf",
        value: searchValue.length
          ? searchValue.replaceAll(".", "").replaceAll("-", "")
          : "",
      });
      setRegistrationsFromSearch(result);
    };
    searchByKeyAsync();
  }, [registrations]);

  return (
    <S.Container>
      <SearchBar
        refetch={() => search(searchValue)}
        onChange={(event) => search(event.target.value)}
      />
      <Collumns registrations={registrationsFromSearch ?? registrations} />
    </S.Container>
  );
};
export default DashboardPage;
