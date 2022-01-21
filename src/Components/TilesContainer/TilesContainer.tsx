import React from 'react';
import { NavLink } from 'react-router-dom';
import './TilesContainerStyles.scss';
import { ReactComponent as TasksIcon } from '../../assets/tasks.svg';
import { ReactComponent as BookIcon } from '../../assets/book.svg';
import { ReactComponent as CalcIcon } from '../../assets/calc.svg';
import { ReactComponent as GearIcon } from '../../assets/gear.svg';

interface TilePropInterface {
    content: string,
    toURL: string,
    icon?: any
}

function TilesContainer() {
    return <div className='tilesContainer'>
        <Tile toURL='/tasks' content='Tasks' icon={<TasksIcon height={'30px'} />} />
        <Tile toURL='/' content='Journal' icon={<BookIcon height={'30px'} />} />
        <Tile toURL='/calculator' content='Calculator' icon={<CalcIcon height={'30px'} />} />
        <Tile toURL='/' content='Settings' icon={<GearIcon height={'30px'} />} />
    </div>;
}

function Tile(props: TilePropInterface) {
    return (
        <NavLink to={props.toURL}>
            <div className='tile'>
                {props.icon}
                <p>{props.content}</p>
            </div>
        </NavLink>
    )
}

export default TilesContainer;
