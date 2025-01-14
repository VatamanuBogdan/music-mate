import { useState } from "react";

export default function useFormInput(initialValue: string): [string, React.ChangeEventHandler<HTMLInputElement>] {
    const [value, setValue] = useState(initialValue);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
    }

    return [value, onChange]
}