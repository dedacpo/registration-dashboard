import TextField from "~/components/TextField";
import * as S from "./styles";
import Button from "~/components/Buttons";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { IconButton } from "~/components/Buttons/IconButton";
import { useHistory } from "react-router-dom";
import routes from "~/router/routes";
import * as Yup from "yup";
import { useCallback, useContext, useState } from "react";
import { cpf as CPF } from "cpf-cnpj-validator";
import { usePostRegistration } from "~/api";
import { useSnackbar } from "notistack";
import { ActionModal } from "~/components/Modal";
import { LoaderContext } from "~/components/Loader";


type RegistrationForm = {
  employeeName: string;
  email: string;
  cpf: string;
  admissionDate: string;
  status: "APPROVED" | "REPROVED" | "REVIEW";
};

const form: RegistrationForm = {
  employeeName: "",
  email: "",
  cpf: "",
  admissionDate: "",
  status: "REVIEW",
};

const NewUserPage = () => {
  const history = useHistory();
  const postRegistration = usePostRegistration();
  const { enqueueSnackbar } = useSnackbar();
  const loaderContext = useContext(LoaderContext);

  const goToHome = useCallback(() => {
    history.push(routes.dashboard);
  }, [history]);

  const [formData, setFormData] = useState<RegistrationForm>(form);
  const [errors, setErrors] = useState<RegistrationForm | null>(form);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validationSchema = Yup.object().shape({
    employeeName: Yup.string()
      .required("O campo 'Nome' é obrigatório")
      .test(
        "employeeName",
        "Nome deve conter ao menos 2 letras",
        (value) => value?.length > 2
      )
      .test(
        "employeeName",
        "Nome deve conter ao menos um espaço em branco",
        (value) => value?.match(/\s/) !== null
      )
      .test(
        "employeeName",
        "Nome não deve começar com números",
        (value) => value[0]?.match(/[0-9]/) === null
      ),
    email: Yup.string()
      .email("Formato de email inválido")
      .required("O campo 'Email' é obrigatório"),
    cpf: Yup.string()
      .required("O campo 'CPF' é obrigatório")
      .test("cpf", "CPF inválido", (value) => CPF.isValid(value)),
    admissionDate: Yup.string()
      .datetime()
      .required("O campo 'Data de admissão' é obrigatório"),
  });

  const validateForm = useCallback(async () => {
    await validationSchema.validate(
      {
        ...formData,
        admissionDate: formData.admissionDate.length
          ? new Date(formData.admissionDate).toISOString()
          : "",
      },
      { abortEarly: false }
    );
  }, [validationSchema, formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await validateForm();
        setErrors(null);
        setIsModalOpen(true);
      } catch (err) {
        const validationErrors: { [key: string]: string } = {};
        (err as any).inner?.forEach((error: Yup.ValidationError) => {
          validationErrors[error.path!] = error.message;
        });
        setErrors(validationErrors as any);
      }
    },
    [validationSchema, formData, setIsModalOpen, setErrors, validateForm]
  );

  const handleConfirmation = useCallback(async () => {
    const [year, month, day] = formData.admissionDate.split("-");
    try {
      loaderContext?.showLoader();
      await postRegistration({
        ...formData,
        cpf: formData.cpf.replaceAll(".", "").replaceAll("-", ""),
        admissionDate: `${day}/${month}/${year}`,
      });
      loaderContext?.hideLoader();
      enqueueSnackbar("Registro criado com sucesso", { variant: "success" });
      goToHome();
    } catch {
      enqueueSnackbar("Houve um erro ao criar o registro", {
        variant: "error",
      });
    }
  }, [formData, postRegistration, loaderContext, enqueueSnackbar, goToHome]);

  const actions = [
    {
      label: "Cancelar",
      onClick: () => setIsModalOpen(false),
      bgcolor: "rgb(255, 145, 154)",
    },
    {
      label: "Confirmar",
      onClick: handleConfirmation,
      bgcolor: "rgb(155, 229, 155)",
    },
  ];


  return (
    <form onSubmit={handleSubmit}>
      <S.Container>
        <S.Card>
          <IconButton onClick={() => goToHome()} aria-label="back">
            <HiOutlineArrowLeft size={24} />
          </IconButton>
          <TextField
            value={formData.employeeName}
            placeholder="Nome"
            label="Nome"
            onChange={(e) =>
              setFormData({ ...formData, employeeName: e.target.value })
            }
          />
          <TextField
            value={formData.email}
            placeholder="Email"
            label="Email"
            type="email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            value={formData.cpf}
            placeholder="CPF"
            label="CPF"
            mask="999.999.999-99"
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          />
          <TextField
            value={formData.admissionDate}
            label="Data de admissão"
            type="date"
            onChange={(e) =>
              setFormData({ ...formData, admissionDate: e.target.value })
            }
          />
          <p style={{ color: "red" }}>
            {errors?.employeeName && (
              <span>
                {errors.employeeName}
                <br />
              </span>
            )}

            {errors?.email && (
              <span>
                {errors.email} <br />
              </span>
            )}

            {errors?.cpf && (
              <span>
                {errors?.cpf} <br />
              </span>
            )}

            {errors?.admissionDate && <span>{errors.admissionDate}</span>}
          </p>

          <Button type="submit">Cadastrar</Button>
        </S.Card>
      </S.Container>
      <ActionModal
        isOpen={isModalOpen}
        title={`Criar novo registro`}
        onRequestClose={() => setIsModalOpen(false)}
        actions={actions}
      >
        Deseja criar um novo registro para:
        <div>{formData.employeeName}?</div>
      </ActionModal>
    </form>
  );
};

export default NewUserPage;
