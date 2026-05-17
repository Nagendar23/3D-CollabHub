export default function Skeleton({ className = 'h-4 w-full rounded', lines = 1 }){
    const items = Array.from({length: lines});
    return (
        <div className={`space-y-2 ${className}`}> 
            {items.map((_,i)=> (
                <div key={i} className="bg-slate-700 animate-pulse" style={{height: '1rem', borderRadius: '0.375rem'}}></div>
            ))}
        </div>
    )
}
