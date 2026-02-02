type props = {
    children: React.ReactNode
}

const CustomBtn = ({children} :props) =>{
    return (
        <div className="p-3 mx-3 my-2 font-bold bg-emerald-300 
        rounded-2xl hover:scale-120 duration-300">{children}</div>
    )
}

export default CustomBtn