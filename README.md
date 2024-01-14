# FluentUI.MonthPicker.PCF ![GitHub all releases](https://img.shields.io/github/downloads/drivardxrm/FluentUI.MonthPicker.PCF/total?style=plastic)

PowerApps Component framework (PCF) Control to render a [FluentUI v9](https://react.fluentui.dev/) Month picker over a Date column. The control optionally outputs some information about the selected month (ex. month number, number of days in month) 

[Download Here](https://github.com/drivardxrm/FluentUI.MonthPicker.PCF/releases/latest)


# Parameters
| Parameter         | Description                                                                                  | Type     |Default     |
|-------------------|----------------------------------------------------------------------------------------------|----------   |
| Start Date  | (REQUIRED) main input column of the month picker, will be set at the first day of the PCF control selected month |DateAndTime.DateAndTime, DateAndTime.DateOnly | |
| End Date  | (Optional) will be set at the last day of the PCF control selected month |    DateAndTime.DateAndTime, DateAndTime.DateOnly    | |
| Min Date   |  (Optional) Min Date for month selection | Whole.None  | |
| Max Date   |  (Optional) Max Date for month selection | Whole.None | |
| Month output   | (Optional) Selected Month in numeric form (1 - 12) | Whole.None | |
| Year output |(Optional) Selected Year in numeric form (ex. 2024) |  Whole.None  | |
| Days in Month | (Optional) Number of days in the month |  Whole.None   |
| Month Display Format | Display format of the selected month (Numeric, Short, Long)|  Numeric  |
| Year Display Format | Display format of the selected year (2 Digits, 4 Digits) |  4 Digits   |


## Screenshots ##