import React, { RefObject, useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AlertContext, UserContext } from '../../App';
import CompactNav from '../../Components/CompactNav/CompactNav';
import { getAuth, createUserWithEmailAndPassword, User, Auth, sendEmailVerification } from "firebase/auth";
import { initaliseFirebase } from '../../firebase';
import { ReactComponent as CrossIcon } from '../../assets/cross.svg';
import { ReactComponent as CheckIcon } from '../../assets/check.svg';
import useAuth from '../../Components/hooks/useAuth';
import useSpecificThemeData from '../../Components/hooks/useSpecificThemeData';
import { ThemeDataType } from '../../ThemeUtils';
import useThemeData from '../../Components/hooks/useThemeData';




function Signup() {
    const FADE_TRANSITION_DELAY_MS = 200;
    const initFormDivRef = useRef<HTMLDivElement>(null);
    const finalFormDivRef = useRef<HTMLDivElement>(null);
    const mailIdRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const passwordConfirmationRef = useRef<HTMLInputElement>(null);
    const [errorCode, setErrorCode] = useState([]);
    const [alertData, setAlertData] = useContext(AlertContext);
    const { userData, setUserData } = useContext(UserContext);
    const [isInitSetupDone, setIsInitSetupDone] = useState(false);
    const [authUserData, setAuthUserData] = useState({} as User);
    const auth = useAuth();
    const specificThemeData = useSpecificThemeData()[0];
    const themeData = useThemeData()[0] as ThemeDataType;
    const navigate = useNavigate();


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

    function formFinalSave(e: any) {
        e.preventDefault();
        setAlertData({ ...alertData, message: "Account creation completed." })
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
        isInitSetupAlreadyDone();
    }, [userData])

    useEffect(() => {
        setAuthUserData(auth.currentUser as User);
        console.log('====================================');
        console.log(auth.currentUser?.emailVerified);
        console.log('====================================');
    }, [auth])

    return (
        <div>
            <CompactNav backTo="/" content='Create an Account' extraLink={{ label: <p style={{ color: themeData.color }}>{userData?.name}</p>, link: "#" }} />
            <div className='expandableFrom' ref={initFormDivRef} hidden={isInitSetupDone}>

                <form className='form authenticationForm'>
                    <h1 style={{ textAlign: "center" }}>Sign Up!</h1>

                    <div className='formRow'>
                        <label>Mail ID : </label>
                        <input type="text" ref={mailIdRef} style={themeData as ThemeDataType} />
                    </div>
                    <div className='formRow'>
                        <label>Password : </label>
                        <input type="password" ref={passwordRef} style={themeData as ThemeDataType} />
                    </div>
                    <div className='formRow'>
                        <label>Confirm your password : </label>
                        <input type="password" ref={passwordConfirmationRef} style={themeData as ThemeDataType} />
                    </div>
                    <NavLink style={{ textAlign: "center", fontWeight: "600", letterSpacing: "1px", wordSpacing: "3px" }} to="/login">Looking to login?</NavLink>
                    <button className='primaryButton' onClick={validateForm}>Go!</button>
                </form>
            </div>
            <div className='expandableFrom' style={{ opacity: '0' }} ref={finalFormDivRef} hidden={!isInitSetupDone}>
                <form className='form authenticationForm'>
                    <h1 style={{ textAlign: "center" }}>Finish setting up your account</h1>
                    <p style={{ textAlign: "center" }}>This is an optional step and would not affect the application usage. Feel free to skip.</p>
                    <div className='formRow'>
                        <label>Name : </label>
                        <input type="text" ref={nameRef} style={themeData as ThemeDataType} />
                    </div>
                    <div className='formRow' style={{ columnGap: "25px", gridTemplateColumns: "auto auto auto" }}>
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
                                    }} className='secondaryButton' style={specificThemeData as ThemeDataType}>Send Verification</button>
                                </div>}</span>
                    </div>

                    <button className='primaryButton' onClick={formFinalSave}>Save</button>
                </form>
            </div >
        </div >
    );
}



export default Signup;

