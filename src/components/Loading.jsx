export default function Loading({ text = "Loading" }) {
    return(
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">{text}</p>
        </div>
    )
}