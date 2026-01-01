import { useQuery } from "@tanstack/react-query"

const { instance } = require("./api")

const getQuestionTicketid = async ({ queryKey }) => {
    const id = queryKey[1];
    const response = await instance.get(`/api/questions/ticket/${id}`)
    return response.data
}


export const usegetQuestionTicketid = (id) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['question', id],
        queryFn: getQuestionTicketid
    })

    return { data, isLoading, error }
}