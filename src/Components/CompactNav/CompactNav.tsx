import React from 'react';
import './CompactNav.scss';
import { ReactComponent as BackIcon } from '../../assets/back-icon.svg';
import { NavLink } from 'react-router-dom';

interface CompactNavPropsInterface {
    content: string,
    backTo: string
}



function CompactNav(props: CompactNavPropsInterface) {
    return <div className='compactNav'>
        <NavLink to={props.backTo}><BackIcon className='icon' /></NavLink>
        <p>{props.content}</p>
    </div>;
}

export default CompactNav;
