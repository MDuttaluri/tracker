import React, { RefObject, useContext, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AlertContext, UserContext } from '../../App';
import CompactNav from '../../Components/CompactNav/CompactNav';
import { getAuth, createUserWithEmailAndPassword, User, Auth, sendEmailVerification } from "firebase/auth";
import { initaliseFirebase } from '../../firebase';
import { ReactComponent as CrossIcon } from '../../assets/cross.svg';
import { ReactComponent as CheckIcon } from '../../assets/check.svg';


let auth: Auth;

function Signup() {
    const FADE_TRANSITION_DELAY_MS = 200;
    const initFormDivRef = useRef<HTMLDivElement>(null);
    const finalFormDivRef = useRef<HTMLDivElement>(null);
    const mailIdRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmationRef = useRef<HTMLInputElement>(null);
    const [errorCode, setErrorCode] = useState([]);
    const [alertData, setAlertData] = useContext(AlertContext);
    const { userData, setUserData } = useContext(UserContext);
    const [isInitSetupDone, setIsInitSetupDone] = useState(false);
    const [authUserData, setAuthUserData] = useState({} as User);

    function validateForm(e: any) {
        e.preventDefault();
        //alert("pre")

        const mail = mailIdRef?.current?.value;

        if (mail) {
            if (!mail.includes('@') || !mail.includes('.')) {
                return;
            }
        } else {
            return;
        }
        const password = passwordRef?.current?.value;
        const passwordConfirmation = passwordConfirmationRef?.current?.value;
        if (!password || !passwordConfirmation) {
            return;
        } else {
            if (password !== passwordConfirmation) {
                return;
            }
        }


        createUserWithEmailAndPassword(auth, mail, password)
            .then((userCredentials) => {
                setAuthUserData(userCredentials.user);
                setAlertData({ ...alertData, message: "Account created!" })
                setUserData({ ...userData, name: userCredentials.user.email })
                startFormTransition();
            })
            .catch((err) => {
                setAlertData({ ...alertData, message: err + "" })
            })




    }

    function startFormTransition() {
        initFormDivRef?.current?.style.setProperty("animation", "fadeOut ease forwards " + FADE_TRANSITION_DELAY_MS + "ms")
        setTimeout(() => {
            setIsInitSetupDone(true)
            finalFormDivRef.current?.style?.setProperty("animation", "fadeIn ease forwards " + FADE_TRANSITION_DELAY_MS + "ms");
        }, FADE_TRANSITION_DELAY_MS)
    }

    async function isInitSetupAlreadyDone() {
        if (userData.name && userData.name != "Guest") {
            startFormTransition();
        }
    }

    useEffect(() => {
        auth = getAuth();
        auth.onAuthStateChanged((user) => {
            setAuthUserData(user as User);
        })
        isInitSetupAlreadyDone();
    }, [userData])

    return (
        <div>
            <CompactNav backTo="/" content='Create an Account' extraLink={{ label: userData?.name, link: "#" }} />
            <div className='expandableFrom' ref={initFormDivRef} hidden={isInitSetupDone}>

                <form className='form authenticationForm'>
                    <h1 style={{ textAlign: "center" }}>Sign Up!</h1>

                    <div className='formRow'>
                        <label>Mail ID : </label>
                        <input type="text" ref={mailIdRef} />
                    </div>
                    <div className='formRow'>
                        <label>Password : </label>
                        <input type="password" ref={passwordRef} />
                    </div>
                    <div className='formRow'>
                        <label>Confirm your password : </label>
                        <input type="password" ref={passwordConfirmationRef} />
                    </div>
                    <NavLink style={{ textAlign: "center", fontWeight: "600", letterSpacing: "1px", wordSpacing: "3px" }} to="/login">Looking to login?</NavLink>
                    <button className='primaryButton' onClick={validateForm}>Go!</button>
                </form>
            </div>
            <div className='expandableFrom' style={{ opacity: '0' }} ref={finalFormDivRef} hidden={!isInitSetupDone}>
                <form className='form authenticationForm'>
                    <h1 style={{ textAlign: "center" }}>Finish setting up your account</h1>
                    <div className='formRow'>
                        <label>Name : </label>
                        <input type="text" />
                    </div>
                    <div className='formRow' style={{ justifyContent: "left", columnGap: "25px" }}>
                        <span>Email Verification : </span>
                        <span>{
                            authUserData?.emailVerified ?
                                <CheckIcon height={'37px'} /> :
                                <div style={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
                                    <CrossIcon height={'37px'} />
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        if (authUserData)
                                            sendEmailVerification(authUserData)
                                                .then(() => {
                                                    setAlertData({ ...alertData, message: "Verification mail sent!" })
                                                })
                                                .catch((reason) => {
                                                    setAlertData({ ...alertData, message: reason + "" })
                                                })
                                    }} className='secondaryButton'>Send Verification</button>
                                </div>}</span>
                    </div>

                    <NavLink style={{ textAlign: "center", fontWeight: "600", letterSpacing: "1px", wordSpacing: "3px" }} to="/login">Looking to login?</NavLink>
                    <button className='primaryButton' onClick={validateForm}>Save</button>
                </form>
            </div>
        </div>
    );
}



export default Signup;

