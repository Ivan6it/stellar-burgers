import { Dispatch, SetStateAction } from 'react';
import { PageUIProps } from '../common-type';

export type LoginUIProps = PageUIProps & {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  errorText: string;
  handleSubmit: (e: React.SyntheticEvent) => void;
};
