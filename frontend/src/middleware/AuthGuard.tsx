import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { apiRequest } from '../api/apiUtils'

const AuthGuard = () => {
    const [auth, setAuth] = useState<boolean | null>(null)

    const verifyToken = async (): Promise<boolean> => {
        try {
            const response = await apiRequest('GET', '/verify-token')
            console.log(response)

            if (response.status === 401) {
                return false
            }

            if (response.status === 200) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error('Error verifying token:', error)
            return false
        }
    }

    useEffect(() => {
        verifyToken().then((isValid) => {
            setAuth(isValid)
        })
    }, [])

    if (auth === null) {
        return null
    }

    return auth ? <Outlet /> : <Navigate to="/login" />
}

export default AuthGuard
