import React from 'react'
import { Card } from '../components/ui/card'
import LoginForm from '../components/form/Login'

const Login: React.FC = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="w-96">
                <LoginForm />
            </Card>
        </div>
    )
}

export default Login
