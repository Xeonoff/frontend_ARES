import { useDispatch, useSelector } from 'react-redux';
import { updateCache, updateSearchValue} from "../store//productFilterSlice";


export function useProductFilter() {
    //@ts-ignore
    const cache = useSelector(state => state.productFilter.cache)
    //@ts-ignore
    const searchValue = useSelector(state => state.productFilter.searchValue)

    const dispatch = useDispatch()

    const setCache = (value: any) => {
        dispatch(updateCache(value))
    }

    const setSearchValue = (value: any) => {
        dispatch(updateSearchValue(value))
    }

    return {
        cache,
        searchValue,
        setCache,
        setSearchValue,
    }
}