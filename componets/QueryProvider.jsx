'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const QueryProvider = ({ children }) => {
    const querclient = new QueryClient()
    return (
        <div>
            <QueryClientProvider client={querclient}>
                {children}
            </QueryClientProvider>
        </div>
    )
}
export default QueryProvider