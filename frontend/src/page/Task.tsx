import { useEffect, useState } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import Container from '../components/layouts/Container'
import Items from '../components/layouts/Items'
import Modal from '../components/Modal'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { useForm } from 'react-hook-form'
import { apiRequest } from '../api/apiUtils'

type DNDType = {
    id: UniqueIdentifier
    title: string
    items: {
        id: UniqueIdentifier
        title: string
        description: string
    }[]
}

export default function Home() {
    const [containers, setContainers] = useState<DNDType[]>([])
    const [currentContainerId, setCurrentContainerId] =
        useState<UniqueIdentifier>()
    const [containerName, setContainerName] = useState('')
    const [showAddContainerModal, setShowAddContainerModal] = useState(false)
    const [showAddItemModal, setShowAddItemModal] = useState(false)
    const { register, handleSubmit, setValue, reset } = useForm()
    const [selectedItem, setSelectedItem] = useState(null)

    const handleItemClick = (item: any, status_id: UniqueIdentifier) => {
        item.status_id = status_id
        setSelectedItem(item)
        setShowAddItemModal(true)
        reset(item)
    }

    const handleDelete = async (id: UniqueIdentifier) => {
        try {
            const newId = parseInt(id.toString().replace('item-', ''), 10)
            await apiRequest('DELETE', `/tasks/${newId}`)
            fetchData()
        } catch (error) {
            console.error('Failed to delete the task', error)
        }
    }

    const handleDeleteContainer = async (id: UniqueIdentifier) => {
        try {
            const newId = parseInt(id.toString().replace('container-', ''), 10)
            await apiRequest('DELETE', `/statuses/${newId}`)
            fetchData()
        } catch (error) {
            console.error('Failed to delete the task', error)
        }
    }

    useEffect(() => {
        setValue('status_id', currentContainerId)
    }, [currentContainerId, setValue])

    const onSubmit = async (data: any) => {
        try {
            data.status_id = parseInt(
                data.status_id.replace('container-', ''),
                10
            )

            if (data.id) {
                let { id, ...requestData } = data
                id = parseInt(id.replace('item-', ''), 10)
                const url = `/tasks/${id}`
                await apiRequest('PUT', url, requestData)
            } else {
                const url = '/tasks'
                await apiRequest('POST', url, data)
            }

            reset({ title: '', description: '', status_id: '' })
            fetchData()
            setShowAddItemModal(false)
        } catch (error) {
            console.error('Error adding item:', error)
        }
    }

    const fetchData = async () => {
        const response = await apiRequest('GET', '/statuses')

        const data = response.data

        const formattedData = data.data.map((container: any) => ({
            id: `container-${container.id}`,
            title: container.name,
            items: container.tasks.map((item: any) => ({
                id: `item-${item.id}`,
                title: item.title,
                description: item.description,
            })),
        }))
        setContainers(formattedData)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const onAddContainer = async () => {
        if (!containerName) return

        try {
            const body = {
                name: containerName,
            }

            const response = await apiRequest('POST', '/statuses', body)

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
                    <Input
                        type="hidden"
                        placeholder="Status ID"
                        {...register('status_id')}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
                    {containers.map((container) => (
                        <Container
                            id={container.id}
                            title={container.title}
                            key={container.id}
                            onAddItem={() => {
                                setShowAddItemModal(true)
                                setCurrentContainerId(container.id)
                            }}
                            handleDeleteContainer={() =>
                                handleDeleteContainer(container.id)
                            }
                        >
                            <SortableContext
                                items={container.items.map((i) => i.id)}
                            >
                                <div className="flex items-start flex-col gap-y-4">
                                    {container.items.map((i) => (
                                        <Items
                                            title={i.title}
                                            description={i.description}
                                            status_id={container.id}
                                            id={i.id}
                                            key={i.id}
                                            onClick={() =>
                                                handleItemClick(i, container.id)
                                            }
                                            handleDelete={() =>
                                                handleDelete(i.id)
                                            }
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </Container>
                    ))}
                </div>
            </div>
        </div>
    )
}
