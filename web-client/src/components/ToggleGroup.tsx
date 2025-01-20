import { IdentifiableValue } from '../utils/helpers';

interface ToggleGroupProps {
    items: IdentifiableValue<React.Key, string>[]
    selectedItemId: React.Key,
    onChange: (id: React.Key) => void
}

export default function ToggleGroup({ items, selectedItemId, onChange }: ToggleGroupProps) {

    const itemBaseClassName = 'transition ease-in-out duration-500 px-3 py-2 w-28'
    const selectedItemClassName = itemBaseClassName + ' bg-teal-500'

    return (
        <div className='text-zinc-100 text-base font-medium border-2 border-teal-500 rounded-full overflow-hidden'>
            {
                items.map((item) => (
                    <button key={item.id}
                        className={item.id == selectedItemId ? selectedItemClassName : itemBaseClassName}
                        onClick={() => onChange(item.id)}>
                        
                        {item.value}
                    </button>
                ))
            }
        </div>
    )
}