import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import MonthPickerApp, { IMonthPickerProps } from "./MonthPickerApp";
import { v4 as uuidv4 } from 'uuid';


export class FluentUIMonthPicker implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _notifyOutputChanged: () => void;
    private _root: Root
    private _startDateValue:Date|undefined
    private _endDateValue:Date|undefined   
    private _isDesignMode:boolean = false 
    private _props: IMonthPickerProps = {
        instanceId: uuidv4(),
        dateValue: undefined,
        minDateValue: undefined,
        maxDateValue: undefined,
        disabled: false,
        masked: false,
        monthDisplayFormat: "2-digit",
        yearDisplayFormat: "numeric",
        localeDisplayFormat: "en-Gb", // todo how to paramertrize easilly ?
        onMonthChange: this.notifyChange.bind(this)
    }
    
    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        this._root = createRoot(container!)
        this._notifyOutputChanged = notifyOutputChanged;

        //https://butenko.pro/2023/01/08/pcf-design-time-vs-run-time/
        if (location.ancestorOrigins?.[0] === "https://make.powerapps.com" ||
            location.ancestorOrigins?.[0] === "https://make.preview.powerapps.com") {
            this._isDesignMode = true;
        }
        
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // If the bound attribute is disabled because it is inactive or the user doesn't have access
		let isReadOnly = context.mode.isControlDisabled;

		let isMasked = false;
		// When a field has FLS enabled, the security property on the attribute parameter is set
		if (context.parameters.startDate.security) {
			isReadOnly = isReadOnly || !context.parameters.startDate.security.editable;
			isMasked =  !context.parameters.startDate.security.readable
		}
        this._props.disabled = isReadOnly;
        this._props.masked = isMasked;
        
        // Add code to update control view
        if(this._isDesignMode){
            this._props.dateValue = new Date();
            this._props.minDateValue = undefined;
            this._props.maxDateValue = undefined;

        }else{
            this._props.dateValue = context.parameters.startDate.raw || undefined;
            this._props.minDateValue = context.parameters.minDate.raw || undefined;
            this._props.maxDateValue = context.parameters.maxDate.raw || undefined;
        }
        //this._props.disabled = context.parameters.startDate.security?.editable ?? false // todo check other security concerns (FLS)

        switch (context.parameters.monthDisplayFormat?.raw) {
            case "Numeric":
                this._props.monthDisplayFormat = "numeric";
                break;
            case "Short":
                this._props.monthDisplayFormat = "short";
                break;
            case "Long":
                this._props.monthDisplayFormat = "long";
                break;
            default:
                this._props.monthDisplayFormat = "numeric";
                break;
        }

        switch (context.parameters.yearDisplayFormat?.raw) {
            case "4digits":
                this._props.yearDisplayFormat = "numeric";
                break;
            case "2digits":
                this._props.yearDisplayFormat = "2-digit";
                break;
            
            default:
                this._props.yearDisplayFormat = "numeric";
                break;
        }

        this._props.localeDisplayFormat = (context.userSettings as any).locale ?? "fr-CA";

       


        this._root.render(createElement(MonthPickerApp, this._props)) 
    }


    //Callback method : React => PCF
    private notifyChange(newStartDateValue: Date, newEndDateValue: Date) {
        
        this._startDateValue = newStartDateValue;
        this._endDateValue = newEndDateValue;
        this._notifyOutputChanged();
    }


    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            startDate: this._startDateValue,
            endDate: this._endDateValue
         };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
        this._root.unmount();
    }
}
