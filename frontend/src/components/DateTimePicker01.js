import {memo,useState} from 'react';
import DateRangePicker from "@cloudscape-design/components/date-range-picker";

export const datePickerI18nStrings = { 
        todayAriaLabel: "Today",
        nextMonthAriaLabel: "Next month",
        previousMonthAriaLabel: "Previous month",
        customRelativeRangeDurationLabel: "Duration",
        customRelativeRangeDurationPlaceholder: "Enter duration",
        customRelativeRangeOptionLabel: "Custom range",
        customRelativeRangeOptionDescription:
          "Set a custom range in the past",
        customRelativeRangeUnitLabel: "Unit of time",
        formatRelativeRange: (e) => {
          const n = 1 === e.amount ? e.unit : `${e.unit}s`;
          return `Last ${e.amount} ${n}`;
        },
        formatUnit: (e, n) => (1 === n ? e : `${e}s`),
        relativeModeTitle: "Relative range",
        absoluteModeTitle: "Absolute range",
        relativeRangeSelectionHeading: "Choose a range",
        startDateLabel: "Start date",
        endDateLabel: "End date",
        startTimeLabel: "Start time",
        endTimeLabel: "End time",
        clearButtonLabel: "Clear and dismiss",
        cancelButtonLabel: "Cancel",
        applyButtonLabel: "Apply",
};
          
const CustomComponent = memo(({ value = undefined, onChangeDateSelection = () => {}, }) => {

    function onSelectionChange(item){
      onChangeDateSelection(item);
    }
    
    return (
                <DateRangePicker
                      isValidRange={() => {
                        return { valid: true };
                      }}
                      i18nStrings={{
                        todayAriaLabel: "Today",
                        nextMonthAriaLabel: "Next month",
                        previousMonthAriaLabel: "Previous month",
                        customRelativeRangeDurationLabel: "Duration",
                        customRelativeRangeDurationPlaceholder: "Enter duration",
                        customRelativeRangeOptionLabel: "Custom range",
                        customRelativeRangeOptionDescription:
                          "Set a custom range in the past",
                        customRelativeRangeUnitLabel: "Unit of time",
                        formatRelativeRange: (e) => {
                          const n = 1 === e.amount ? e.unit : `${e.unit}s`;
                          return `Last ${e.amount} ${n}`;
                        },
                        formatUnit: (e, n) => (1 === n ? e : `${e}s`),
                        relativeModeTitle: "Relative range",
                        absoluteModeTitle: "Absolute range",
                        relativeRangeSelectionHeading: "Choose a range",
                        startDateLabel: "Start date",
                        endDateLabel: "End date",
                        startTimeLabel: "Start time",
                        endTimeLabel: "End time",
                        clearButtonLabel: "Clear and dismiss",
                        cancelButtonLabel: "Cancel",
                        applyButtonLabel: "Apply",
                      }}
                      onChange={({ detail }: any) => {
                        onSelectionChange(detail.value);
                        /*
                        const tmpStartTime = detail.value?.startDate;
                        const tmpEndTime = detail.value?.endDate;
                        const startTimeStr = moment
                          .utc(tmpStartTime)
                          .format(TIME_FORMAT);
                        const endTimeStr = moment.utc(tmpEndTime).format(TIME_FORMAT);
                        console.info(
                          "startTimeStr:endTimeStr:",
                          startTimeStr,
                          endTimeStr
                        );
                        changeTimeRange([startTimeStr, endTimeStr]);
                        */
                      }}
                      value={value}
                      placeholder=""
                      rangeSelectorMode="absolute-only"
                      timeOffset={0}
                    />     

           );
});

export default CustomComponent;
