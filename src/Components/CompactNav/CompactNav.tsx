import React, { useContext } from 'react';
import './CompactNav.scss';
import { ReactComponent as BackIcon } from '../../assets/back-icon.svg';
import { NavLink } from 'react-router-dom';
import { AppThemeContext } from '../../App';
import { AppThemeType, saveThemeChoiceToLocalStorage } from '../../ThemeUtils';

interface CompactNavExtraLinkInterface {
    link: string,
    label: any
}

interface CompactNavPropsInterface {
    content: string,
    backTo: string,
    extraLink?: CompactNavExtraLinkInterface | null
}




function CompactNav(props: CompactNavPropsInterface) {
    const { themeMode, setThemeMode } = useContext(AppThemeContext);

    return <div className='compactNav'>
        <NavLink to={props.backTo} className='CompactNav--link'><BackIcon className='icon' /></NavLink>
        <p>{props.content}</p>
        {props.extraLink && <NavLink to={props.extraLink.link}>{props.extraLink.label}</NavLink>}
    </div>;
}

export default CompactNav;
