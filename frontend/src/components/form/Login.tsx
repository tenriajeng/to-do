import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Label } from '../ui/label'
import { apiRequest } from '../../api/apiUtils'

interface FormData {
    email: string
    password: string
}

const LoginForm: React.FC = () => {
    const navigate = useNavigate()

    const initialValues: FormData = {
        email: 'ilham2@mail.com',
        password: 'ilham123',
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
    })

    const handleLogin = async (
        values: FormData,
        actions: FormikHelpers<FormData>
    ) => {
        try {
            const response = await apiRequest('POST', '/login', values)
            console.log(response)

            if (response.status) {
                localStorage.setItem('token', response.data.data.access_token)
                navigate('/')
            }
        } catch (error) {
            console.error('Login error:', error)
            actions.setSubmitting(false)
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
        >
            {({ isSubmitting }) => (
                <Form className="w-full rounded-lg p-6 shadow-lg">
                    <div>
                        <h1 className="text-center text-2xl font-bold">
                            Login
                        </h1>
                    </div>
                    <div className="mt-3">
                        <Label htmlFor="email">Email</Label>
                        <Field
                            type="text"
                            id="email"
                            name="email"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter email"
                        />
                        <ErrorMessage
                            name="email"
                            component="div"
                            className="text-xs text-red-500"
                        />
                    </div>
                    <div className="mt-3">
                        <Label htmlFor="password">Password</Label>
                        <Field
                            type="password"
                            id="password"
                            name="password"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter password"
                        />
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="text-xs text-red-500"
                        />
                    </div>
                    <div className="mt-3 flex flex-col items-center">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                        <Link to={'/register'}>
                            <Button variant={'link'}>Register Here</Button>
                        </Link>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default LoginForm
