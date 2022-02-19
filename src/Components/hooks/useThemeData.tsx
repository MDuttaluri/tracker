import React, { useContext, useEffect, useState } from 'react'
import { AppThemeContext } from '../../App'
import { AppThemeType, DARK_THEME, getThemeStyles, LIGHT_THEME, ThemeDataType } from '../../ThemeUtils';

function useThemeData() {
    const { themeMode, setThemeMode } = useContext(AppThemeContext);
    const [themeData, setThemeData] = useState(themeMode === AppThemeType.DARK ? DARK_THEME : LIGHT_THEME);

    useEffect(() => {
        setThemeData(getThemeStyles(themeMode));
    }, [themeMode]);

    return [themeData, setThemeData];
}

export default useThemeData