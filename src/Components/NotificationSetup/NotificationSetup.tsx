import React, { useContext, useRef, useState } from 'react'
import { AlertContext } from '../../App';
import { ThemeDataType } from '../../ThemeUtils';
import { isValidTime } from '../../Utilities';
import useThemeData from '../hooks/useThemeData';
import { loadPriorityItemNotificationsFromLocal, savePriorityItemNotificationsOnLocal } from '../PriorityItems/PriorityItemUtils';
import './NotificationSetupStyles.scss';

interface NotificationSetupPropType {
    itemId: string
}

function NotificationSetup(props: NotificationSetupPropType) {
    const themeData = useThemeData()[0];
    const dateRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);
    const [alertData, setAlertData] = useContext(AlertContext);

    const [notificationData, setNotificationData] = useState({});


    function createNotification(e: any) {
        e.preventDefault();
        const datePicked = dateRef.current?.value || "";
        const timePicked = timeRef.current?.value || "";
        if (!isValidTime(timePicked) || datePicked.length === 0) {
            setAlertData({ ...alertData, message: "Invalid date or time selected for notification" })
            return;
        }
        let allNotifications: any = loadPriorityItemNotificationsFromLocal();
        let notificationsOnGivenDate: any = allNotifications[datePicked] || {};
        let notificationsOnGivenTime = notificationsOnGivenDate[timePicked] || [];
        notificationsOnGivenTime.push(props.itemId);
        notificationsOnGivenDate[timePicked] = notificationsOnGivenTime;
        allNotifications[datePicked] = notificationsOnGivenDate;
        savePriorityItemNotificationsOnLocal(allNotifications);
    }

    return (
        <div className='notificationOuter'>
            <input type='date' ref={dateRef} placeholder='dd-mm-yyyy' style={themeData as ThemeDataType} />
            <div className='addNotificationDiv'>
                <input type='text' ref={timeRef} placeholder='hh:mm:ss' style={themeData as ThemeDataType} />
                <button onClick={createNotification} >Add</button>
            </div>
        </div>
    )
}

export default NotificationSetup