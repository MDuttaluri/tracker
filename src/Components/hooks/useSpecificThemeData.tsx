import React, { useContext, useEffect, useState } from 'react'
import { AppThemeContext } from '../../App'
import { AppThemeType, DARK_SECONDARY_THEME, DARK_THEME, getSpecificThemeStyles, getThemeStyles, LIGHT_SECONDARY_THEME, LIGHT_THEME, ThemeDataType } from '../../ThemeUtils';
import useThemeData from './useThemeData';


function useSpecificThemeData() {
    const { themeMode, setThemeMode } = useContext(AppThemeContext);
    const [themeData, setThemeData] = useState(themeMode === AppThemeType.DARK ? DARK_SECONDARY_THEME : LIGHT_SECONDARY_THEME);
    const primaryThemeData = useThemeData()[0];


    useEffect(() => {
        setThemeData({ ...primaryThemeData, ...getSpecificThemeStyles(themeMode) });
    }, [themeMode, primaryThemeData]);

    return [themeData, setThemeData];
}

export default useSpecificThemeData