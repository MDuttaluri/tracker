import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { getTime, TaskPriority, TimeType } from '../Task/Task';
import { ReactComponent as AlertIcon } from '../../assets/alert.svg';
import { ReactComponent as EditIcon } from '../../assets/edit.svg';
import moment from 'moment';
import useThemeData from '../hooks/useThemeData';
import { ThemeDataType } from '../../ThemeUtils';
import useSpecificThemeData from '../hooks/useSpecificThemeData';


interface PriorityItemPropsType {
    priorityItem: PriorityItemType
}

export interface PriorityItemType {
    itemId: string,
    itemName: string,
    deadline: string,
    description: string,
    notes: string,
    priority: TaskPriority,
}


function PriorityItem(props: PriorityItemPropsType) {
    const priorityItem = props.priorityItem;
    const themeData = useThemeData()[0];
    const specificThemeData = useSpecificThemeData()[0];
    const [relativeDeadline, setRelativeDeadline] = useState({} as any)

    useEffect(() => {
        setRelativeDeadline(getTime(moment(), priorityItem.deadline, TimeType.DAYS));
    }, [priorityItem])

    return (
        <div className='priorityItem' style={specificThemeData as ThemeDataType}>
            {priorityItem && <>
                <div className='taskLeftDiv' >
                    <p style={{ fontWeight: "600" }}>{priorityItem.itemName}</p>
                    {
                        priorityItem.deadline &&
                        <div style={{ display: "flex", flexDirection: "column", columnGap: "0" }}>
                            <span style={{ fontWeight: '600' }}>Ends on</span>
                            <span>{priorityItem.deadline}</span>
                        </div>
                    }
                </div>
                <div className='taskRightDiv'>
                    <NavLink id={priorityItem.itemId} to={'/editPriorityItem/' + priorityItem.itemId}><EditIcon className='taskEditIcon' style={{ fill: (themeData as ThemeDataType).color }} height={'20px'} /></NavLink>
                    <p>{priorityItem.description}</p>
                    <p><span style={{ fontWeight: '600' }}>{relativeDeadline["body"]}</span></p>
                    <p>{priorityItem.notes}</p>
                </div>
            </>
            }
        </div>
    )
}



export default PriorityItem