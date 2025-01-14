
interface InputFieldProps {
    placeholder: string
    hidden?: boolean
    onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputField({ placeholder, hidden, onChange }: InputFieldProps) {
    const style = 'w-96 h-12 px-2 -py-1 text-base font-normal bg-zinc-100 placeholder-gray-600 border-2 border-gray-600 rounded-md focus:outline-none focus:border-teal-500'

    return (
        <input
            type={ hidden === true ? 'password' : 'text'} 
            placeholder={ placeholder }
            onChange={ onChange }
            className={ style } />
    );
}