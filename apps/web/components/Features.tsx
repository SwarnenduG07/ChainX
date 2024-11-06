

export function Feature({title, subtitle}: {
    title: string,
    subtitle: string
}): JSX.Element {
    return <div className="flex pl-8">
        <Check />
        <div className="flex flex-col justify-center pl-2">
            <div className="flex">
                <div className="font-bold text-sm">
                    {title}
                </div>

                <div className="pl-1 text-sm">
                    {subtitle}
                </div>
            </div>
        </div>
    </div>
}

function Check ():JSX.Element {
    return <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="m4.5 12.75 6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
  
}