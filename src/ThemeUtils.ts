const THEME_PATH_LOCALSTORAGE = "theme";
export enum AppThemeType {
    'LIGHT', 'DARK'
}
export interface ThemeContextType {
    themeMode: AppThemeType,
    setThemeMode: any
}

export interface ThemeDataType {
    backgroundColor?: any,
    color?: any,
    fill?: any,
    boxShadow?: any,
    background?: any,
    borderBottom?: any
}

export const DARK_THEME: ThemeDataType = {
    backgroundColor: "#000",
    color: "#fff",
    fill: "#fff",
    boxShadow: "none"
}

export const DARK_JUMBOTRON_THEME: ThemeDataType = {
    background: "linear-gradient(90deg, #4b6cb7 0 %, #182848 100 %)"
}
export const LIGHT_JUMBOTRON_THEME: ThemeDataType = {
    background: "linear-gradient(90deg, #4b6cb7 0 %, #182848 100 %)"
}

export const DARK_SECONDARY_THEME: ThemeDataType = {
    backgroundColor: "#303030",
    fill: "#fff"
}
export const LIGHT_SECONDARY_THEME: ThemeDataType = {
    backgroundColor: "#fff"
}

export const DARK_INPUT_THEME: ThemeDataType = {
    backgroundColor: "#000",
}

export const LIGHT_INPUT_THEME: ThemeDataType = {
    backgroundColor: "#fff"
}

export const LIGHT_THEME: ThemeDataType = {
    backgroundColor: "#fff",
    color: "#000"
}

export function getThemeStyles(selectedTheme: AppThemeType) {
    if (selectedTheme === AppThemeType.DARK) {
        return DARK_THEME;
    } else {
        return LIGHT_THEME;
    }
}

export function getSpecificThemeStyles(selectedTheme: AppThemeType) {
    if (selectedTheme === AppThemeType.DARK) {
        return DARK_SECONDARY_THEME;
    } else {
        return LIGHT_SECONDARY_THEME;
    }
}

export function getInputThemeStyles(selectedTheme: AppThemeType) {
    if (selectedTheme === AppThemeType.DARK) {
        return DARK_SECONDARY_THEME;
    } else {
        return LIGHT_SECONDARY_THEME;
    }
}




export function saveThemeChoiceToLocalStorage(selection: AppThemeType) {
    localStorage.setItem(THEME_PATH_LOCALSTORAGE, selection.toString());
}

export function loadThemeChoiceFromLocalStorage() {
    let selection = localStorage.getItem(THEME_PATH_LOCALSTORAGE);
    if (selection) {
        return parseInt(selection);
    } else {
        return AppThemeType.LIGHT;
    }
}