import moment from "moment";
import { TaskPriority } from "../Task/Task";
import { addDoc, collection, doc, Firestore, onSnapshot, setDoc, getDoc, deleteDoc, updateDoc, deleteField } from 'firebase/firestore';
import { IDBPDatabase } from "idb";


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

export const IDBName = "TraQ.it";
export const PriorityObjStoreNames = {
    'MAIN': "priorityItems",
    'TO_BE_DELETED': "priorityToBeDeleted",
    'PRISORTED': "priorityPriSorted",
    'DEADSORTED': "priorityDeadSorted",
};


export function savePriorityItemsToLocalStorage(db: IDBPDatabase<unknown>, items: any) {
    let transaction = db.transaction([PriorityObjStoreNames.MAIN], "readwrite");
    let mainObjStore = transaction.objectStore(PriorityObjStoreNames.MAIN);
    Object.keys(items).map(async (id) => {
        mainObjStore.put(items[id]).catch((reason)=>{console.error(reason);
        })
    })
}


export async function loadPriorityItemsDataFromLocalStorage(idb: IDBPDatabase<unknown> | null) {
    
    // idb implementation
    if(idb){

        let transaction = idb.transaction(PriorityObjStoreNames.MAIN,"readonly");
        let mainObjStore = transaction.objectStore(PriorityObjStoreNames.MAIN);
        let items =  await mainObjStore.getAll();
        // console.log('=================  ITEMS  ===================');
        // console.log(items);
        // console.log('====================================');
        let finalItems : any = {};
        if(items.length > 0){
            items.map((item)=>{
                finalItems[item['itemId']] = item;
            })
           // return finalItems;
            console.log(`loaded from local :`);
           console.log(finalItems);
           return finalItems;
        }else{
            return {}
        }
    }else{
        console.log(`returning empty cause idb is null`);
        
        return {}
    }
}

export function loadPriSortedItemsFromLocalStorage(idb : IDBPDatabase<unknown>) {
    // idb implementation
    /*
      if (idb?.transaction) {
        let transaction = idb.transaction(PriorityObjStoreNames.PRISORTED, "readonly");
          let deadObjStore = transaction.objectStore(PriorityObjStoreNames.PRISORTED);
        deadObjStore.getAll().then((items)=>{

            console.log('================= PRI ITEMS  ===================');
            console.log(items);
            console.log('====================================');
            let finalItems: any = [];
            if (items.length > 0) {
                items.map((item) => {
                    finalItems.push(item)
                })
                // return finalItems;
                console.log(`loaded from local :`);
                console.log(finalItems);
    
            } else {
                //return {}
            }
        })
    }
*/
    let localItems = localStorage.getItem(PRIORITY_ITEMS_PRISORTED_LOCALSTORAGE_PATH);
    if (localItems) {
        localItems = JSON.parse(localItems);
        return localItems;
    } else {
        return []
    }
}

export function savePriSortedItemsOnLocalStorge(idb: IDBPDatabase<unknown>,items: []) {
        // idb implementation

    /*let transaction = idb.transaction([PriorityObjStoreNames.PRISORTED], "readwrite");
    let mainObjStore = transaction.objectStore(PriorityObjStoreNames.PRISORTED);

    let preparedItems = [];
    Object.keys(items).map((id: any) => {
        mainObjStore.put(items[id], id)
    })*/

    const stringItems = JSON.stringify(items);
    localStorage.setItem(PRIORITY_ITEMS_PRISORTED_LOCALSTORAGE_PATH, stringItems);
}


