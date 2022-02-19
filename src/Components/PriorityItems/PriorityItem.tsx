import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { getTime, TaskPriority, TimeType } from '../Task/Task';
import { ReactComponent as AlertIcon } from '../../assets/alert.svg';
import { ReactComponent as EditIcon } from '../../assets/edit.svg';
import moment from 'moment';


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



    return (
        <NavLink id={priorityItem.itemId} to={'/editPriorityItem/' + priorityItem.itemId}>
            <div className='priorityItem' >
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
                    <EditIcon className='taskEditIcon' height={'20px'} />
                    <p>{priorityItem.description}</p>
                    <p><span style={{ fontWeight: '600' }}>{getTime(moment(), priorityItem.deadline, TimeType.DAYS)}</span> Days to go.</p>
                    <p>{priorityItem.notes}</p>
                </div>
            </div>
        </NavLink>
    )
}


function getStyleByPriority(priority: TaskPriority) {
    if (priority === TaskPriority.HIGH) {
        return {
            backgroundColor: "blue",
            color: "#fff"
        };

    } else if (priority === TaskPriority['VERY HIGH']) {
        return {
            backgroundColor: "blue",
            color: "#fff"
        };

    } else if (priority === TaskPriority.NORMAL) {
        return {
            backgroundColor: "blue",
            color: "#fff"
        };

    } else if (priority === TaskPriority.LOW) {
        return {
            backgroundColor: "blue",
            color: "#fff"
        };

    } else if (priority === TaskPriority['VERY LOW']) {
        return {
            backgroundColor: "blue",
            color: "#fff"
        };

    }
}

export default PriorityItem