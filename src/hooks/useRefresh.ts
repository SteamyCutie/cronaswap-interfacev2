import { useContext } from 'react'
import { RefreshContext } from '../contexts/RefreshContext'
// migrate from cronaswapv1
const useRefresh = () => {
  const { fast, slow } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow }
}

export default useRefresh