export async function preparePriSortPriorityItems(idb: IDBPDatabase<unknown> , items?: any) {
    // idb implementation

    // PRISORT -> PRIORITY BASED SORTING OF ITEMS.
    if (!items) {
        //promise
        items = await loadPriorityItemsDataFromLocalStorage(idb);
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
    savePriSortedItemsOnLocalStorge(idb,itemsArray);
    return itemsArray;
}

export function loadDeadlineSortedItemsFromLocalStorage(idb: IDBPDatabase<unknown>) {
    // idb implementation

  /*  if (idb?.transaction) {
        let transaction = idb.transaction(PriorityObjStoreNames.DEADSORTED, "readonly");
        let deadObjStore = transaction.objectStore(PriorityObjStoreNames.DEADSORTED);
        deadObjStore.getAll().then((items)=>{

            console.log('================= DEAD ITEMS  ===================');
            console.log(items);
            console.log('====================================');
            let finalItems: any = [];
            if (items.length > 0) {
                items.map((item) => {
                    finalItems.push(item)
                })
                // return finalItems;
                console.log(`loaded from local :`);
                console.log(finalItems);
    
            } else {
                //return {}
            }
        })
    }*/

    let localItems = localStorage.getItem(PRIORITY_ITEMS_DEADLINESORTED_LOCALSTORAGE_PATH);
    if (localItems) {
        localItems = JSON.parse(localItems);
        return localItems;
    } else {
        return []
    }

     

}

export function saveDeadlineSortedItemsOnLocalStorge(idb : IDBPDatabase<unknown>,items: []) {
        // idb implementation
/*
    let transaction = idb.transaction([PriorityObjStoreNames.DEADSORTED], "readwrite");
    let mainObjStore = transaction.objectStore(PriorityObjStoreNames.DEADSORTED);

    let preparedItems = [];
    Object.keys(items).map((id : any) => {
        mainObjStore.put(items[id],id)
    })
*/
    const stringItems = JSON.stringify(items);
    localStorage.setItem(PRIORITY_ITEMS_DEADLINESORTED_LOCALSTORAGE_PATH, stringItems);
}

export async function prepareDeadlineSortPriorityItems(idb: IDBPDatabase<unknown>,items?: any) {
    // idb implementation

    // DEADLINE -> DEADLINE BASED SORTING OF ITEMS.
    if (!items) {
        items = await loadPriorityItemsDataFromLocalStorage(idb);
    }

    let localPriItems = loadDeadlineSortedItemsFromLocalStorage(idb);


    let itemsArray = [] as any;
    Object.keys(items).map((key) => {
        if (key !== FIRESTORE_PRIORITYDATA_LASTMODIFIED_PATH) {
            let newItem = [items[key]?.itemId, items[key]?.deadline];
            itemsArray.push(newItem);
        }
    })

    itemsArray = itemsArray.sort(sortByDeadline);

    saveDeadlineSortedItemsOnLocalStorge(idb,itemsArray);
    return itemsArray;
}

function sortByDeadline(item1: any, item2: any) {
    let deadline1 = item1[1]
    let deadline2 = item2[1]
   

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
    return getPriorityPrecedence(item1[PRISORT_DATA_PRIORITY_INDEX], item2[PRISORT_DATA_PRIORITY_INDEX]);
}

function getPriorityPrecedence(val1: TaskPriority, val2: TaskPriority) {
    if (val1 < val2) {
        return 1;
    } else if (val1 > val2) {
        return -1;
    } else {
        return 0;
    }
}


export async function finalisePriorityItemsInStorage(db:IDBPDatabase<unknown> ,items: any) {
        // idb implementation

    savePriorityItemsToLocalStorage(db, items);
    await prepareDeadlineSortPriorityItems(db,items);
    await preparePriSortPriorityItems(db,items);
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

async function getCombinedToBeDeletedPriorityItems(idb :IDBPDatabase<unknown> ,db: Firestore, uid: string) {
    const itemsFromServer = await downloadPriorityToBeDeletedItemsFromServer(db, uid);
    const itemsFromLocal = await loadToBeDeletedPriorityItems(idb);
    return new Set([...itemsFromServer, ...itemsFromLocal]);
}


export async function syncPriorityDataFromServer(idb : IDBPDatabase<unknown>,db: Firestore, uid: string, setState?: any) {
 /*   if (!uid || uid.length === 0)
        return;
    const priorityItemsFromLocal: any = loadPriorityItemsDataFromLocalStorage(idb) || {};
    const priorityItemsFromServerZipped = await getPriorityItemsFromServer(db, uid);
    if (!priorityItemsFromServerZipped) {
        uploadPriorityItemsToServer(db, uid, priorityItemsFromLocal);
    } else {
        const priorityItemsFromServer = priorityItemsFromServerZipped;
        const serverItemKeys = Object.keys(priorityItemsFromServer);
        const localItemKeys = Object.keys(priorityItemsFromLocal);
        const combinedKeys = new Set([...serverItemKeys, ...localItemKeys])

        const toBeDeltedItems = await getCombinedToBeDeletedPriorityItems(idb, db, uid);


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
        savePriorityItemsToLocalStorage(idb, combinedItems);
        preparePriSortPriorityItems(idb,combinedItems);
        prepareDeadlineSortPriorityItems(idb,combinedItems);
       

        if (setState) {
            setState(combinedItems);
        }

        //setPrioritiesData(combinedItems);
        // server setup
        uploadPriorityItemsToServer(db, uid, combinedItems);

        

        uploadPriorityToBeDeletedItemsToServer(idb,db, uid);

        savePriorityItemToDeletedList(idb, new Set());

    }*/

}

const PRIORITY_ITEMS_DELETED_LOCALSTORAGE_PATH = "deletedPriorities";


export function addPriorityItemToDeletedList(idb: IDBPDatabase<unknown>, itemId: string) {
    let localDeletedItems: any = loadToBeDeletedPriorityItems(idb);
    localDeletedItems.push(itemId);
    savePriorityItemToDeletedList(idb, localDeletedItems);
    //localStorage.setItem(PRIORITY_ITEMS_DELETED_LOCALSTORAGE_PATH, JSON.stringify(localDeletedItems));

    if (idb) {
        let transaction = idb.transaction(PriorityObjStoreNames.TO_BE_DELETED, "readwrite");
        let objectStore = transaction.objectStore(PriorityObjStoreNames.TO_BE_DELETED);
        objectStore.put(itemId);
    }
}

export function savePriorityItemToDeletedList(idb : IDBPDatabase<unknown>, items: any) {
    const data = { "ids": Array.from(items.values()) }
    localStorage.setItem(PRIORITY_ITEMS_DELETED_LOCALSTORAGE_PATH, JSON.stringify(data));

        // idb implementation
    if(idb){
        let transaction = idb.transaction(PriorityObjStoreNames.TO_BE_DELETED, "readwrite");
        let  objectStore = transaction.objectStore(PriorityObjStoreNames.TO_BE_DELETED);
        
        const itemsArray = Array.from(items.values());
        itemsArray.map((item)=>{
            objectStore.put(item)
        })
    }
}


export async function deletePriorityItemFromServer(db: Firestore, uid: string, itemId: string) {
    try {
        const deleteObj: any = {}
        deleteObj[itemId] = deleteField()
        await updateDoc(doc(db, FIRESTORE_PRIORITYDATA_COLLECTION_PATH, uid), deleteObj);
    } catch (e) {

    }
}

export function loadToBeDeletedPriorityItems(idb : IDBPDatabase<unknown>) {
    if(idb){
        let transaction = idb.transaction(PriorityObjStoreNames.TO_BE_DELETED, "readonly");
        let objectStore = transaction.objectStore(PriorityObjStoreNames.TO_BE_DELETED);
        let finalItems : any = {};
        objectStore.getAll()
        .then((items)=>{
            
            console.log('==================  LOADED TO BE DELE  ==================');
            console.log(items);
            console.log('====================================');
        })    
    }

    const localItems = localStorage.getItem(PRIORITY_ITEMS_DELETED_LOCALSTORAGE_PATH);
    if (localItems) {
        return JSON.parse(localItems)['ids'];
    }
    return [];
}


export async function uploadPriorityToBeDeletedItemsToServer(idb: IDBPDatabase<unknown>,db: Firestore, uid: string, items?: any[]) {
    if (!items) {
        items = loadToBeDeletedPriorityItems(idb);
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