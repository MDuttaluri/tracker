import React from 'react';
import CompactNav from '../CompactNav/CompactNav';
import './CalculatorStyles.scss';

function Calculator() {
    return (
        <div>
            <CompactNav backTo='/' content='Calculator' />
            <div className='outerDiv grid--center'>

            </div>
        </div>);
}


function CalculatorComponent() {
    return (
        <div className='calcOuter'>
            <div className='calcScreen'>

            </div>
            <div className='calcBody'>

            </div>
        </div>
    );
}

export default Calculator;
