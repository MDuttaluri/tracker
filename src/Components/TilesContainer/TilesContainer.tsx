import React from 'react';
import { NavLink } from 'react-router-dom';
import './TilesContainerStyles.scss';
import { ReactComponent as TasksIcon } from '../../assets/tasks.svg';
import { ReactComponent as BookIcon } from '../../assets/book.svg';
import { ReactComponent as CalcIcon } from '../../assets/calc.svg';
import { ReactComponent as GearIcon } from '../../assets/gear.svg';
import useThemeData from '../hooks/useThemeData';
import { ThemeDataType } from '../../ThemeUtils';
import useSpecificThemeData from '../hooks/useSpecificThemeData';

interface TilePropInterface {
    content: string,
    toURL: string,
    icon?: any
}


function TilesContainer() {
    const themeData = useThemeData()[0];

    function getFillColor() {
        if (themeData) {
            return (themeData as ThemeDataType).color;
        }
        return "#fff";
    }

    return <div className='tilesContainer' style={themeData as ThemeDataType}>
        <Tile toURL='/tasks' content='Tasks' icon={<TasksIcon height={'30px'} fill={getFillColor()} />} />
        <Tile toURL='/priorities' content='Priority Items' icon={<BookIcon height={'30px'} fill={getFillColor()} />} />
        <Tile toURL='/calculator' content='Calculator' icon={<CalcIcon height={'30px'} fill={getFillColor()} />} />
        <Tile toURL='/settings' content='Settings' icon={<GearIcon height={'30px'} fill={getFillColor()} />} />
    </div>;
}

function Tile(props: TilePropInterface) {
    const themeData = useSpecificThemeData()[0];
    return (
        <NavLink to={props.toURL} style={themeData as ThemeDataType}>
            <div className='tile' >
                {props.icon}
                <p>{props.content}</p>
            </div>
        </NavLink>
    )
}

export default TilesContainer;
