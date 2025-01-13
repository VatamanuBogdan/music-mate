interface Props {
    placeholder: string
    hidden?: boolean
}

export default function InputField(props: Props) {

    return (
        <input 
            type={ props.hidden === true ? 'password' : 'text'} 
            placeholder={ props.placeholder }
            className='w-96 h-12 px-2 -py-1 text-base focus:outline-none bg-transparent font-normal border-2 rounded-md bg-zinc-100 placeholder-gray-600 border-gray-600 focus:border-teal-500'
        />
    );
}