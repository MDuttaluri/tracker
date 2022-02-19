import moment from "moment";
import { TaskPriority } from "../Task/Task";

export const PRIORITY_ITEMS_LOCALSTORAGE_PATH = "priorityItems";
export const PRIORITY_ITEMS_PRISORTED_LOCALSTORAGE_PATH = "priorityItemsPriSorted";
export const PRIORITY_ITEMS_DEADLINESORTED_LOCALSTORAGE_PATH = "priorityItemsDeadlineSorted";
export const PRISORT_DATA_PRIORITY_INDEX = 1;

export enum ItemsSortType {
    'PRIORITY', 'DEADLINE'
}
export enum ItemsStatusType {
    'COMPLETED', 'INPROGRESS', 'ALL'
}


export function savePriorityItemsToLocalStorage(items: any) {
    let localItems = localStorage.getItem(PRIORITY_ITEMS_LOCALSTORAGE_PATH);
    // if (localItems) {
    //     localItems = JSON.parse(localItems);
    //     localItems = { ...(localItems as any), items }
    // } else {
    //     localItems = items
    // }
    //const stringItems = JSON.stringify(localItems);
    const stringItems = JSON.stringify(items);
    localStorage.setItem(PRIORITY_ITEMS_LOCALSTORAGE_PATH, stringItems);
}


export function loadPriorityItemsDataFromLocalStorage() {
    let localItems = localStorage.getItem(PRIORITY_ITEMS_LOCALSTORAGE_PATH);
    if (localItems) {
        localItems = JSON.parse(localItems);
        return localItems;
    } else {
        return {}
    }
}

export function loadPriSortedItemsFromLocalStorage() {
    let localItems = localStorage.getItem(PRIORITY_ITEMS_PRISORTED_LOCALSTORAGE_PATH);
    if (localItems) {
        localItems = JSON.parse(localItems);
        return localItems;
    } else {
        return []
    }
}

export function savePriSortedItemsOnLocalStorge(items: []) {
    const stringItems = JSON.stringify(items);
    localStorage.setItem(PRIORITY_ITEMS_PRISORTED_LOCALSTORAGE_PATH, stringItems);
}


export function preparePriSortPriorityItems(items?: any) {

    // PRISORT -> PRIORITY BASED SORTING OF ITEMS.
    if (!items) {
        items = loadPriorityItemsDataFromLocalStorage();
    }

    let localPriItems = loadPriSortedItemsFromLocalStorage();


    let itemsArray = [] as any;
    Object.keys(items).map((key) => {
        let newItem = [items[key]?.itemId, items[key]?.priority];
        itemsArray.push(newItem);

    })
    itemsArray = itemsArray.sort(sortByPriority);
    savePriSortedItemsOnLocalStorge(itemsArray);
    return itemsArray;
}

export function loadDeadlineSortedItemsFromLocalStorage() {
    let localItems = localStorage.getItem(PRIORITY_ITEMS_DEADLINESORTED_LOCALSTORAGE_PATH);
    if (localItems) {
        localItems = JSON.parse(localItems);
        return localItems;
    } else {
        return []
    }
}

export function saveDeadlineSortedItemsOnLocalStorge(items: []) {
    const stringItems = JSON.stringify(items);
    localStorage.setItem(PRIORITY_ITEMS_DEADLINESORTED_LOCALSTORAGE_PATH, stringItems);
}

export function prepareDeadlineSortPriorityItems(items?: any) {

    // DEADLINE -> DEADLINE BASED SORTING OF ITEMS.
    if (!items) {
        items = loadPriorityItemsDataFromLocalStorage();
    }

    let localPriItems = loadDeadlineSortedItemsFromLocalStorage();


    let itemsArray = [] as any;
    Object.keys(items).map((key) => {
        let newItem = [items[key]?.itemId, items[key]?.deadline];
        itemsArray.push(newItem);

    })

    itemsArray = itemsArray.sort(sortByDeadline);

    saveDeadlineSortedItemsOnLocalStorge(itemsArray);
    return itemsArray;
}

function sortByDeadline(item1: any, item2: any) {
    let deadline1 = item1[1]
    let deadline2 = item2[1]
    console.log(deadline1);
    console.log(deadline2);

    if (!deadline1 && !deadline2) {
        return 0;
    }
    if (!deadline1) {
        return 1;
    }
    if (!deadline2) {
        return -1;
    }
    deadline1 = moment(deadline1)
    deadline2 = moment(deadline2)
    if (deadline1.isBefore(deadline2))
        return -1;
    else if (deadline1.isAfter(deadline2))
        return 1;
    else
        return 0;
}


function sortByPriority(item1: any, item2: any) {
    return getPriorityPrecedenceTest(item1[PRISORT_DATA_PRIORITY_INDEX], item2[PRISORT_DATA_PRIORITY_INDEX]);
}

function getPriorityPrecedenceTest(val1: TaskPriority, val2: TaskPriority) {
    if (val1 < val2) {
        return 1;
    } else if (val1 > val2) {
        return -1;
    } else {
        return 0;
    }
}

function getPriorityPrecedence(val1: TaskPriority, val2: TaskPriority) {

    if (val1 == TaskPriority["VERY HIGH"]) {
        if (val2 == TaskPriority["VERY HIGH"]) {
            return 0;
        }
        return 1;
    }
    if (val1 == TaskPriority.HIGH) {
        if (val2 == TaskPriority["VERY HIGH"]) {
            return -1;
        }
        if (val2 == TaskPriority.HIGH) {
            return 0;
        }
        return 1;
    }
    if (val1 == TaskPriority.NORMAL) {
        if (val2 == TaskPriority["VERY HIGH"] || val2 == TaskPriority.HIGH) {
            return -1;
        }
        if (val2 == TaskPriority.NORMAL) {
            return 0;
        }
        return 1;
    }
    if (val1 == TaskPriority.LOW) {
        if (val2 == TaskPriority["VERY LOW"]) {
            return 1;
        }
        if (val2 == TaskPriority.LOW) {
            return 0;
        }
        return -1;
    }
    if (val1 == TaskPriority["VERY LOW"]) {
        if (val2 == TaskPriority["VERY LOW"]) {
            return 0;
        }
        return -1;
    }
    if (!val1 && !val2) {
        return 0;
    } else if (val1) {
        return 1;
    } else {
        return -1;
    }
}


export function finalisePriorityItemsInStorage(items: any) {
    savePriorityItemsToLocalStorage(items);
    prepareDeadlineSortPriorityItems(items);
    preparePriSortPriorityItems(items);
}