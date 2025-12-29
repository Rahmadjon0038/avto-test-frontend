'use client'
const { useParams } = require("next/navigation")

const page = () => {
    const {id} = useParams()
    console.log(id)
    return (
        <div>
            <h1>{id} - bilet</h1>
        </div>
    )
}
export default page