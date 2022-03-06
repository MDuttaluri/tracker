import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertContext } from '../../App'

interface RedirectPropsType {
    to: string,
    message: string
}

function Redirect(props: RedirectPropsType) {
    const navigate = useNavigate()
    const [alertData, setAlertData] = useContext(AlertContext);
    useEffect(() => {
        setAlertData({ ...alertData, message: props.message })
        navigate("/", {
            state: { redirect: props.to }
        })
    }, [])
    return (
        <></>
    )
}

export default Redirect