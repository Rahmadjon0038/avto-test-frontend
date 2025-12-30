import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const { instance } = require("./api")

const getAlltikets = async () => {
    const response = await instance.get('/api/tickets')
    return response.data
}

export const usegetAlltikets = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['tickets'],
        queryFn: getAlltikets
    })

    return { data, isLoading, error }
}

// ----------- delete tiket ----------
const deleteTiket = async ({ id }) => {
    const response = await instance.delete(`/api/tickets/${id}`)
    return response.data
}

export const usedeleteTiket = () => {
    const quericlient = useQueryClient();
    const deleteTiketMutation = useMutation({
        mutationFn: deleteTiket,
        onSuccess: (data, vars) => {
            if (vars.onSuccess) {
                vars.onSuccess(data)
                quericlient.invalidateQueries(['ticktes'])
            }
        },
        onError: (err, vars) => {
            if (vars.onError) {
                vars.onError(err)
            }
        }
    })
    return deleteTiketMutation
}

// ----------- create tiket ----------
const create = async ({ payload }) => {
    console.log(payload,'000')
    const response = await instance.post(`/api/tickets`, payload)
    return response.data
}

export const usecreateTiket = () => {
    const quericlient = useQueryClient();
    const createMutation = useMutation({
        mutationFn: create,
        onSuccess: (data, vars) => {
            if (vars.onSuccess) {
                vars.onSuccess(data)
                quericlient.invalidateQueries(['ticktes'])
            }
        },
        onError: (err, vars) => {
            if (vars.onError) {
                vars.onError(err)
            }
        }
    })
    return createMutation
}

// ----------- update tiket ----------
const update = async ({ id,payload }) => {
    console.log(payload,'000')
    const response = await instance.put(`/api/tickets/${id}`, payload)
    return response.data
}

export const useupdateTiket = () => {
    const quericlient = useQueryClient();
    const updateMutation = useMutation({
        mutationFn: update,
        onSuccess: (data, vars) => {
            if (vars.onSuccess) {
                vars.onSuccess(data)
                quericlient.invalidateQueries(['ticktes'])
            }
        },
        onError: (err, vars) => {
            if (vars.onError) {
                vars.onError(err)
            }
        }
    })
    return updateMutation
}