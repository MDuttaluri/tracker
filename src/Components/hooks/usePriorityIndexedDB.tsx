import React, { useEffect, useState } from 'react'
import { IDBPDatabase, openDB } from 'idb';
import { IDBName, PriorityObjStoreNames } from '../PriorityItems/PriorityItemUtils';

function usePriorityIndexedDB() {
    const [db, setDb] = useState<IDBPDatabase>();

    const openDbCallBack = {
        upgrade: (db: IDBPDatabase, oldVersion: any, newVersion: any, transaction: any) => {
            db.createObjectStore(PriorityObjStoreNames.MAIN, { keyPath: "itemId" })
            db.createObjectStore(PriorityObjStoreNames.TO_BE_DELETED)
            db.createObjectStore(PriorityObjStoreNames.PRISORTED)
            db.createObjectStore(PriorityObjStoreNames.DEADSORTED)
            setDb(db);
        }
    }

    async function loadDB() {
        const db = await openDB(IDBName, 1, openDbCallBack);
        setDb(db)
    }

    useEffect(() => {
        loadDB();
    }, [])

    return db;
}

export default usePriorityIndexedDB