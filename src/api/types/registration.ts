export interface Registration {
    admissionDate: string;
    email: string;
    employeeName: string,
    status: RegistrationStatus,
    cpf: string,
    id: string
}

export type RegistrationStatus = "REVIEW" | "APPROVED" | "REPROVED"