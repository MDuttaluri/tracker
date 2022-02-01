import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AlertContext, UserContext } from '../../App';
import CompactNav from '../../Components/CompactNav/CompactNav';
import { getAuth, createUserWithEmailAndPassword, User, signInWithEmailAndPassword, UserCredential, Auth } from "firebase/auth";
import './AuthenticationStyles.scss';
import Loading from '../../Components/Loading/Loading';

let auth: Auth;

function Login() {
    const [loggedInUser, setLoggedInUser] = useState({} as User);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { userData, setUserData } = useContext(UserContext);
    const [alertData, setAlertData] = useContext(AlertContext);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();



    function loginHandler(e: any) {
        e.preventDefault();
        setIsLoading(true)
        if (usernameRef?.current?.value && passwordRef?.current?.value) {
            signInWithEmailAndPassword(auth, usernameRef?.current?.value, passwordRef?.current?.value)
                .then((userCredentials: UserCredential) => {
                    setUserData({ ...userData, name: userCredentials?.user?.email });
                    setAlertData({ ...alertData, message: 'Welcome back ' + userCredentials?.user?.email })
                    navigate("/");
                    setIsLoading(false);
                })
                .catch((reason) => {
                    setAlertData({ ...alertData, message: reason + "" })
                    setIsLoading(false);
                })
            // .finally(() => {

            // })
        }
    }

    useEffect(() => {
        auth = getAuth();
    }, [])



    return <div>
        {isLoading && <Loading fullDiv={true} />}
        <CompactNav backTo='/' content='Login' extraLink={{ label: userData?.name, link: "#" }} />
        <form className='form authenticationForm'>

            <h1 style={{ textAlign: "center" }}>Login</h1>
            <div className='formRow'>
                <label>Username : </label>
                <input type="text" ref={usernameRef} />
            </div>
            <div className='formRow'>
                <label>Password : </label>
                <input type="password" ref={passwordRef} />
            </div>
            <NavLink style={{ textAlign: "center", fontWeight: "600", letterSpacing: "1px", wordSpacing: "3px" }} to="#">Forgot password?</NavLink>
            <button onClick={loginHandler} className='primaryButton'>Go!</button>
        </form>
    </div>;
}




export default Login;
