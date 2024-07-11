import RegisterForm from '../components/form/Register'
import { Card } from '../components/ui/card'

const Register: React.FC = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="w-96">
                <RegisterForm />
            </Card>
        </div>
    )
}

export default Register
