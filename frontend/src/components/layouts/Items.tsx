import { UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import { MoveIcon, TrashIcon } from '@radix-ui/react-icons'
import { Button } from '../ui/button'
import axios from 'axios'

type ItemsType = {
    id: UniqueIdentifier
    status_id: UniqueIdentifier
    title: string
    description: string
    onClick: () => void
    handleDelete: () => void
}

const Items = ({ id, title, onClick, handleDelete }: ItemsType) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: 'item',
        },
    })

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            style={{
                transition,
                transform: CSS.Translate.toString(transform),
            }}
            className={clsx(
                'px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200',
                isDragging && 'opacity-50'
            )}
        >
            <div className="flex items-center justify-between">
                <span className="hover:underline" onClick={onClick}>
                    {title}
                </span>
                <div className="space-x-1">
                    <Button
                        className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl z-50"
                        onClick={handleDelete}
                    >
                        <TrashIcon />
                    </Button>
                    <button
                        className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
                        {...listeners}
                    >
                        <MoveIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Items
