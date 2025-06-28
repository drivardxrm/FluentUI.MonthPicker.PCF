export const convertToLocalDate = (dateProperty: ComponentFramework.PropertyTypes.DateTimeProperty,  userSettings : ComponentFramework.UserSettings) : Date | undefined => {
    if(dateProperty.raw === undefined || dateProperty.raw === null) {
        return undefined;
    }
    else if (dateProperty.attributes?.Behavior == 1) { //UserLocal
        const offsetMinutes = userSettings.getTimeZoneOffsetMinutes(dateProperty.raw);
        const localDate = addMinutes(dateProperty.raw, offsetMinutes);
        return getUtcDate(localDate);
    } else {
        return getUtcDate(dateProperty.raw);
    }
}



export const getUtcDate = (date: Date | undefined | null) => 
     date === undefined || date === null? 
        undefined :  
        new  Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes()
        );

export const addMinutes = (date: Date | undefined, minutes: number): Date | undefined => 
    date === undefined ? 
        undefined : 
        new Date(date.getTime() + minutes * 60000);


export const datesAreEqual = (date1: Date | null | undefined, date2: Date | null | undefined): boolean => {
    if (date1 === date2) return true; // handles null/undefined cases
    if (!date1 || !date2) return false;
  
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate() &&
           date1.getHours() === date2.getHours() &&
           date1.getMinutes() === date2.getMinutes();
};


export interface ISelectedMonthInfo {
    startDate: Date | undefined,
    endDate: Date | undefined,
    monthOutput: number | undefined,
    yearOutput: number | undefined,
    daysInMonth: number | undefined
}

export const getSelectedMonthInfo = (date: Date | undefined): ISelectedMonthInfo => {
    if (!date) {
        return {
            startDate: undefined,
            endDate: undefined,
            monthOutput: undefined,
            yearOutput: undefined,
            daysInMonth: undefined
        };
    }
    

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    
    const startDate = new Date(year, month, 1); // First day of the month
    const endDate = new Date(year, month + 1, 0); // Last day of the month (day 0 of next month)
    
    const monthOutput = month + 1; // Convert to 1-12
    const yearOutput = year;
    const daysInMonth = endDate.getDate(); // Gets the day number of the last day


    return {
        startDate,
        endDate: endDate,
        monthOutput: monthOutput,
        yearOutput: yearOutput, 
        daysInMonth: daysInMonth 
    };
};

