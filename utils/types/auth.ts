export type SignUpType = {
  email: string;
  userName: string;
  password: string;
  repeatPassword?: string;
};

export type SignUpDto = Omit<SignUpType, 'repeatPassword'>;
export type LoginDto = Omit<SignUpType, 'userName' | 'repeatPassword'>;
