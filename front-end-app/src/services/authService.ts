// src/services/authService.ts
export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  // Here you can implement the logic to call your backend API
  // For this example, we will just log the data
  console.log("Registering user", { username, email, password });
};

export const loginUser = async (email: string, password: string) => {
  // Here you can implement the logic to call your backend API
  // For this example, we will just log the data
  console.log("Logging in user", { email, password });
};
