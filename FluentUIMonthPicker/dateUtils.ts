export const convertToLocalDate = (dateProperty: ComponentFramework.PropertyTypes.DateTimeProperty,  userSettings : ComponentFramework.UserSettings) : Date | undefined => {
    const dateValue = ensureDate(dateProperty.raw);
    //console.log("convertToLocalDate", dateValue, dateProperty.attributes?.Behavior);
    if(dateValue === undefined || dateValue === null) {
        return undefined;
    }
    
    else if (dateProperty.attributes?.Behavior == 1 || typeof dateProperty.raw === 'string') { //UserLocal or when the date object is passed as a string
        const offsetMinutes = userSettings.getTimeZoneOffsetMinutes(dateValue);
        const localDate = addMinutes(dateValue, offsetMinutes);
        return getUtcDate(localDate);
    }
    else if (dateProperty.attributes?.Behavior == 0) { //to make it work in tets harness
        return dateValue
    }
    else {
        return getUtcDate(dateValue);
    }
}


export const ensureDate = (date: Date | undefined | null): Date | undefined => {
    if (date === undefined || date === null) {
        return undefined;
    }

    // Convert string to Date object if needed
    // Happens when min and max date are set as static value, the date passed is a string 
    if (typeof date === 'string') {
        return new Date(date);
    } else if (date instanceof Date) {
        return date;
    } else {
        return undefined;
    }
}

export const getUtcDate = (date: Date | undefined | null) => 
     {
        let dateObj = ensureDate(date);
        if (dateObj === undefined || dateObj === null) {
            return undefined;
        }
                
        
        return new Date(
            dateObj.getUTCFullYear(),
            dateObj.getUTCMonth(),
            dateObj.getUTCDate(),
            dateObj.getUTCHours(),
            dateObj.getUTCMinutes()
        );
    };

export const addMinutes = (date: Date | undefined, minutes: number): Date | undefined => 
    date === undefined ? 
        undefined : 
        new Date(date.getTime() + minutes * 60000);


export const datesAreEqual = (date1: Date | null | undefined, date2: Date | null | undefined): boolean => {
    if (date1 === date2) return true; // handles null/undefined cases
    if (!date1 || !date2) return false;
  
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
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

