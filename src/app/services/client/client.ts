export interface Client {
  id: string;
  name: string;
  TIN?: string;
  contactPerson?: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  email?: string;
  city?: string;
  subCity?: string;
  woreda?: string;
  houseNumber?: string;
  files?: string[];
  createdAt: Date;
  updatedAt: Date;
}
