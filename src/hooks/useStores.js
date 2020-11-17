import React from 'react'
import { storesContext } from '../store/RootStore'

export const useStores = () => React.useContext(storesContext)
