import React, { useContext, useEffect, useRef, useState } from 'react'
import CompactNav from '../CompactNav/CompactNav';
import { ReactComponent as AddIcon } from '../../assets/addTask.svg';
import { ReactComponent as FilterIcon } from '../../assets/filter.svg';
import { AppThemeContext, PrioritiesContext, UserContext } from '../../App';
import { ReactComponent as NewTaskIcon } from '../../assets/createTask.svg';



import PriorityItem from './PriorityItem';
import { ItemsSortType, ItemsStatusType, loadDeadlineSortedItemsFromLocalStorage, loadPriorityItemsDataFromLocalStorage, loadPriSortedItemsFromLocalStorage, prepareDeadlineSortPriorityItems, preparePriSortPriorityItems, syncPriorityDataFromServer } from './PriorityItemUtils';
import './PriorityItemStyles.scss';
import { AppThemeType, getThemeStyles, ThemeDataType } from '../../ThemeUtils';
import useThemeData from '../hooks/useThemeData';
import useSpecificThemeData from '../hooks/useSpecificThemeData';
import { NavLink } from 'react-router-dom';
import useFirestore from '../hooks/useFirestore';
import usePriorityIndexedDB from '../hooks/usePriorityIndexedDB';
import { IDBPDatabase } from 'idb';


