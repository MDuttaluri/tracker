import moment from "moment";
import { TaskPriority } from "../Task/Task";
import { addDoc, collection, doc, Firestore, onSnapshot, setDoc, getDoc, deleteDoc, updateDoc, deleteField } from 'firebase/firestore';


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
    //let localItems = localStorage.getItem(PRIORITY_ITEMS_LOCALSTORAGE_PATH);
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
    console.log('====================================');
    console.log(`pri sort`);
    console.log(items);
    console.log('====================================');

    let itemsArray = [] as any;
    Object.keys(items).map((key) => {
        if (key !== FIRESTORE_PRIORITYDATA_LASTMODIFIED_PATH) {
            let newItem = [items[key]?.itemId, items[key]?.priority];
            itemsArray.push(newItem);
        }

    })
    itemsArray = itemsArray.sort(sortByPriority);
    console.log('====================================');
    console.log(`after sort`);
    console.log(itemsArray);

    console.log('====================================');
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
        if (key !== FIRESTORE_PRIORITYDATA_LASTMODIFIED_PATH) {
            let newItem = [items[key]?.itemId, items[key]?.deadline];
            itemsArray.push(newItem);
        }
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


const FIRESTORE_PRIORITYDATA_COLLECTION_PATH = "priorityData"
const FIRESTORE_PRIORITYDATA_TOBEDELETED_COLLECTION_PATH = "priorityToBeDeleted"
const FIRESTORE_PRIORITYDATA_LASTMODIFIED_PATH = "priorityToBeDeleted"
const FIRESTORE_PRIORITYDATA_NOTIFICATIONS_PATH = "priorityItemNotifications"


async function uploadPriorityItemsToServer(db: Firestore, uid: any, data: any) {
    setDoc(doc(db, FIRESTORE_PRIORITYDATA_COLLECTION_PATH, uid), data);
}

async function getPriorityItemsFromServer(db: Firestore, uid: any) {

    const priorityItemsRef = doc(db, FIRESTORE_PRIORITYDATA_COLLECTION_PATH, uid);
    const priorityItems = await getDoc(priorityItemsRef);
    if (priorityItems.exists()) {
        return priorityItems.data();
    }
    else {
        return null;
    }
}

async function getCombinedToBeDeletedPriorityItems(db: Firestore, uid: string) {
    const itemsFromServer = await downloadPriorityToBeDeletedItemsFromServer(db, uid);
    const itemsFromLocal = loadToBeDeletedPriorityItems();
    return new Set([...itemsFromServer, ...itemsFromLocal]);
}


export async function syncPriorityDataFromServer(db: Firestore, uid: string, setState?: any) {
    if (!uid || uid.length === 0)
        return;
    const priorityItemsFromLocal: any = loadPriorityItemsDataFromLocalStorage() || {};
    const priorityItemsFromServerZipped = await getPriorityItemsFromServer(db, uid);
    if (!priorityItemsFromServerZipped) {
        uploadPriorityItemsToServer(db, uid, priorityItemsFromLocal);
    } else {
        const priorityItemsFromServer = priorityItemsFromServerZipped;
        const serverItemKeys = Object.keys(priorityItemsFromServer);
        const localItemKeys = Object.keys(priorityItemsFromLocal);
        const combinedKeys = new Set([...serverItemKeys, ...localItemKeys])

        const toBeDeltedItems = await getCombinedToBeDeletedPriorityItems(db, uid);


        combinedKeys.forEach((key) => {
            if (toBeDeltedItems.has(key)) {
                combinedKeys.delete(key)
            }
        })

        console.log(combinedKeys);
        let combinedItems: any = {};
        combinedKeys.forEach((key) => {
            const serverItem = priorityItemsFromServer[key];
            const localItem = priorityItemsFromLocal[key];
            if (serverItem && localItem) {
                // item exists on both storages.
                const localLastModified = localItem['lastModifiedOn'];
                const serverLastModified = serverItem['lastModifiedOn'];
                if (localLastModified && serverLastModified) {
                    if (localLastModified > serverLastModified) {
                        combinedItems[key] = localItem;
                    } else {
                        combinedItems[key] = serverItem;
                    }
                } else if (localLastModified) {
                    combinedItems[key] = localItem;
                } else {
                    combinedItems[key] = serverItem;
                }
            } else if (serverItem) {
                // item available on server but not in local
                combinedItems[key] = serverItem;
            } else {
                // item available in local but not in server
                combinedItems[key] = localItem;
            }
        })

        // local setup
        savePriorityItemsToLocalStorage(combinedItems);
        preparePriSortPriorityItems(combinedItems);
        prepareDeadlineSortPriorityItems(combinedItems);
        savePriorityItemToDeletedList(toBeDeltedItems);

        if (setState) {
            setState(combinedItems);
        }

        //setPrioritiesData(combinedItems);
        // server setup
        uploadPriorityItemsToServer(db, uid, combinedItems);


        uploadPriorityToBeDeletedItemsToServer(db, uid);

    }

}

