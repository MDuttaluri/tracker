import React from 'react';
import { NavLink } from 'react-router-dom';
import './TilesContainerStyles.scss';

interface TilePropInterface {
    content: string,
    toURL: string
}

function TilesContainer() {
    return <div className='tilesContainer'>
        <Tile toURL='/tasks' content='Tasks' />
        <Tile toURL='/' content='Journal' />
        <Tile toURL='/' content='Calculator' />
        <Tile toURL='/' content='Settings' />
    </div>;
}

function Tile(props: TilePropInterface) {
    return (
        <NavLink to={props.toURL}>
            <div className='tile'>
                <p>{props.content}</p>
            </div>
        </NavLink>
    )
}

export default TilesContainer;
