import { UniqueIdentifier } from '@dnd-kit/core'
import { TrashIcon } from '@radix-ui/react-icons'
import { Button } from '../ui/button'

type ItemsType = {
    id: UniqueIdentifier
    status_id: UniqueIdentifier
    title: string
    description: string
    onClick: () => void
    handleDelete: () => void
}

const Items = ({ id, title, onClick, handleDelete }: ItemsType) => {
    return (
        <div className="px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200">
            <div className="flex items-center justify-between px-2">
                <span className="hover:underline" onClick={onClick}>
                    {title}
                </span>
                <Button size="icon" onClick={handleDelete}>
                    <TrashIcon />
                </Button>
            </div>
        </div>
    )
}

export default Items
