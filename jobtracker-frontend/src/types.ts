export type CompanyStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Company {
  id: number;
  name: string;
  position: string;
  status: CompanyStatus;
}

export interface CompanyPage {
  content: Company[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
