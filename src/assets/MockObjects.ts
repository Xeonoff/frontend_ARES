import defaultImage from '../assets/default.jpg';


interface Product {
    id: number,
    full_name : string,
    img : string,
    status : '1' | '0',
    bdate : string,
    sex : 'm' | 'f',
    email : string,
    available_mem : string,
    phone : string,
    last_modified : string
}

interface Response {
    RequestId: number
    Participants: Product[]
}

const defaultProduct = (id: number): Product => {
    return {
        id: id,
        full_name : "Неопознанный гуль",
        img : defaultImage,
        status : '1',
        bdate : "2007-12-12",
        sex : 'm',
        email : "undefinedEmail",
        available_mem : "1024,0",
        phone :"+7(777)777-77-77",
        last_modified : "none"
    }
}

const getDefaultProductList = (count: number, searchValue: string): Product[] => {
    let result = []
    for (let i = 1; i <= count; ++i) {
        result.push(defaultProduct(i))
    }
    result = result.filter((product) => {
        return (searchValue == '' || product.full_name.toLowerCase().includes(searchValue.toLowerCase()))
    })
    return result
}

export const getDefaultResponse = (count: number, searchValue: string): Response => {
    return {
        RequestId: -1,
        Participants: getDefaultProductList(count, searchValue)
    }
}