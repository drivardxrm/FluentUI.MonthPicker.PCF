import { FluentProvider, Input, Popover, PopoverSurface, PopoverTrigger, webLightTheme,  makeStyles, shorthands, PositioningImperativeRef, IdPrefixProvider, InputProps, PopoverProps, webDarkTheme } from '@fluentui/react-components'
import { CalendarMonth20Regular  } from "@fluentui/react-icons";
import { Calendar, DateRangeType } from "@fluentui/react-calendar-compat";
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
    instanceId: string
    dateValue: Date | undefined
    minDateValue: Date | undefined
    maxDateValue: Date | undefined
    monthDisplayFormat: Intl.DateTimeFormatOptions["month"]
    yearDisplayFormat: Intl.DateTimeFormatOptions["year"]
    localeDisplayFormat: string
    isDarkMode: boolean
    
 
    disabled: boolean
    masked: boolean
 
    //Callback function : => PCF
    onMonthChange: (newStartDateValue: Date|undefined, newEndDateValue: Date|undefined) => void;
 }


const MonthPickerApp = (props:IMonthPickerProps): JSX.Element => {

    
    // Get the current date
    const currentDate = new Date();
    // Get the timezone offset in minutes
    const timezoneOffsetMinutes = currentDate.getTimezoneOffset();
    // Convert the timezone offset from minutes to milliseconds
    const timezoneOffsetMilliseconds = timezoneOffsetMinutes * 60 * 1000;

    const [open, setOpen] = useState(false);
    const handleOpenChange: PopoverProps["onOpenChange"] = (e, data) =>{
      setOpen(data.open || false);
    } 

  
    const [selectedDate, setSelectedDate] = useState<Date|undefined>(() =>{
      
      if (props.dateValue === undefined) {
        return props.dateValue;
      }
      
      // Create a new date object that is adjusted by the timezone offset
      return new Date(props.dateValue.getTime() + timezoneOffsetMilliseconds);
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const positioningRef = useRef<PositioningImperativeRef>(null);

    const onSelectMonth = (date: Date, selectedDateRangeArray?: Date[] | undefined): void => {
      const firstDayOfMonth= new Date(date.getFullYear(), date.getMonth(), 1);  
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      setSelectedDate(firstDayOfMonth);
      props.onMonthChange(firstDayOfMonth, lastDayOfMonth);
      setOpen(false);
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
         setSelectedDate(selectedDate)
       }
    }, [props.dateValue, selectedDate]); 

    const onChange: InputProps["onChange"] = (ev, data) => {
      // value was cleared by the user
      if (data.value.length == 0) {
        setSelectedDate(undefined)
        props.onMonthChange(undefined, undefined);
      }
    };
   
    const styles = useStyles();
    return (
        
      <IdPrefixProvider value={`month-picker-${props.instanceId}-`}>
        <FluentProvider theme={props.isDarkMode ? webDarkTheme : webLightTheme} >
          <Popover positioning={{ positioningRef }} open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger disableButtonEnhancement>
              <Input
                  className={styles.root}
                  ref={inputRef}
                  appearance='filled-darker'
                  //placeholder='---'
                  disabled={props.disabled}
                  value={selectedMonthStr}
                  onChange={onChange}
                  contentAfter={
                    <PopoverTrigger disableButtonEnhancement>
                      <CalendarMonth20Regular className={styles.icon} />
                    </PopoverTrigger>
                  }
              />   
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
        </FluentProvider>
      </IdPrefixProvider >  
    )
}

export default MonthPickerApp