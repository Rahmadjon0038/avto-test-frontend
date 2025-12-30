import toast from "react-hot-toast"
export const getNotify = () => {
    const notify = (ok, msg) => {
        if (ok == 'ok') {
            toast.success(msg || 'Succes')
        }
        else if (ok == 'err') {
            toast.error(msg || 'Error')
        }
    }
    return notify;
}