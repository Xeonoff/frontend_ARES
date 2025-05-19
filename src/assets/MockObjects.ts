

interface Rule {
    name: string;
    content: string;
    faculty?: string;
    semester?: number;
    building?: string;
    department?: string;
    parsed_content?: any;
}

// interface Product {
//     id: number,
//     full_name : string,
//     img : string,
//     status : '1' | '0',
//     bdate : string,
//     sex : 'm' | 'f',
//     email : string,
//     available_mem : string,
//     phone : string,
//     last_modified : string
// }

interface Response {
    count: number;
    next: string | null;
    previous: string | null;
    results: Rule[];
}
const defaultConstraint = (name: string): Rule =>{
    return {
        name: name,
        content: "\n\tСценарий: У одной группы не может быть двух занятий в одно время\n                                Дано Для пары занятий\n                                И в одно время\n                                И в одной аудитории\n                                И у одной группы\n                                То такое сочетание невозможно\n\n\t",
        faculty: "ИУ",
        semester: 8,
        building: "ГЗ",
        department: "ИУ5",
        parsed_content: [
            {
                scenario_name: "У одной группы не может быть двух занятий в одно время",
                steps: [
                    {
                        keyword: "Дано",
                        text: "Для пары занятий"
                    },
                    {
                        keyword: "И",
                        text: "в одно время"
                    },
                    {
                        keyword: "И",
                        text: "в одной аудитории"
                    },
                    {
                        keyword: "И",
                        text: "у одной группы"
                    },
                    {
                        keyword: "То",
                        text: "такое сочетание невозможно"
                    }
                ]
            }
        ]
    }
}

// const defaultProduct = (id: number): Product => {
//     return {
//         id: id,
//         full_name : "Неопознанный гуль",
//         img : defaultImage,
//         status : '1',
//         bdate : "2007-12-12",
//         sex : 'm',
//         email : "undefinedEmail",
//         available_mem : "1024,0",
//         phone :"+7(777)777-77-77",
//         last_modified : "none"
//     }
// }

// const getDefaultProductList = (count: number, searchValue: string): Product[] => {
//     let result = []
//     for (let i = 1; i <= count; ++i) {
//         result.push(defaultProduct(i))
//     }
//     result = result.filter((product) => {
//         return (searchValue == '' || product.full_name.toLowerCase().includes(searchValue.toLowerCase()))
//     })
//     return result
// }

export const getDefaultConstraintList = (count: number): Rule[] => {
    let result = []
    for (let i = 1; i <= count; ++i){
        result.push(defaultConstraint("Mocked Constraint"))
    }
    return result
}

export const getDefaultResponse = (count: number): Response => {
    return {
        count: count,
        next: null,
        previous: null,
        results: getDefaultConstraintList(count)
    }
}