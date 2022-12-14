import * as yup from "yup";

const addMaterialSchema = yup.object().shape({
  name: yup
    .string()
    .required("Nome é um campo obrigatório.")
    .min(4, "O nome deve possuir no mínimo 4 caracteres.")
    .max(200, "O nome deve possuir no máximo 200 caracteres."),
  price: yup.string().required("Preço é um campo obrigatório."),
  status: yup.boolean().required("Status é um campo obrigatório."),
});

export default addMaterialSchema;
