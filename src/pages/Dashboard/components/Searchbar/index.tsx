import { HiRefresh } from "react-icons/hi";
import { useHistory } from "react-router-dom";
import Button from "~/components/Buttons";
import { IconButton } from "~/components/Buttons/IconButton";
import TextField from "~/components/TextField";
import routes from "~/router/routes";
import * as S from "./styles";
import { InputHTMLAttributes, useCallback, useState } from "react";
import { useSearchByKey } from "~/api";

type SearchBarProps = {
  label?: string;
  error?: string;
} & InputHTMLAttributes<any>


export const SearchBar = (props: SearchBarProps) => {
  const history = useHistory();

  const goToNewAdmissionPage = () => {
    history.push(routes.newUser);
  };

  return (
    <S.Container>
      <TextField
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        placeholder="Digite um CPF válido"
      />

      <S.Actions>
        <IconButton aria-label="refetch">
          <HiRefresh />
        </IconButton>
        <Button onClick={() => goToNewAdmissionPage()}>Nova Admissão</Button>
      </S.Actions>
    </S.Container>
  );
};
