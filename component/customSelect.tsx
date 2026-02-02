type Props = {
    labelText: string
    defaultVal: number
    elementName: string
    handleEvent: (e: React.ChangeEvent<HTMLSelectElement>) => void
    optionLst: number[]
}

const CustomSelect = ({labelText, defaultVal, elementName, optionLst, handleEvent} :Props) =>{
    return(
    <>
        <label htmlFor={elementName}>{labelText}</label>
        <select className="border border-s-black rounded-2xl" name={elementName}
            defaultValue={defaultVal} onChange={handleEvent}>
            {optionLst.map((element) => (
            <option className="rounded-2xl" key={element} value={element}>{element}</option>
            ))}
        </select>
    </>
)}

export default CustomSelect