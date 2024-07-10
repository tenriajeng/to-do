import { useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'

interface ModalProps {
    children: React.ReactNode
    showModal: boolean
    setShowModal: Dispatch<SetStateAction<boolean>>
    containerClasses?: string
}

export default function Modal({
    children,
    showModal,
    setShowModal,
    containerClasses,
}: ModalProps) {
    const desktopModalRef = useRef(null)

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowModal(false)
            }
        },
        [setShowModal]
    )

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [onKeyDown])

    return (
        <>
            {showModal && (
                <>
                    <div
                        ref={desktopModalRef}
                        key="desktop-modal"
                        className="fixed inset-0 z-40 hidden min-h-screen items-center justify-center md:flex"
                        onMouseDown={(e) => {
                            if (desktopModalRef.current === e.target) {
                                setShowModal(false)
                            }
                        }}
                    >
                        <div
                            className={clsx(
                                `overflow relative w-full max-w-lg transform rounded-xl border border-gray-200 bg-white p-6 text-left shadow-2xl transition-all`,
                                containerClasses
                            )}
                        >
                            {children}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
