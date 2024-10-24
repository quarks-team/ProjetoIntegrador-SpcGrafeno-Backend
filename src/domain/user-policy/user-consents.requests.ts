export type UpdateUserConsentRequest = {
  userId: number;
  consents: Consent[];
};

export type Consent = {
  id: number;
  status: boolean;
  isMandatory: boolean;
};
