import { ButtonSmall } from "~/components/Buttons";
import * as S from "./styles";
import {
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineTrash,
} from "react-icons/hi";
import {
  Registration,
  RegistrationStatus,
  useDeleteRegistration,
  useUpdateRegistration,
} from "~/api";
import { useCallback, useContext } from "react";
import { LoaderContext } from "~/shared/loader";

type Props = {
  data: Registration;
};

const RegistrationCard = (props: Props) => {
  const updateRegistration = useUpdateRegistration();
  const deleteRegistration = useDeleteRegistration();
  const loaderContext = useContext(LoaderContext);

  const handleUpdateRegistration = useCallback(
    async (status: RegistrationStatus) => {
      loaderContext?.showLoader();
      await updateRegistration({ ...props.data, status });
      loaderContext?.hideLoader();
    },
    [props.data.id]
  );

  const handleDeleteRegistration = useCallback(async () => {
    loaderContext?.showLoader();
    await deleteRegistration(props.data.id);
    loaderContext?.hideLoader();
  }, [props.data.id]);
  return (
    <S.Card>
      <S.IconAndText>
        <HiOutlineUser />
        <h3>{props.data.employeeName}</h3>
      </S.IconAndText>
      <S.IconAndText>
        <HiOutlineMail />
        <p>{props.data.email}</p>
      </S.IconAndText>
      <S.IconAndText>
        <HiOutlineCalendar />
        <span>{props.data.admissionDate}</span>
      </S.IconAndText>
      <S.Actions>
        <ButtonSmall
          onClick={() => handleUpdateRegistration("REPROVED")}
          bgcolor="rgb(255, 145, 154)"
        >
          Reprovar
        </ButtonSmall>
        <ButtonSmall
          onClick={() => handleUpdateRegistration("APPROVED")}
          bgcolor="rgb(155, 229, 155)"
        >
          Aprovar
        </ButtonSmall>
        <ButtonSmall
          onClick={() => handleUpdateRegistration("REVIEW")}
          bgcolor="#ff8858"
        >
          Revisar novamente
        </ButtonSmall>

        <HiOutlineTrash onClick={handleDeleteRegistration} />
      </S.Actions>
    </S.Card>
  );
};

export default RegistrationCard;
