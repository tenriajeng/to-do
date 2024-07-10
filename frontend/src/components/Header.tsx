import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import UserProfile from './UserProfile'

const Header = () => {
    const navigate = useNavigate()
    const token = 'asd'

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <>
            {token && (
                <header className="container h-20">
                    <nav className="h-20 justify-between flex items-center bg-opacity-75 backdrop-blur-sm">
                        <h1 className="text-xl font-bold">TODO</h1>
                        <Button variant="outline" onClick={handleLogout}>
                            Logout
                        </Button>
                    </nav>
                </header>
            )}
        </>
    )
}

export default Header
