import React from 'react'
import { Button } from '../ui/button'

import { UniqueIdentifier } from '@dnd-kit/core'
import { TrashIcon } from '@radix-ui/react-icons'

interface ContainerProps {
    id: UniqueIdentifier
    children: React.ReactNode
    title?: string
    description?: string
    onAddItem?: () => void
    handleDeleteContainer?: () => void
}

const Container = ({
    id,
    children,
    title,
    description,
    onAddItem,
    handleDeleteContainer,
}: ContainerProps) => {
    return (
        <div className="w-full max-h-96 p-4 bg-gray-50 rounded-xl flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-gray-800 text-xl">{title}</h1>
                <Button size="icon" onClick={handleDeleteContainer}>
                    <TrashIcon />
                </Button>
            </div>
            <div className="overflow-y-auto flex-1">{children}</div>
            <Button variant="ghost" onClick={onAddItem}>
                Add Item
            </Button>
        </div>
    )
}

export default Container
