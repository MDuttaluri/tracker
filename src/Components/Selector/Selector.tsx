import React, { useContext, useEffect, useState } from 'react';
import './SelectorStyles.scss';
import { ReactComponent as UpArrowIcon } from '../../assets/upArrow.svg';
import { ReactComponent as DownArrowIcon } from '../../assets/downArrow.svg';
import { AppThemeContext } from '../../App';
import { AppThemeType } from '../../ThemeUtils';

function getPriorityColor(level: number) {
    if (level === 0) {
        return "#23ffab";
    } else if (level === 1) {
        return "rgb(35, 112, 255)";
    } else if (level === 2) {
        return "#ffe923";
    } else if (level === 3) {
        return "#ff8623";
    } else {
        return "#f5300d";
    }
}

interface SelectorPropsInterface {
    setterFn: any;
    initLevel?: number;
}


function getUnselectedCellColor(level: number, currentIdx: number, themeSelected: AppThemeType) {
    if (currentIdx <= level) {
        return { backgroundColor: getPriorityColor(level) };
    }
    if (themeSelected === AppThemeType.DARK) {
        return {
            backgroundColor: "#000",
            border: "solid 1px rgb(35, 112, 255)"
        }
    } else {
        return {
            backgroundColor: "#fff"
        }
    }
}

function Selector(props: SelectorPropsInterface) {
    const [level, setLevel] = useState(props.initLevel || 0);
    const { themeMode, setThemeMode } = useContext(AppThemeContext);

    useEffect(() => {
        if (props.setterFn) {
            props.setterFn(level)
        }
    }, [level])

    const maxLevel = 5;

    function renderItems() {
        let items = []
        for (let i = 0; i < maxLevel; i++) {
            items.push(<div key={'selectorDiv' + i} className={'level--' + (i < level ? 'selected' : 'unselected')} style={{ ...getUnselectedCellColor(level, i, themeMode) }} />)
        }
        return items;
    }

    return <div className='selector'>
        <DownArrowIcon onClick={() => {
            if (level > 0) {
                setLevel(level - 1)
            }
        }} className='arrowIcon' />
        {
            renderItems()
        }


        <UpArrowIcon onClick={() => {
            if (level < maxLevel) {
                setLevel(level + 1)
            }
        }} className='arrowIcon' />
    </div>;
}

export default Selector