function PrioritiesHome() {
    const { prioritiesData, setPrioritiesData } = useContext(PrioritiesContext);
    const [sortType, setSortType] = useState(ItemsSortType.PRIORITY);
    const [itemsList, setItemsList] = useState(<></>);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [itemStatus, setItemStatus] = useState(ItemsStatusType.ALL);
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const { themeMode, setThemeMode } = useContext(AppThemeContext);
    const themeData = useThemeData()[0];
    const specificThemeData = useSpecificThemeData()[0];
    const [isAnimatingTheDiv, setIsAnimatingTheDiv] = useState(false)
    const { userData, setUserData } = useContext(UserContext);
    const db = useFirestore();
    const idb: IDBPDatabase<unknown> = usePriorityIndexedDB() as any;

    async function syncAndLoadData() {
        syncPriorityDataFromServer(idb, db, userData.id, setUserData);
        await loadPriorityItemsDataFromLocalStorage(idb);
    }

    async function renderPriorityItemsAsync() {
        renderPriorityItems(await getItemsOrder());
    }

    async function loadAndRenderItems() {
        await loadPriorityItemsDataFromLocalStorage(idb);
        renderPriorityItems(await getItemsOrder());
    }

    useEffect(() => {
        syncAndLoadData();
    }, [])

    async function getItemsOrder() {
        let itemOrder;
        if (sortType == ItemsSortType.PRIORITY) {
            itemOrder = loadPriSortedItemsFromLocalStorage(idb);
            if (!itemOrder || (itemOrder && itemOrder.length === 0)) {
                itemOrder = await preparePriSortPriorityItems(idb);
            }
        } else if (sortType == ItemsSortType.DEADLINE) {
            itemOrder = loadDeadlineSortedItemsFromLocalStorage(idb);
            if (!itemOrder || (itemOrder && itemOrder.length === 0)) {
                itemOrder = await prepareDeadlineSortPriorityItems(idb);
            }
        }
        return itemOrder;
    }

    useEffect(() => {
        renderPriorityItemsAsync();
    }, [sortType, itemStatus]);

    useEffect(() => {
        renderPriorityItemsAsync();
    }, [prioritiesData]);

    useEffect(() => {
        // console.log('====================================');
        // console.log(`IDB READY AND ABOUT TO LOAD THE DATA`);
        // console.log('====================================');
        loadAndRenderItems();
    }, [idb])

    function renderPriorityItems(items: []) {
        // console.log('====================================');
        // console.log(`RENDER METHOD WITH ITEMS`);
        // console.log(items);
        // console.log(prioritiesData);
        // console.log('====================================');
        const itemKeys = Object.keys(prioritiesData);
        let noItemsAvaiable = true;

        if (itemKeys.length == 0) {
            return setItemsList(<div className='createNewTaskDialog'>
                <NewTaskIcon className='svg' />
                <p>It's all clear here. <br />Log an item now!</p>
                <NavLink to="/createPriorityItem"><button className='primaryButton'>Create Item</button></NavLink>
            </div>);
        } else {
            setItemsList(
                <>
                    {
                        items.map((item, idx) => {

                            if (itemStatus === ItemsStatusType.ALL || prioritiesData[item[0]]['status'] === itemStatus) {
                                noItemsAvaiable = false;
                                return <PriorityItem key={`priItem` + idx} priorityItem={prioritiesData[item[0]]} />
                            }
                            else
                                return <></>
                        })
                    }
                </>
            );

        }
        if (noItemsAvaiable) {
            setItemsList(<div className='createNewTaskDialog'>
                <NewTaskIcon className='svg' />
                <p>It's all clear here. <br />Log an item now!</p>
                <NavLink to="/createPriorityItem"><button className='primaryButton'>Create Item</button></NavLink>
            </div>)
        }
    }

    return (
        <div style={themeData as ThemeDataType}>
            <CompactNav backTo='/' content='Priorities' extraLink={{ label: <AddIcon />, link: "/createPriorityItem" }} />
            <div className="filtersDiv" style={specificThemeData as ThemeDataType}>
                <span>Sort by : </span>
                <button className='filterButton' style={getFilterButtonStyle(sortType, ItemsSortType.PRIORITY, themeMode)} onClick={(e) => { e.preventDefault(); setSortType(ItemsSortType.PRIORITY) }}>Priority</button>
                <button className='filterButton' style={getFilterButtonStyle(sortType, ItemsSortType.DEADLINE, themeMode)} onClick={(e) => { e.preventDefault(); setSortType(ItemsSortType.DEADLINE) }}>Deadline</button>
                <button className='filterButtonIcon' onClick={() => {
                    if (isAnimatingTheDiv) {
                        return;
                    }
                    if (!showFilterMenu) {
                        setShowFilterMenu(!showFilterMenu)
                        filterMenuRef.current?.style.setProperty("animation", "expandDiv 0.5s ease forwards")
                    }
                    else {
                        filterMenuRef.current?.style.setProperty("animation", "closeDiv 0.5s ease forwards");
                        setIsAnimatingTheDiv(true);
                        console.log(`animation started`);

                        setTimeout(() => {
                            setShowFilterMenu(!showFilterMenu);
                            setIsAnimatingTheDiv(false);
                            console.log(`animation ended`);

                        }, 500)
                    }

                }}><FilterIcon height={'25px'} /></button>
            </div>
            <div ref={filterMenuRef} className="expandableDiv" hidden={!showFilterMenu}>
                <div className="filtersDiv expandable--inner" style={specificThemeData as ThemeDataType}>
                    <span>Status : </span>
                    <button className='filterButton' style={getFilterButtonStyle(itemStatus, ItemsStatusType.ALL, themeMode)} onClick={(e) => { e.preventDefault(); setItemStatus(ItemsStatusType.ALL) }}>All</button>
                    <button className='filterButton' style={getFilterButtonStyle(itemStatus, ItemsStatusType.INPROGRESS, themeMode)} onClick={(e) => { e.preventDefault(); setItemStatus(ItemsStatusType.INPROGRESS) }}>In progess</button>
                    <button className='filterButton' style={getFilterButtonStyle(itemStatus, ItemsStatusType.COMPLETED, themeMode)} onClick={(e) => { e.preventDefault(); setItemStatus(ItemsStatusType.COMPLETED) }}>Completed</button>
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

function getFilterButtonStyle(currentSelection: ItemsSortType | ItemsStatusType, callerType: ItemsSortType | ItemsStatusType, appTheme: AppThemeType) {
    if (currentSelection === callerType) {
        return {
            backgroundColor: "rgb(35, 112, 255)",
            color: "#fff"
        }
    } else {
        if (appTheme === AppThemeType.LIGHT) {
            return {
                backgroundColor: "#fff",
                color: "#000"
            }
        } else {
            return {
                backgroundColor: "#000",
                color: "#fff",
                boxShadow: "none",
            }
        }
    }
}

export default PrioritiesHome