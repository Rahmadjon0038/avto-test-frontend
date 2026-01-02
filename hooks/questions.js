import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// POST /api/questions uchun mutation
const { instance } = require("./api")

const addQuestion = async ({ formData }) => {
    const response = await instance.post('/api/questions', formData);
    return response.data;
};

export const useAddQuestion = () => {
    const quericlient = useQueryClient();
    const addmutation = useMutation({
        mutationFn: addQuestion,
        onSuccess: (data, vars) => {
            if (vars && vars.onSuccess) {
                quericlient.invalidateQueries(['question'])
                vars.onSuccess(data);
            }
        },
        onError: (err, vars) => {
            if (vars && vars.onError) {
                vars.onError(err);
            }
        },
    });
    return addmutation;
};


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

// ------ delete question -----
const deletequestion = async ({ id }) => {
    const response = await instance.delete(`/api/questions/${id}`);
    return response.data;
};

export const usedeletequestion = () => {
    const quericlient = useQueryClient();
    const deletemutation = useMutation({
        mutationFn: deletequestion,
        onSuccess: (data, vars) => {
            if (vars && vars.onSuccess) {
                quericlient.invalidateQueries(['question'])
                vars.onSuccess(data);
            }
        },
        onError: (err, vars) => {
            if (vars && vars.onError) {
                vars.onError(err);
            }
        },
    });
    return deletemutation;
};