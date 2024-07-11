import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

// DnD
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    UniqueIdentifier,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'

// Components
import Container from '../components/layouts/Container'
import Items from '../components/layouts/Items'
import Modal from '../components/Modal'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import axios from 'axios'
import { useForm } from 'react-hook-form'

type DNDType = {
    id: UniqueIdentifier
    title: string
    items: {
        id: UniqueIdentifier
        title: string
    }[]
}

export default function Home() {
    const [containers, setContainers] = useState<DNDType[]>([])
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
    const [currentContainerId, setCurrentContainerId] =
        useState<UniqueIdentifier>()
    const [containerName, setContainerName] = useState('')
    const [itemName, setItemName] = useState('')
    const [showAddContainerModal, setShowAddContainerModal] = useState(false)
    const [showAddItemModal, setShowAddItemModal] = useState(false)
    const { register, handleSubmit, reset } = useForm()

    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyMDYxOTA1OCwianRpIjoiNGNmMTZiZmEtN2M1MS00ZDFhLWI5NzUtNzAxMGFiYmRmZWYwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzIwNjE5MDU4LCJjc3JmIjoiYzRlNzllNmEtNWNiNy00Y2YyLWIyOTgtYzdmNjAxODNmOTY5IiwiZXhwIjoxNzIwNjE5OTU4fQ.zKdmmYal5eXwJQzU-kkv8mzTYJYidqynq8PfYAy9TkE'
    const headers = {
        Authorization: 'Bearer ' + token,
    }

    const onSubmit = async (data: any) => {
        try {
            console.log(data)
            const url = 'http://127.0.0.1:5000/tasks'
            const response = await axios.post(url, data, { headers })
            console.log('response', response)

            // Assuming you have containers state and setContainers function defined somewhere
            // Copy the current state of containers
            const updatedContainers = [...containers]

            // Assuming you have a way to get the current container id
            const currentContainer = updatedContainers.find(
                (item) => item.id === currentContainerId
            )

            if (currentContainer) {
                // Add the new item to the current container
                currentContainer.items.push({
                    id: response.data.data.id,
                    title: response.data.data.title,
                })

                // Update the containers state with the updated container
                setContainers(updatedContainers)
                reset() // Reset form fields
                setShowAddItemModal(false) // Close the modal after adding the item
            } else {
                console.error('Current container not found')
            }
        } catch (error) {
            console.error('Error adding item:', error)
            // Handle error scenarios here
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://127.0.0.1:5000/statuses',
                    { headers }
                )

                const data = response.data
                console.log(data.data)

                const formattedData = data.data.map((container: any) => ({
                    id: `container-${container.id}`,
                    title: container.name,
                    items: container.tasks.map((item: any) => ({
                        id: `item-${item.id}`,
                        title: item.title,
                    })),
                }))
                setContainers(formattedData)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const onAddContainer = async () => {
        if (!containerName) return

        try {
            const url = 'http://127.0.0.1:5000/statuses'
            const body = {
                name: containerName,
            }

            const response = await axios.post(url, body, { headers })
            console.log(response)

            if (response.status !== 201) {
                throw new Error('Network response was not ok')
            }

            const { id } = response.data.data
            const newContainer = {
                id: `container-${id}`,
                title: containerName,
                items: [],
            }

            setContainers([...containers, newContainer])
            setContainerName('')
            setShowAddContainerModal(false)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const onAddItem = async () => {
        if (!itemName) return

        const body = {
            title: 'makan pagi',
            description: 'harus makan sebelum jam 10',
            status_id: 1,
        }

        const response = await axios.post('http://127.0.0.1:5000/tasks', body, {
            headers,
        })

        const id = `item-${uuidv4()}`
        const container = containers.find(
            (item) => item.id === currentContainerId
        )
        if (!container) return
        container.items.push({
            id,
            title: itemName,
        })
        setContainers([...containers])
        setItemName('')
        setShowAddItemModal(false)
    }

    // Find the value of the items
    function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
        if (type === 'container') {
            return containers.find((item) => item.id === id)
        }
        if (type === 'item') {
            return containers.find((container) =>
                container.items.find((item) => item.id === id)
            )
        }
    }

    const findItemTitle = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'item')
        if (!container) return ''
        const item = container.items.find((item) => item.id === id)
        if (!item) return ''
        return item.title
    }

    const findContainerTitle = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'container')
        if (!container) return ''
        return container.title
    }

    const findContainerItems = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'container')
        if (!container) return []
        return container.items
    }

    // DND Handlers
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragStart(event: DragStartEvent) {
        const { active } = event
        const { id } = active
        setActiveId(id)
    }

    const handleDragMove = (event: DragMoveEvent) => {
        const { active, over } = event

        // Handle Items Sorting
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('item') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active container and over container
            const activeContainer = findValueOfItems(active.id, 'item')
            const overContainer = findValueOfItems(over.id, 'item')

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return

            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id
            )
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id
            )

            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id
            )
            const overitemIndex = overContainer.items.findIndex(
                (item) => item.id === over.id
            )
            // In the same container
            if (activeContainerIndex === overContainerIndex) {
                let newItems = [...containers]
                newItems[activeContainerIndex].items = arrayMove(
                    newItems[activeContainerIndex].items,
                    activeitemIndex,
                    overitemIndex
                )

                setContainers(newItems)
            } else {
                // In different containers
                let newItems = [...containers]
                const [removeditem] = newItems[
                    activeContainerIndex
                ].items.splice(activeitemIndex, 1)
                newItems[overContainerIndex].items.splice(
                    overitemIndex,
                    0,
                    removeditem
                )
                setContainers(newItems)
            }
        }

        // Handling Item Drop Into a Container
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('container') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item')
            const overContainer = findValueOfItems(over.id, 'container')

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return

            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id
            )
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id
            )

            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id
            )

            // Remove the active item from the active container and add it to the over container
            let newItems = [...containers]
            const [removeditem] = newItems[activeContainerIndex].items.splice(
                activeitemIndex,
                1
            )
            newItems[overContainerIndex].items.push(removeditem)
            setContainers(newItems)
        }
    }

    // This is the function that handles the sorting of the containers and items when the user is done dragging.
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        // Handling Container Sorting
        if (
            active.id.toString().includes('container') &&
            over?.id.toString().includes('container') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === active.id
            )
            const overContainerIndex = containers.findIndex(
                (container) => container.id === over.id
            )
            // Swap the active and over container
            let newItems = [...containers]
            newItems = arrayMove(
                newItems,
                activeContainerIndex,
                overContainerIndex
            )
            setContainers(newItems)
        }

        // Handling item Sorting
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('item') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item')
            const overContainer = findValueOfItems(over.id, 'item')

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return
            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id
            )
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id
            )
            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id
            )
            const overitemIndex = overContainer.items.findIndex(
                (item) => item.id === over.id
            )

            // In the same container
            if (activeContainerIndex === overContainerIndex) {
                let newItems = [...containers]
                newItems[activeContainerIndex].items = arrayMove(
                    newItems[activeContainerIndex].items,
                    activeitemIndex,
                    overitemIndex
                )
                setContainers(newItems)
            } else {
                // In different containers
                let newItems = [...containers]
                const [removeditem] = newItems[
                    activeContainerIndex
                ].items.splice(activeitemIndex, 1)
                newItems[overContainerIndex].items.splice(
                    overitemIndex,
                    0,
                    removeditem
                )
                setContainers(newItems)
            }
        }
        // Handling item dropping into Container
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('container') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item')
            const overContainer = findValueOfItems(over.id, 'container')

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return
            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id
            )
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id
            )
            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id
            )

            let newItems = [...containers]
            const [removeditem] = newItems[activeContainerIndex].items.splice(
                activeitemIndex,
                1
            )
            newItems[overContainerIndex].items.push(removeditem)
            setContainers(newItems)
        }
        setActiveId(null)
    }

    return (
        <div className="mx-auto container py-10">
            {/* Add Container Modal */}
            <Modal
                showModal={showAddContainerModal}
                setShowModal={setShowAddContainerModal}
            >
                <div className="flex flex-col w-full items-start gap-y-4">
                    <h1 className="text-gray-800 text-3xl font-bold">
                        Add Container
                    </h1>
                    <Input
                        type="text"
                        placeholder="Container Title"
                        name="containername"
                        value={containerName}
                        onChange={(e) => setContainerName(e.target.value)}
                    />
                    <Button onClick={onAddContainer}>Add container</Button>
                </div>
            </Modal>
            {/* Add Item Modal */}
            <Modal
                showModal={showAddItemModal}
                setShowModal={setShowAddItemModal}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col w-full items-start gap-y-4"
                >
                    <h1 className="text-gray-800 text-3xl font-bold">
                        Add Item
                    </h1>
                    <Input
                        type="text"
                        placeholder="Item Title"
                        {...register('title', { required: true })}
                        className="input-field"
                    />
                    <Input
                        type="text"
                        placeholder="Item Description"
                        {...register('description')}
                        className="input-field"
                    />
                    <input
                        type="number"
                        placeholder="Status ID"
                        // value={currentContainerId}
                        {...register('status_id', { valueAsNumber: true })}
                        className="input-field"
                    />
                    <Button type="submit" className="btn-primary">
                        Add Item
                    </Button>
                </form>
            </Modal>
            <div className="flex items-center justify-between gap-y-2">
                <h1 className="text-gray-800 text-3xl font-bold">Tasks</h1>
                <Button onClick={() => setShowAddContainerModal(true)}>
                    Add Container
                </Button>
            </div>
            <div className="mt-10">
                <div className="grid grid-cols-3 gap-6">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={containers.map((i) => i.id)}>
                            {containers.map((container) => (
                                <Container
                                    id={container.id}
                                    title={container.title}
                                    key={container.id}
                                    onAddItem={() => {
                                        setShowAddItemModal(true)
                                        setCurrentContainerId(container.id)
                                    }}
                                >
                                    <SortableContext
                                        items={container.items.map((i) => i.id)}
                                    >
                                        <div className="flex items-start flex-col gap-y-4">
                                            {container.items.map((i) => (
                                                <Items
                                                    title={i.title}
                                                    id={i.id}
                                                    key={i.id}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </Container>
                            ))}
                        </SortableContext>
                        <DragOverlay adjustScale={false}>
                            {/* Drag Overlay For item Item */}
                            {activeId &&
                                activeId.toString().includes('item') && (
                                    <Items
                                        id={activeId}
                                        title={findItemTitle(activeId)}
                                    />
                                )}
                            {/* Drag Overlay For Container */}
                            {activeId &&
                                activeId.toString().includes('container') && (
                                    <Container
                                        id={activeId}
                                        title={findContainerTitle(activeId)}
                                    >
                                        {findContainerItems(activeId).map(
                                            (i) => (
                                                <Items
                                                    key={i.id}
                                                    title={i.title}
                                                    id={i.id}
                                                />
                                            )
                                        )}
                                    </Container>
                                )}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>
        </div>
    )
}
