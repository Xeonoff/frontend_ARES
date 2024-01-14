import { FC, useState } from 'react'

interface Props {
    className: string,
    src: string,
    based: string
}

const ImageWrapper: FC<Props> = ({ className, src, based }) => {
    const [ source, setSource ] = useState<string> (src)

    const onError = () => {
        setSource(based)
    }

    return <img className={className} src={source} onError={onError} />
}

export default ImageWrapper;