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
}

const Items = ({ id, title, onClick }: ItemsType) => {
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

    const handleDelete = async () => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyMDY4OTAwMCwianRpIjoiZmFjNGEyZjAtM2NhMy00Mzc4LTljMWEtZDE1MjA4ODViNGJkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzIwNjg5MDAwLCJjc3JmIjoiYzBkMjA0YWEtMTU2ZS00NTQ4LTlkY2YtMjJlYWI2ZDM5YTIyIiwiZXhwIjoxNzIwNjg5OTAwfQ.VQJ1kvPVH1MG189S0EqVgd0tQLnPo9qi-wJozaS7lwo'
        const headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        }
        try {
            const newId = parseInt(id.toString().replace('item-', ''), 10)
            await axios.delete(`http://127.0.0.1:5000/tasks/${newId}`, {
                headers,
            })
        } catch (error) {
            console.error('Failed to delete the task', error)
        }
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            style={{
                transition,
                transform: CSS.Translate.toString(transform),
            }}
            className={clsx(
                'px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200 cursor-pointer',
                isDragging && 'opacity-50'
            )}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                {title}
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
