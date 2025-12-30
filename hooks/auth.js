import { useMutation } from "@tanstack/react-query"

const { instance } = require("./api")

const register = async ({ formData }) => {
    const response = await instance.post('/api/auth/register', formData)
    return response.data
}

export const useRegister = () => {
    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: (data, vars) => {
            if (vars.onSuccess) {
                vars.onSuccess(data)
            }
        },
        onError: (err, vars) => {
            if (vars.onError) {
                vars.onError(err)
            }
        }
    })
    return registerMutation
}
// --------------- login -------------
const login = async ({ loginPayload }) => {
    const response = await instance.post('/api/auth/login', loginPayload)
    return response.data
}

export const uselogin = () => {
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data, vars) => {
            if (vars.onSuccess) {
                vars.onSuccess(data)
            }
        },
        onError: (err, vars) => {
            if (vars.onError) {
                vars.onError(err)
            }
        }
    })
    return loginMutation
}