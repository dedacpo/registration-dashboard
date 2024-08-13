import { HiRefresh } from "react-icons/hi";
import { useHistory } from "react-router-dom";
import Button from "~/components/Buttons";
import { IconButton } from "~/components/Buttons/IconButton";
import TextField from "~/components/TextField";
import routes from "~/router/routes";
import * as S from "./styles";
import { InputHTMLAttributes } from "react";

type SearchBarProps = {
  label?: string;
  error?: string;
  refetch: () => void;
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
        mask="999.999.999-99"
      />

      <S.Actions>
        <IconButton aria-label="refetch" onClick={props.refetch}>
          <HiRefresh />
        </IconButton>
        <Button onClick={() => goToNewAdmissionPage()}>Nova Admissão</Button>
      </S.Actions>
    </S.Container>
  );
};
