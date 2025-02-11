import React, { useEffect } from "react";
import LoadingBtn from "../../Components/LoadingBtn";
import { useAppDispatch, useAppSelector } from "../../store";
import { loginAsync, resetlogin, setEmailOrUsername, setMessageLogin, setPasswordLogin, setShowPasswordLogin  } from "../../store/loginSlice";
import PasswordInput from "../../Components/PasswordInput";
import ErrorMessage from "../../Components/ErrorMessage";
import { addToast } from "../../store/toastSlice";
import { LoginSchema } from "../../validators/zod";
import CustomNavLink from "../../Components/CustomNavLink";

const Login = (): React.ReactNode => {

    const emailOrUsername = useAppSelector(state => state.login.emailOrUsername);
    const password = useAppSelector(state => state.login.password);
    const message = useAppSelector(state => state.login.message);
    const error = useAppSelector(state => state.login.error);
    const state = useAppSelector(state => state.login.state);
    const showPassword = useAppSelector(state => state.login.showPassword);
    const token = useAppSelector(state => state.core.token);
    const dispatch = useAppDispatch();

    const setShowPassword = (value: boolean) => {
        dispatch(setShowPasswordLogin(value));
    }


    useEffect(() => {
        dispatch(resetlogin());
    }, []);

    useEffect(() => {
        if(error.length > 0){
            dispatch(addToast({ mesaage: error, type: "error" }));
        }
    }, [error]);

    useEffect(() => {
        if(token){
            dispatch(addToast({ mesaage: "Login Successfull", type: "success" }));
        }
    }, [token])

    const onEmailOrUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setEmailOrUsername(value));
    }

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setPasswordLogin(value))
    }

    const onLoginClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(setMessageLogin(""));
        const formData = { emailOrUsername, password };
        const check = LoginSchema.safeParse(formData);
        if(!check.success){
            dispatch(setMessageLogin("Invalid Credintials"));
            return;
        }
        dispatch(loginAsync({ emailOrUsername, password, dispatch }));
    }

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Login now!</h1>
                <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                <div className="form-control">
                    <label className="label">
                    <span className="label-text">Email or Username</span>
                    </label>
                    <input value={emailOrUsername} placeholder="email or username" onChange={onEmailOrUsernameChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                    <label className="label">
                    <span className="label-text">Password</span>
                    </label>
                    <PasswordInput 
                        password={password} 
                        showing={showPassword} 
                        setShowing={setShowPassword} 
                        onPasswordChange={onPasswordChange} 
                        placeholder = "Password"
                        />
                    <label className="label">
                    <CustomNavLink to="/recover-account" text="Forgot password?" />
                    </label>
                </div>
                <ErrorMessage text ={message}/>
                <div className="form-control mt-6">
                    <LoadingBtn loading= {state === "loading"} label="Login" onClick = {onLoginClick}/>
                </div>
                <CustomNavLink to="/signup" text="Don't have an account? Signup now"/>
                </div>
            </div>
            </div>
        </div>
    )
}
export default Login;