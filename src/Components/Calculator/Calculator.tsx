import React, { useEffect, useRef, useState } from 'react';
import CompactNav from '../CompactNav/CompactNav';
import { ReactComponent as EraseIcon } from '../../assets/erase.svg';
import './CalculatorStyles.scss';

function Calculator() {
    return (
        <div>
            <CompactNav backTo='/' content='Calculator' />

            <div className='outerDiv grid--center' style={{ minHeight: "80vh", alignItems: "center" }}>
                <CalculatorComponent />
            </div>
        </div>);
}

enum CalculatorMove {
    'ADD', 'MULTIPLY', 'SUBTRACT', 'DIVIDE', 'MODULO'
}

const CalculatorMoveMapper: any = {
    "+": CalculatorMove.ADD,
    "-": CalculatorMove.SUBTRACT,
    "*": CalculatorMove.MULTIPLY,
    "/": CalculatorMove.DIVIDE,
    "%": CalculatorMove.MODULO,
}

function getCalcSymbol(type: CalculatorMove) {
    if (type == CalculatorMove.ADD) {
        return "+"
    } else if (type == CalculatorMove.SUBTRACT) {
        return "-"
    } else if (type == CalculatorMove.DIVIDE) {
        return "/"
    } else if (type == CalculatorMove.MULTIPLY) {
        return "*"
    } else if (type == CalculatorMove.MODULO) {
        return "%"
    }
    return ""
}

function CalculatorComponent() {
    const calcScreenRef = useRef<HTMLInputElement>(null);
    const [calcScreenContent, setCalcScreenContent] = useState("");
    const calcScreenOldValRef = useRef<HTMLInputElement>(null);
    const [calcScreenOldContent, setCalcScreenOldContent] = useState("");
    const [nextOperator, setNextOperator] = useState("");

    useEffect(() => {
        calcScreenRef?.current?.setAttribute("value", calcScreenContent);
        calcScreenOldValRef?.current?.setAttribute("value", calcScreenOldContent);
    }, [calcScreenContent, calcScreenOldContent])


    function addToInput(value: string) {
        const newInputValue = calcScreenContent + value;
        calcScreenRef?.current?.setAttribute("value", newInputValue);
        setCalcScreenContent(newInputValue);
    }

    function operationHandler(type: CalculatorMove) {
        if (calcScreenContent == "") {
            console.log(calcScreenContent);
            return;
        }
        const opSymbol = calcScreenOldContent.charAt(calcScreenOldContent.length - 1);
        if (opSymbol == "") {
            opMove(type)
        }
    }

    function opMove(type: CalculatorMove) {
        if (calcScreenContent == "") {
            console.log(calcScreenContent);

            return;
        }
        if (type == CalculatorMove.ADD) {
            let oldVal = 0;
            if (calcScreenOldContent != "")
                parseFloat(calcScreenOldContent)

            setCalcScreenOldContent(parseFloat(calcScreenContent) + oldVal + "")
            setNextOperator("+")
            setCalcScreenContent("")
        }



    }


    function eraseOneChar() {

        if (calcScreenContent != "") {
            setCalcScreenContent(calcScreenContent.substring(0, calcScreenContent.length - 1));
        }
    }

    function getButtons() {
        let buttons = [
            <button key={'calcPadButton('} className='calcPadButton' onClick={() => { addToInput("(") }}>(</button>,
            <button key={'calcPadButton)'} className='calcPadButton' onClick={() => { addToInput(")") }}>)</button>,
            <button key={'calcPadButtonClear'} className='calcPadButton' onClick={() => { setCalcScreenContent(""); setCalcScreenOldContent("") }}>C</button>,
            <button key={'calcPadButton*'} className='calcPadButton'>*</button>,
            <button key={'calcPadButton/'} className='calcPadButton'>/</button>,
            <button key={'calcPadButton%'} className='calcPadButton'>%</button>
        ];

        let nextKeyVal = 9
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const thisKeyVal = nextKeyVal - (2 - j);
                buttons.push(<button className='calcPadButton' onClick={() => {
                    addToInput((thisKeyVal) + "")
                }}>
                    {thisKeyVal}
                </button>)

            }
            nextKeyVal -= 3;
        }

        return buttons;
    }



    return (
        <div className='calcOuter'>
            <div className='calcScreen'>
                <div className='calcScreenNewContent'>
                    <input disabled className='calcScreenInput' ref={calcScreenOldValRef} />
                    <span>{nextOperator}</span>
                </div>
                <div className='calcScreenNewContent'>
                    <input className='calcScreenInput' disabled ref={calcScreenRef} onChange={(e) => { setCalcScreenContent(e.target.value) }} />
                    <button className='calcEraseButton' onClick={() => { eraseOneChar() }}><EraseIcon height={'20px'} /></button>
                </div>
            </div>
            <div className='calcBody'>
                <div className='calcPad'>
                    {getButtons()}
                </div>
                <div className='calcRightOps'>
                    <button className='calcPadButton' onClick={() => { operationHandler(CalculatorMove.ADD) }}>
                        +
                    </button>
                    <button className='calcPadButton' onClick={() => { operationHandler(CalculatorMove.SUBTRACT) }}>
                        -
                    </button>
                    <button className='calcPadButton' >
                        =
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Calculator;
