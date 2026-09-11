export type DocumentStatus = "" | "available" | "not-available" | "not-sure";

export type CitizenProfile = {
  age: string;
  gender: string;
  state: string;
  district: string;
  annualIncome: string;
  occupation: string;
  category: string;
  studentStatus: string;
  disabilityStatus: string;
  familySize: string;
  existingBenefits: string[];
  documents: {
    aadhaar: DocumentStatus;
    incomeCertificate: DocumentStatus;
    casteCertificate: DocumentStatus;
    domicileCertificate: DocumentStatus;
    bonafideCertificate: DocumentStatus;
    bankAccount: DocumentStatus;
  };
};

export const initialCitizenProfile: CitizenProfile = {
  age: "",
  gender: "",
  state: "",
  district: "",
  annualIncome: "",
  occupation: "",
  category: "",
  studentStatus: "",
  disabilityStatus: "",
  familySize: "",
  existingBenefits: [],
  documents: {
    aadhaar: "",
    incomeCertificate: "",
    casteCertificate: "",
    domicileCertificate: "",
    bonafideCertificate: "",
    bankAccount: "",
  },
};