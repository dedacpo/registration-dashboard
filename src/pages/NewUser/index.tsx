import TextField from "~/components/TextField";
import * as S from "./styles";
import Button from "~/components/Buttons";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { IconButton } from "~/components/Buttons/IconButton";
import { useHistory } from "react-router-dom";
import routes from "~/router/routes";
import * as Yup from "yup";
import { useState } from "react";
import { cpf as CPF } from "cpf-cnpj-validator";
import { Registration, usePostRegistration } from "~/api";
import { useSnackbar } from "notistack";

const form: Omit<Registration, "id"> = {
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

  const goToHome = () => {
    history.push(routes.dashboard);
  };

  const [formData, setFormData] = useState(form);
  const [errors, setErrors] = useState(form);

  const validationSchema = Yup.object().shape({
    employeeName: Yup.string().required("O campo 'Nome' é obrigatório"),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(
        {
          ...formData,
          admissionDate: new Date(formData.admissionDate).toISOString(),
          cpf: formData.cpf.replaceAll(".", "").replaceAll("-", ""),
        },
        { abortEarly: false }
      );
      try {
        await postRegistration(formData);
        enqueueSnackbar("Registro criado com sucesso", { variant: "success" });
      } catch {
        enqueueSnackbar("Houve um erro ao criar o registro", {
          variant: "error",
        });
      }
    } catch (err) {
      const validationErrors: { [key: string]: string } = {};
      (err as any).inner.forEach((error: Yup.ValidationError) => {
        validationErrors[error.path!] = error.message;
      });
      setErrors(validationErrors as any);
    }
  };

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
            {errors.employeeName && (
              <span>
                {errors.employeeName}
                <br />
              </span>
            )}

            {errors.email && (
              <span>
                {errors.email} <br />
              </span>
            )}

            {errors.cpf && (
              <span>
                {errors.cpf} <br />
              </span>
            )}

            {errors.admissionDate && <span>{errors.admissionDate}</span>}
          </p>

          <Button type="submit">Cadastrar</Button>
        </S.Card>
      </S.Container>
    </form>
  );
};

export default NewUserPage;
