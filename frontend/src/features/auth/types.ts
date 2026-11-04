export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};
export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  // add user fields as your backend returns them
};

export type AuthUser = {
  token: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
};
