type props = {
    url:  string,
    children: React.ReactNode
}

const CustomLink = ({url, children} : props) =>{
    return (<a href={url}
              className="text-indigo-600 font-bold underline hover:text-indigo-800"
              >{children}</a>)
}

export default CustomLink;