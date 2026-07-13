import { initialEvents, type EventRecord } from '../../data/eventData'
import { initialOrders, type OrderRecord } from '../../data/orderData'
import { initialShops, type Shop } from '../../data/shopData'
import type { User } from '../../data/userData'

/**
 * Frontend-only mock data access layer.
 * This keeps page components ready for future API migration.
 */
export const getInitialUsers = (): User[] => []

export const getInitialShops = (): Shop[] => [...initialShops]

export const getInitialOrders = (): OrderRecord[] => [...initialOrders]

export const getInitialEvents = (): EventRecord[] => [...initialEvents]
