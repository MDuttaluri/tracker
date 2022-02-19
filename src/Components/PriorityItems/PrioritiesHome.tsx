import React, { useContext, useEffect, useRef, useState } from 'react'
import CompactNav from '../CompactNav/CompactNav';
import { ReactComponent as AddIcon } from '../../assets/addTask.svg';
import { ReactComponent as FilterIcon } from '../../assets/filter.svg';
import { PrioritiesContext } from '../../App';


import PriorityItem from './PriorityItem';
import { ItemsSortType, ItemsStatusType, loadDeadlineSortedItemsFromLocalStorage, loadPriSortedItemsFromLocalStorage, prepareDeadlineSortPriorityItems, preparePriSortPriorityItems } from './PriorityItemUtils';
import './PriorityItemStyles.scss';
import { getThemeStyles, ThemeDataType } from '../../ThemeUtils';
import useThemeData from '../hooks/useThemeData';


function PrioritiesHome() {
    const { prioritiesData, setPrioritiesData } = useContext(PrioritiesContext);
    const [sortType, setSortType] = useState(ItemsSortType.PRIORITY);
    const [itemsList, setItemsList] = useState(<></>);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [itemStatus, setItemStatus] = useState(ItemsStatusType.ALL);
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const [themeData, setThemeData] = useThemeData();

    function getItemsOrder() {
        let itemOrder;
        if (sortType == ItemsSortType.PRIORITY) {
            itemOrder = loadPriSortedItemsFromLocalStorage();
            if (!itemOrder || (itemOrder && itemOrder.length === 0)) {
                itemOrder = preparePriSortPriorityItems();
            }
        } else if (sortType == ItemsSortType.DEADLINE) {
            itemOrder = loadDeadlineSortedItemsFromLocalStorage();
            if (!itemOrder || (itemOrder && itemOrder.length === 0)) {
                itemOrder = prepareDeadlineSortPriorityItems();
            }
        }
        return itemOrder;
    }

    useEffect(() => {
        renderPriorityItems(getItemsOrder());
    }, [sortType, itemStatus]);

    useEffect(() => {
        renderPriorityItems(getItemsOrder());
    }, [prioritiesData]);

    function renderPriorityItems(items: []) {
        const itemKeys = Object.keys(prioritiesData);
        if (itemKeys.length == 0) {
            return setItemsList(<div>
                <p>No items available...</p>
            </div>);
        } else {
            setItemsList(
                <>
                    {
                        items.map((item, idx) => {

                            if (itemStatus === ItemsStatusType.ALL || prioritiesData[item[0]]['status'] === itemStatus)
                                return <PriorityItem key={`priItem` + idx} priorityItem={prioritiesData[item[0]]} />
                            else
                                return <></>
                        })
                    }
                </>
            );

        }
    }

    return (
        <div style={themeData as ThemeDataType}>
            <CompactNav backTo='/' content='Priorities' extraLink={{ label: <AddIcon />, link: "/createPriorityItem" }} />
            <div className="filtersDiv" style={themeData as ThemeDataType}>
                <span>Sort by : </span>
                <button className='filterButton' style={getFilterButtonStyle(sortType, ItemsSortType.PRIORITY)} onClick={(e) => { e.preventDefault(); setSortType(ItemsSortType.PRIORITY) }}>Priority</button>
                <button className='filterButton' style={getFilterButtonStyle(sortType, ItemsSortType.DEADLINE)} onClick={(e) => { e.preventDefault(); setSortType(ItemsSortType.DEADLINE) }}>Deadline</button>
                <button className='filterButtonIcon' onClick={() => {
                    if (!showFilterMenu)
                        filterMenuRef.current?.setAttribute("animation", "expandDiv 2s ease forwards")
                    //filterMenuRef.current?.setAttribute("background-color", "green")
                    else
                        filterMenuRef.current?.setAttribute("animation", "closeDiv 2s ease forwards")

                    //setShowFilterMenu(!showFilterMenu)
                }}><FilterIcon height={'25px'} /></button>
            </div>
            <div ref={filterMenuRef} className="expandableDiv">
                <div className="filtersDiv" style={{ display: showFilterMenu ? "none" : "flex" }}>
                    <span>Select type of data : </span>
                    <button className='filterButton' style={getFilterButtonStyle(itemStatus, ItemsStatusType.ALL)} onClick={(e) => { e.preventDefault(); setItemStatus(ItemsStatusType.ALL) }}>All</button>
                    <button className='filterButton' style={getFilterButtonStyle(itemStatus, ItemsStatusType.INPROGRESS)} onClick={(e) => { e.preventDefault(); setItemStatus(ItemsStatusType.INPROGRESS) }}>In progess</button>
                    <button className='filterButton' style={getFilterButtonStyle(itemStatus, ItemsStatusType.COMPLETED)} onClick={(e) => { e.preventDefault(); setItemStatus(ItemsStatusType.COMPLETED) }}>Completed</button>
                </div>

            </div>
            <div className='outerDiv grid--center taskList' style={themeData as ThemeDataType}>
                {
                    itemsList
                }
            </div>

        </div>
    )
}

function getFilterButtonStyle(currentSelection: ItemsSortType | ItemsStatusType, callerType: ItemsSortType | ItemsStatusType) {
    if (currentSelection === callerType) {
        return {
            backgroundColor: "rgb(35, 112, 255)",
            color: "#fff"
        }
    } else {
        return {
            backgroundColor: "#fff",
            color: "#000"
        }
    }
}

export default PrioritiesHome