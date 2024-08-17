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
import { ActionModal } from "../../../../components/Modal";
import { useSnackbar } from "notistack";

type Props = {
  data: Registration;
};

export type Action = {
  label: string;
  onClick: () => void;
  bgcolor: string;
};

const statusTranslation = {
  APPROVED: "Aprovado",
  REPROVED: "Reprovado",
  REVIEW: "Revisar novamente",
};

const RegistrationCard = (props: Props) => {
  const updateRegistration = useUpdateRegistration();
  const deleteRegistration = useDeleteRegistration();
  const { enqueueSnackbar } = useSnackbar();

  const loaderContext = useContext(LoaderContext);

  const handleDeleteRegistration = useCallback(async () => {
    loaderContext?.showLoader();
    try {
      await deleteRegistration(props.data.id);
      enqueueSnackbar("Registro removido com sucesso", { variant: "success" });
    } catch (e) {
      enqueueSnackbar("Houve um erro na solicitação", { variant: "error" });
    }
    loaderContext?.hideLoader();
  }, [props.data.id, deleteRegistration, loaderContext, enqueueSnackbar]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentModalAction, setModalCurrentAction] =
    useState<RegistrationStatus | null>(null);

  const openModal = useCallback((action: RegistrationStatus) => {
    setModalCurrentAction(action);
    setIsModalOpen(true);
  }, []);

  const handleUpdateRegistration = useCallback(async () => {
    if (!currentModalAction) return;
    loaderContext?.showLoader();
    try {
      await updateRegistration({ ...props.data, status: currentModalAction });
      enqueueSnackbar("Status alterado com sucesso", { variant: "success" });
    } catch (e) {
      enqueueSnackbar("Houve um erro na solicitação", { variant: "error" });
    }
    loaderContext?.hideLoader();
  }, [
    currentModalAction,
    loaderContext,
    enqueueSnackbar,
    updateRegistration,
    props.data,
  ]);

  const actions: Action[] = [
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
        {props.data.status !== "REPROVED" && (
          <ButtonSmall
            onClick={() => openModal("REPROVED")}
            bgcolor="rgb(255, 145, 154)"
          >
            Reprovar
          </ButtonSmall>
        )}

        {props.data.status !== "APPROVED" && (
          <ButtonSmall
            onClick={() => openModal("APPROVED")}
            bgcolor="rgb(155, 229, 155)"
          >
            Aprovar
          </ButtonSmall>
        )}

        {props.data.status !== "REVIEW" && (
          <ButtonSmall onClick={() => openModal("REVIEW")} bgcolor="#ff8858">
            Revisar novamente
          </ButtonSmall>
        )}      

        <HiOutlineTrash role="iconDelete" onClick={handleDeleteRegistration} />
      </S.Actions>
      {currentModalAction && (
        <ActionModal
          isOpen={isModalOpen}
          title={`Alterar status para ${statusTranslation[currentModalAction]}`}
          onRequestClose={() => setIsModalOpen(false)}
          actions={actions}
        >
          Você tem certeza que deseja alterar o status de{" "}
          {props.data.employeeName} para {statusTranslation[currentModalAction]}
          ?
        </ActionModal>
      )}
    </S.Card>
  );
};

export default RegistrationCard;
