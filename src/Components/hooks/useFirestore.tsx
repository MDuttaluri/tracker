import React, { useState } from 'react'
import { getFirestore } from "firebase/firestore";

function useFirestore() {
    const [db, setDb] = useState(getFirestore());
    return db;
}

export default useFirestore