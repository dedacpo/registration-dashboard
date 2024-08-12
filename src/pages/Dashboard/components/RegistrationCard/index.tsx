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
import { useCallback, useContext, useState } from "react";
import { LoaderContext } from "~/components/Loader";
import { Modal } from "../../../../components/Modal";

type Props = {
  data: Registration;
};

const statusTranslation = {
  APPROVED: "Aprovado",
  REPROVED: "Reprovado",
  REVIEW: "Revisar novamente",
};

const RegistrationCard = (props: Props) => {
  const updateRegistration = useUpdateRegistration();
  const deleteRegistration = useDeleteRegistration();

  const loaderContext = useContext(LoaderContext);

  const handleDeleteRegistration = useCallback(async () => {
    loaderContext?.showLoader();
    await deleteRegistration(props.data.id);
    loaderContext?.hideLoader();
  }, [props.data.id]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentModalAction, setModalCurrentAction] =
    useState<RegistrationStatus | null>(null);

  const openModal = useCallback(
    (action: RegistrationStatus) => {
      setModalCurrentAction(action);
      setIsModalOpen(true);
    },
    [setModalCurrentAction, setIsModalOpen]
  );

  const handleUpdateRegistration = useCallback(async () => {
    loaderContext?.showLoader();
    if (!currentModalAction) return;
    await updateRegistration({ ...props.data, status: currentModalAction });
    loaderContext?.hideLoader();
  }, [props.data.id]);

  const actions = [
    {
      label: "Cancelar",
      onClick: () => {
        setIsModalOpen(false);
        setModalCurrentAction(null);
      },
      bgcolor: "rgb(255, 145, 154)",
    },
    {
      label: "Confirmar",
      onClick: () => handleUpdateRegistration(),      
      bgcolor: "rgb(155, 229, 155)",
    },
  ];
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
          onClick={() => openModal("REPROVED")}
          bgcolor="rgb(255, 145, 154)"
        >
          Reprovar
        </ButtonSmall>
        <ButtonSmall
          onClick={() => openModal("APPROVED")}
          bgcolor="rgb(155, 229, 155)"
        >
          Aprovar
        </ButtonSmall>
        <ButtonSmall onClick={() => openModal("REVIEW")} bgcolor="#ff8858">
          Revisar novamente
        </ButtonSmall>

        <HiOutlineTrash onClick={handleDeleteRegistration} />
      </S.Actions>
      {currentModalAction && (
        <Modal
          isOpen={isModalOpen}
          title={`Alterar status para ${statusTranslation[currentModalAction]}`}
          onRequestClose={() => setIsModalOpen(false)}
          actions={actions}
        >
          Você tem certeza que deseja alterar o status de {props.data.employeeName} para {statusTranslation[currentModalAction]}?
        </Modal>
      )}
    </S.Card>
  );
};

export default RegistrationCard;
