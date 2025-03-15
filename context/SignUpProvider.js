import { createContext, useContext, useState } from "react";

const SignUpContext = createContext();

export const useSignUpContext = () => useContext(SignUpContext);

const SignUpProvider = ({ children }) => {
    const [form, setForm] = useState({
        name: "",
        school: "",
        major: "",
        career: "",
    });

    return (
        <SignUpContext.Provider value={{ form, setForm }}>
            {children}
        </SignUpContext.Provider>
    );
};

export default SignUpProvider;
