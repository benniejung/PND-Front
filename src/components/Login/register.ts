
export type UserData = {
    email: string;
    password: string;
};

export interface FormState<T> {
    result?: T;
    message: string;
    isSuccess: boolean;
};

export const defaultFormState: FormState<UserData> = {
    result: undefined,
    message: "",
    isSuccess: false,
  };

const registerAction = async (prevState: FormState<UserData> | undefined, formData: FormData) : Promise<FormState<UserData>> => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    return {
        result: { email, password },
        message: "회원가입 성공",
        isSuccess: true,
    }
};

export default registerAction;