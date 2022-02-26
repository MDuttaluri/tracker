import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AlertContext, UserContext } from '../../App';
import CompactNav from '../../Components/CompactNav/CompactNav';
import { getAuth, createUserWithEmailAndPassword, User, signInWithEmailAndPassword, UserCredential, Auth } from "firebase/auth";
import './AuthenticationStyles.scss';
import Loading from '../../Components/Loading/Loading';
import useAuth from '../../Components/hooks/useAuth';


function Login() {
    const [loggedInUser, setLoggedInUser] = useState({} as User);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { userData, setUserData } = useContext(UserContext);
    const [alertData, setAlertData] = useContext(AlertContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();


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
        if (userData.name && userData.name != "Guest") {
            setIsAlreadyLoggedIn(true);
        }
    }, [userData])



    return <div>

        {isLoading && <Loading fullDiv={true} />}
        <CompactNav backTo='/' content='Login' extraLink={{ label: userData?.name, link: "#" }} />
        {isAlreadyLoggedIn && <AlreadyLoggedInDialog userMailId={userData?.name || ""} />}
        {!isAlreadyLoggedIn &&
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
                <NavLink style={{ textAlign: "center", fontWeight: "600", letterSpacing: "1px", wordSpacing: "3px" }} to="/signup">Looking to signup?</NavLink>
                <button onClick={loginHandler} className='primaryButton'>Go!</button>
            </form>
        }
    </div>;
}

interface AlreadyLoggedInDialogPropsType {
    userMailId: string
}

function AlreadyLoggedInDialog(props: AlreadyLoggedInDialogPropsType) {
    const [progressValue, setProgressValue] = useState(0);
    const navigate = useNavigate();

    let localProgressVal = 0;
    let progressInterval: any;

    useEffect(() => {
        progressInterval = setInterval(() => {
            if (localProgressVal < 100)
                localProgressVal += 20;
            setProgressValue(localProgressVal)
        }, 1000)

        return () => {
            clearInterval(progressInterval)
        }
    }, [])

    useEffect(() => {
        if (progressValue >= 100) {
            clearInterval(progressInterval);
            navigate("/")
        }
        return () => { clearInterval(progressInterval) }
    }, [progressValue])

    return (
        <div className='alreadyLoggedIn'>
            <p>You are already logged in as <span style={{ color: 'rgb(35, 112, 255)' }}>{props.userMailId}</span> .</p>
            <p>You will now be re-directed to the home page.</p>
            <div className='progress'>
                <div className='progressInner' style={{ width: `${progressValue}%` }}></div>
            </div>
        </div>
    );
}


export default Login;
