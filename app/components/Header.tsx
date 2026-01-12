
export default function Header ({ heading }: { heading: string }) {
    return(
        <div className="flex justify-start items-center gap-x-1">
            <div className="h-6 w-1 bg-black"></div>
            <div className="text-black text-xl font-bold ">{heading}</div>
        </div>
    )
}