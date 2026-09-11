export type DocumentStatus = "" | "available" | "not-available" | "not-sure";

export type CitizenProfile = {
  age: string;
  gender: string;
  state: string;
  city: string;
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
    studentId: DocumentStatus;
  };
};

export const initialCitizenProfile: CitizenProfile = {
  age: "",
  gender: "",
  state: "",
  city: "",
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
    studentId: "",
  },
};