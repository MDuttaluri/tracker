import React, { useContext, useEffect, useState } from 'react';
import { TaskDataContext } from '../App';

function Testcomp() {
    const [data, setfn] = useContext(TaskDataContext)
    const [lol, setLol] = useState(<></>);

    useEffect(() => {
        console.log(`test comps useeffect`);

        setLol(data['1642753772702']?.name)
    }, [])

    return <div>{lol}s</div>;
}

export default Testcomp;
