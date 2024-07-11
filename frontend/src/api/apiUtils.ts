import axios, { AxiosRequestConfig, Method } from 'axios'

const SERVICE_URL = process.env.REACT_APP_API_URL

const getToken = (): string | null => {
    return localStorage.getItem('token')
}

const getHeaders = () => {
    const token = getToken()
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
}

export const apiRequest = async (method: Method, url: string, data?: any) => {
    url = SERVICE_URL + url

    const config: AxiosRequestConfig = {
        method,
        url,
        headers: getHeaders(),
        data,
    }
    console.log(config)

    try {
        const response = await axios(config)

        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                `Failed to make ${method} request to ${url}`,
                error.message
            )
        } else {
            console.error(`An unexpected error occurred:`, error)
        }
        throw error
    }
}
