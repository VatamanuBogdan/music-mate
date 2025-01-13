import { IdentifiableValue } from '../utils/utils';

interface Props {
    items: IdentifiableValue<number, string>[]
    selectedItemId: number,
    setSelectedItemId: React.Dispatch<React.SetStateAction<number>>
}

export default function ToggleGroup(props: Props) {


    const itemBaseClassName = 'transition ease-in-out duration-500 px-6 py-2 w-32'
    const selectedItemClassName = itemBaseClassName + ' bg-teal-500'

    return (
        <div className='text-zinc-100 text-lg font-medium border-2 border-teal-500 rounded-full overflow-hidden'>
            {
                props.items.map((item) => (
                    <button 
                        className={item.id == props.selectedItemId ? selectedItemClassName : itemBaseClassName}
                        onClick={() => props.setSelectedItemId(item.id)}>
                        
                        {item.value}
                    </button>
                ))
            }
        </div>
    )
}