import React, { useEffect, useState } from 'react';
import './SelectorStyles.scss';
import { ReactComponent as UpArrowIcon } from '../../assets/upArrow.svg';
import { ReactComponent as DownArrowIcon } from '../../assets/downArrow.svg';

function getPriorityColor(level: number) {
    if (level === 1) {
        return "#23ffab";
    } else if (level === 2) {
        return "rgb(35, 112, 255)";
    } else if (level === 3) {
        return "#ffe923";
    } else if (level === 4) {
        return "#ff8623";
    } else {
        return "#f5300d";
    }
}

interface SelectorPropsInterface {
    setterFn: any;
}

function Selector(props: SelectorPropsInterface) {
    const [level, setLevel] = useState(0);

    useEffect(() => {
        if (props.setterFn) {
            props.setterFn(level)
        }
    }, [level])

    const maxLevel = 5;

    function renderItems() {
        let items = []
        for (let i = 0; i < maxLevel; i++) {
            items.push(<div onClick={() => {
                if (i < level)
                    setLevel(level + 1)
                else
                    setLevel(level - 1)
            }} className={'level--' + (i < level ? 'selected' : 'unselected')} style={{ backgroundColor: (i < level ? getPriorityColor(level) : "#fff") }} />)
        }
        return items;
    }

    return <div className='selector'>
        <UpArrowIcon onClick={() => {
            if (level < maxLevel) {
                setLevel(level + 1)
            }
        }} className='arrowIcon' />
        {
            renderItems()
        }
        <DownArrowIcon onClick={() => {
            if (level > 0) {
                setLevel(level - 1)
            }
        }} className='arrowIcon' />
    </div>;
}

export default Selector
