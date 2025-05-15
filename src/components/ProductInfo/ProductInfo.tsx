import { FC } from 'react'
import { useAuth } from "../../hooks/useAuth";
import { useSsid } from '../../hooks/useSsid';
import axios from "axios";

import './ProductInfo.css'
export interface Param {
    key: string,
    value: string
}

interface Props {
    id: number,
    full_name: string,
    parameters: Param[],
    img: string
}

const ProductInfo: FC<Props> = ({id, full_name, parameters}) => {

    const { session_id } = useSsid()
    const { is_authenticated } = useAuth()

    const addToCart = async (participants_id: number) => {
        await axios(`/api/receivers/${participants_id}/`, {
            method: "POST",
            headers: {
                'authorization': session_id
            },
        })
    }

    return (
        <div className="product">
            <div className="product-info" key={id.toString()}>
                <h4 className="product-title">{full_name}</h4>
                <input type="radio" name="radio" id="product-params" defaultChecked />
                <input type="radio" name="radio" id="product-reviews" />
                <div className="product-bar">
                    <label htmlFor="product-params" className="product-params-text">Информация о получателе</label>
                </div>
                <table className="product-params">
                    {parameters && parameters.map((param) => (
                        param.value && <tr className="product-param">
                        <td className="property-key">
                            <h4 className="property-key-text">{param.key}</h4>
                            <h4 className="property-key-dots"></h4>
                        </td>
                        <td className="property-value">{param.value}</td>
                    </tr>
                    ))}
                </table>
            </div>
            <div className="product-price-card">
                {is_authenticated ? <button className="product-to-cart-green" type="button" onClick={ () => addToCart(id) }>➕</button> : <button className="product-to-cart-grey" type="button">➕</button>}
                {!is_authenticated  && <h5 className="help-text">Авторизуйтесь, чтобы добавить получателя</h5>}
            </div>
        </div>
    )
}

export default ProductInfo