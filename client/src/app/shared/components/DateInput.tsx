import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { format, isValid, parseISO } from 'date-fns';
import { FieldValues, useController, UseControllerProps } from "react-hook-form";

type Props<T extends FieldValues> = UseControllerProps<T> & Omit<DatePickerProps<Date>, 'value' | 'onChange' | 'name'>

// A date without time or timezone, stored in the form as 'yyyy-MM-dd' ('' when empty,
// 'invalid' while the typed text isn't a real date so validation can flag it)
export default function DateInput<T extends FieldValues>({ name, control, rules, defaultValue, ...pickerProps }: Props<T>) {
    const { field, fieldState } = useController({ name, control, rules, defaultValue });

    return (
        <DatePicker
            {...pickerProps}
            value={field.value ? parseISO(field.value) : null}
            onChange={date => field.onChange(date === null ? '' : isValid(date) ? format(date, 'yyyy-MM-dd') : 'invalid')}
            format="dd.MM.yyyy"
            sx={{ width: '100%' }}
            slotProps={{
                field: { clearable: true },
                textField: {
                    size: 'small',
                    onBlur: field.onBlur,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                },
            }}
        />
    )
}
