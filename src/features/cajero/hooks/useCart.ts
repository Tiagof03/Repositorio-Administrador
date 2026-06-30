import { useState, useMemo, useCallback } from 'react'
import type { CajeroProduct, CartItem } from '@/features/cajero/types'

function personalizacionKey(p: number[] | null): string {
    return p ? [...p].sort((a, b) => a - b).join(',') : 'default'
}

export function useCart() {
    const [items, setItems] = useState<CartItem[]>([])
    const addItem = useCallback((product: CajeroProduct, personalizacion: number[] | null) => {
        setItems((prev) => {
            const key = personalizacionKey(personalizacion)
            const existing = prev.find(
                (i) => i.id === product.id && personalizacionKey(i.personalizacion) === key,
            )
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id && personalizacionKey(i.personalizacion) === key
                    ? { ...i, cantidad: i.cantidad + 1 }
                    : i,
                )
            }
            return [
                ...prev,
                {
                    id: product.id,
                    nombre: product.nombre,
                    precioBase: product.precioBase,
                    cantidad: 1,
                    imagenesUrl: product.imagenesUrl,
                    personalizacion,
                },
            ]
        })
    }, [])
    const removeItem = useCallback((productId: number) => {
        setItems((prev) => prev.filter((i) => i.id !== productId))
    }, [])
    const updateQuantity = useCallback((productId: number, cantidad: number) => {
        setItems((prev) =>
            cantidad <= 0
                ? prev.filter((i) => i.id !== productId)
                : prev.map((i) => (i.id === productId ? { ...i, cantidad } : i)),
        )
    }, [])
    const clearCart = useCallback(() => setItems([]), [])
    const subtotal = useMemo(() => items.reduce((acc, i) => acc + i.precioBase * i.cantidad, 0), [items])
    const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.cantidad, 0), [items])
    return { items, addItem, removeItem, updateQuantity, clearCart, subtotal, totalItems, isEmpty: items.length === 0 }
}
