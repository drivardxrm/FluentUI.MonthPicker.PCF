import { Button, FluentProvider, Input, Popover, PopoverSurface, PopoverTrigger, useId, webLightTheme, Text, makeStyles, shorthands, PositioningImperativeRef, IdPrefixProvider } from '@fluentui/react-components'
import { CalendarMonth20Regular  } from "@fluentui/react-icons";
import { Calendar, DateRangeType  } from "@fluentui/react-calendar-compat";
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

export const useStyles = makeStyles({
  icon: {  
    ...shorthands.outline(0),
  },
  root: {
    display: 'flex',
    width: '100%'
  }
})

export interface IMonthPickerProps {
    dateValue: Date | undefined
    minDateValue: Date | undefined
    maxDateValue: Date | undefined
    monthDisplayFormat: Intl.DateTimeFormatOptions["month"]
    yearDisplayFormat: Intl.DateTimeFormatOptions["year"]
    localeDisplayFormat: string
    
 
    disabled: boolean
    masked: boolean
 
    //Callback function : => PCF
    onMonthChange: (newStartDateValue: Date, newEndDateValue: Date) => void;
 }


const MonthPickerApp = (props:IMonthPickerProps): JSX.Element => {

    
    // Get the current date
    const currentDate = new Date();
    // Get the timezone offset in minutes
    const timezoneOffsetMinutes = currentDate.getTimezoneOffset();
    // Convert the timezone offset from minutes to milliseconds
    const timezoneOffsetMilliseconds = timezoneOffsetMinutes * 60 * 1000;
  
    const [selectedDate, setSelectedDate] = useState<Date|undefined>(() =>{
      
      if (props.dateValue === undefined) {
        return props.dateValue;
      }
      
      // Create a new date object that is adjusted by the timezone offset
      return new Date(props.dateValue.getTime() + timezoneOffsetMilliseconds);
    });

    const providerIdPrefix = useId('month-picker-provider-');

    const inputRef = useRef<HTMLInputElement>(null);
    const positioningRef = useRef<PositioningImperativeRef>(null);

    const onSelectMonth = (date: Date, selectedDateRangeArray?: Date[] | undefined): void => {
      const firstDayOfMonth= new Date(date.getFullYear(), date.getMonth(), 1);  
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      setSelectedDate(firstDayOfMonth);
      props.onMonthChange(firstDayOfMonth, lastDayOfMonth);
    }

    const selectedMonthStr = useMemo(() => 
      props.masked ? '*******' : 
        selectedDate?.toLocaleDateString(props.localeDisplayFormat, { month: props.monthDisplayFormat, year: props.yearDisplayFormat }) ?? 
        '---', 
      [selectedDate, props.localeDisplayFormat, props.monthDisplayFormat, props.yearDisplayFormat, props.masked]
    );

    useEffect(() => {
      if (inputRef.current) {
        positioningRef.current?.setTarget(inputRef.current)
      }
    }, [inputRef, positioningRef]);


  

     // If value is changed from outside the PCF
    useEffect(() => {
       if (selectedDate !== props.dateValue) {
         setSelectedDate(selectedDate);
      }
    }, [props.dateValue]); 
   
    const styles = useStyles();
    return (
        
      <IdPrefixProvider value={providerIdPrefix}>
        <FluentProvider theme={webLightTheme} >
            
            <Input
              className={styles.root}
              ref={inputRef}
              appearance='filled-darker'
              //placeholder='---'
              disabled={props.disabled}
              value={selectedMonthStr}
              contentAfter={
                <Popover positioning={{ positioningRef }} >
                  <PopoverTrigger disableButtonEnhancement>
                    <CalendarMonth20Regular className={styles.icon} />
                  </PopoverTrigger>

                  <PopoverSurface tabIndex={-1}>
                    <Calendar
                      dateRangeType={DateRangeType.Month}
                      showGoToToday={false}
                      highlightSelectedMonth
                      isDayPickerVisible={false}
                      onSelectDate={onSelectMonth}
                      minDate={props.minDateValue ? new Date(props.minDateValue.getTime() + timezoneOffsetMilliseconds) : undefined}
                      maxDate={props.maxDateValue ? new Date(props.maxDateValue.getTime() + timezoneOffsetMilliseconds) : undefined}
                      value={selectedDate}
                    />
                  </PopoverSurface>
                </Popover>
              }
            />
        </FluentProvider>
      </IdPrefixProvider >  
        
        
    )
}

export default MonthPickerApp