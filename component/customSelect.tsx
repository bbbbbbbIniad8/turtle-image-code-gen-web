type Props = {
    labelText: string
    defaultVal: number
    elementName: string
    handleEvent: (e: React.ChangeEvent<HTMLSelectElement>) => void
    optionLst: number[]
}

const CustomSelect = ({labelText, defaultVal, elementName, optionLst, handleEvent} :Props) =>{
    return(
    <div className="flex flex-row items-center justify-center gap-2 pt-3">
        <label htmlFor={elementName} className="whitespace-nowrap">{labelText}</label>
        <select className="border border-s-black rounded-2xl bg-white w-15" name={elementName}
            defaultValue={defaultVal} onChange={handleEvent}>
            {optionLst.map((element) => (
            <option className="rounded-2xl" key={element} value={element}>{element}</option>
            ))}
        </select>
    </div>
)}

export default CustomSelect