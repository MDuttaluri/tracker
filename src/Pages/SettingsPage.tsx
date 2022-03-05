import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppThemeContext } from '../App';
import CompactNav from '../Components/CompactNav/CompactNav'
import { AppThemeType, loadThemeChoiceFromLocalStorage, saveThemeChoiceToLocalStorage, ThemeDataType } from '../ThemeUtils';
import { ReactComponent as SunIcon } from '../assets/day.svg';
import { ReactComponent as MoonIcon } from '../assets/night.svg';

const DARK_SLIDER_THEME: ThemeDataType = {
    backgroundColor: "#000",
    border: "rgb(35, 112, 255) solid 2px",
}
const LIGHT_SLIDER_THEME: ThemeDataType = {
    backgroundColor: "#fff",
    border: "#000 solid 2px",
}

function getSliderTheme(selectedTheme: AppThemeType) {
    if (selectedTheme === AppThemeType.DARK)
        return DARK_SLIDER_THEME
    return LIGHT_SLIDER_THEME
}


function SettingsPage() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const tempRef = useRef<HTMLParagraphElement>(null);
    const [tempData, setTempData] = useState("")
    const { themeMode, setThemeMode } = useContext(AppThemeContext);

    useEffect(() => {
        if (themeMode === AppThemeType.LIGHT) {
            sliderRef?.current?.style.setProperty("animation", "slideToLeft 0.2s ease forwards");
        } else {
            sliderRef?.current?.style.setProperty("animation", "slideToRight 0.2s ease forwards");
        }
    }, [themeMode]);

    try {
        window.addEventListener('devicemotion', function (event: any) {
            setTempData(event.acceleration.x + ", " + event.acceleration.y);
        });
    } catch (e) {
        alert("ex")
    }

    useEffect(() => {

    }, [tempData])

    return (
        <div>
            <CompactNav backTo='/' content='Settings' />
            <div className='outerDiv grid--center'>
                <h1 style={{ textAlign: "center" }}>Settings</h1>
                <form className='form'>
                    <div className='formRow'>
                        <label>App theme</label>
                        <label>:</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", justifySelf: "center" }}>
                            <SunIcon height={'30px'} />
                            <div onClick={() => {
                                if (themeMode === AppThemeType.DARK) {
                                    setThemeMode(AppThemeType.LIGHT)
                                    saveThemeChoiceToLocalStorage(AppThemeType.LIGHT)
                                }
                                if (themeMode === AppThemeType.LIGHT) {
                                    setThemeMode(AppThemeType.DARK)
                                    saveThemeChoiceToLocalStorage(AppThemeType.DARK)
                                }

                            }} className='sliderOuter' style={getSliderTheme(themeMode)}>
                                <div ref={sliderRef} className="sliderInner"></div>
                            </div>
                            <MoonIcon height={'20px'} />
                        </div>
                    </div>
                    <p>SPEED  : </p>{tempData}
                </form>
            </div>
        </div>
    )
}

export default SettingsPage