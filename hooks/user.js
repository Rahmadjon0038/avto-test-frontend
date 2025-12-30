import { useQuery } from "@tanstack/react-query"

const { instance } = require("./api")

const getMe = async () => {
    const response = await instance.get('/api/auth/me')
    return response.data
}

export const useGetMe = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['me'],
        queryFn: getMe
    })

    return { data, isLoading, error }
}