const PRIORITY_ITEMS_DELETED_LOCALSTORAGE_PATH = "deletedPriorities";


export function addPriorityItemToDeletedList(itemId: string) {
    let localDeletedItems: any = loadToBeDeletedPriorityItems();
    localDeletedItems.push(itemId);
    savePriorityItemToDeletedList(localDeletedItems);
    //localStorage.setItem(PRIORITY_ITEMS_DELETED_LOCALSTORAGE_PATH, JSON.stringify(localDeletedItems));
}

export function savePriorityItemToDeletedList(items: any) {
    const data = { "ids": Array.from(items.values()) }
    localStorage.setItem(PRIORITY_ITEMS_DELETED_LOCALSTORAGE_PATH, JSON.stringify(data));
}


export async function deletePriorityItemFromServer(db: Firestore, uid: string, itemId: string) {
    try {
        const deleteObj: any = {}
        deleteObj[itemId] = deleteField()
        await updateDoc(doc(db, FIRESTORE_PRIORITYDATA_COLLECTION_PATH, uid), deleteObj);
    } catch (e) {

    }
}

export function loadToBeDeletedPriorityItems() {
    const localItems = localStorage.getItem(PRIORITY_ITEMS_DELETED_LOCALSTORAGE_PATH);
    if (localItems) {
        return JSON.parse(localItems)['ids'];
    }
    return [];
}


export async function uploadPriorityToBeDeletedItemsToServer(db: Firestore, uid: string, items?: any[]) {
    if (!items) {
        items = loadToBeDeletedPriorityItems();
        console.log('====================================');
        console.log(items);
        console.log('====================================');
    }
    setDoc(doc(db, FIRESTORE_PRIORITYDATA_TOBEDELETED_COLLECTION_PATH, uid), { "ids": items });
}

export async function downloadPriorityToBeDeletedItemsFromServer(db: Firestore, uid: string) {
    const dataFromServer: any = await getDoc(doc(db, FIRESTORE_PRIORITYDATA_TOBEDELETED_COLLECTION_PATH, uid));
    if (dataFromServer.exists()) {
        console.log(dataFromServer.data());

        return dataFromServer.data()['ids']
    }
    return [];
}


export async function downloadPrioritiesLastModified(db: Firestore, uid: string) {
    const data: any = await getDoc(doc(db, FIRESTORE_PRIORITYDATA_COLLECTION_PATH, uid));
    if (data.exists()) {
        return data.data['timestamp'];
    } else {
        return null;
    }
}

export async function uploadPrioritiesLastModified(db: Firestore, uid: string) {
    setDoc(doc(db, FIRESTORE_PRIORITYDATA_LASTMODIFIED_PATH, uid), { 'timestamp': Date.now() });
}

const PRIORITY_ITEMS_NOTIFICATIONS_LOCAL_PATH = "priorityNotifications";

export function savePriorityItemNotificationsOnLocal(items: any) {
    localStorage.setItem(PRIORITY_ITEMS_NOTIFICATIONS_LOCAL_PATH, JSON.stringify(items));
}

export function loadPriorityItemNotificationsFromLocal() {
    let data = localStorage.getItem(PRIORITY_ITEMS_NOTIFICATIONS_LOCAL_PATH)
    if (data) {
        return JSON.parse(data);
    }
    return {};
}

export async function uploadPriorityItemNotificationsToServer(db: Firestore, uid: string, items?: any) {
    if (!items) {
        items = loadPriorityItemNotificationsFromLocal();
    }
    await setDoc(doc(db, FIRESTORE_PRIORITYDATA_NOTIFICATIONS_PATH, uid), items);
}

export async function downloadPriorityItemNotificationsFromServer(db: Firestore, uid: string) {
    return await getDoc(doc(db, FIRESTORE_PRIORITYDATA_NOTIFICATIONS_PATH, uid));
}

// async function getCombinedPriorityItemNotifications(db: Firestore, uid: string) {
//     let localData = loadPriorityItemNotificationsFromLocal();
//     let serverDataZipped = await downloadPriorityItemNotificationsFromServer(db, uid);
//     let serverData : any = {};
//     if(serverDataZipped.exists())
//         serverData = serverDataZipped.data();

//     localData = cleanUpNotifications(localData);
//     serverData = cleanUpNotifications(serverData);

    

    
// }


// function cleanUpNotifications(notifications: any) {
//     if (!notifications)
//         return {}

//     let newData = {};
//     const today = moment();
//     Object.keys(notifications).map((key) => {
//         if (moment(key).isBefore(today)) {
//             delete notifications[key];
//             return;
//         }
//     })
// }