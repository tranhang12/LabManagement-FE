import apiClient from "./apiClient";

export interface SignupData {
  userName: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  isAdmin: number;
}

export interface SignupResponse {
  status: boolean;
  message: string;
}

export const signUp = async (
  signupData: SignupData
): Promise<SignupResponse> => {
  try {
    const response = await apiClient.post('/signup', signupData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.code === 'ER_DUP_ENTRY') {
      throw new Error('Username already exists in the system');
    } else {
      const errorMessage = (error as Error).message;
      throw new Error(`Error in signUp: ${errorMessage}`);
    }
  }
};