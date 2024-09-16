import home from './home'
import document from './document'
import entity from './entity'
import product from './product'
import inventory from './inventory'
import sales from './sales'

import type { VerticalNavItems } from '@layouts/types'

export default [...home, ...document, ...entity, ...product, ...inventory, ...sales] as VerticalNavItems