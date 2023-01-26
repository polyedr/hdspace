export interface Validator {
  validate: (input: string) => ValidationError[];
}

export interface ValidationError {
  keyPart: string;
  message: string;
}
