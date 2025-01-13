import { IdentifiableValue } from '../utils/utils';

interface Props<ItemId> {
    items: IdentifiableValue<ItemId, string>[]
    selectedItemId: ItemId,
    onChange: (id: ItemId) => void
}

export default function ToggleGroup<ItemId> (props: Props<ItemId>) {


    const itemBaseClassName = 'transition ease-in-out duration-500 px-6 py-2 w-32'
    const selectedItemClassName = itemBaseClassName + ' bg-teal-500'

    return (
        <div className='text-zinc-100 text-lg font-medium border-2 border-teal-500 rounded-full overflow-hidden'>
            {
                props.items.map((item) => (
                    <button 
                        className={item.id == props.selectedItemId ? selectedItemClassName : itemBaseClassName}
                        onClick={() => props.onChange(item.id)}>
                        
                        {item.value}
                    </button>
                ))
            }
        </div>
    )
}