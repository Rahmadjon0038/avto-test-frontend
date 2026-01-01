import { useMutation, useQueryClient } from "@tanstack/react-query"
import { instance } from "./api"

// ----------- update tiket ----------
const pay = async ({ paydata }) => {
    console.log(paydata, '000')
    const response = await instance.post('/api/subscription/activate', paydata)
    return response.data
}

export const usepayTiket = () => {
    const quericlient = useQueryClient();
    const payMutation = useMutation({
        mutationFn: pay,
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
    return payMutation
}