import { useState } from 'react'
import {
  useCajeroProducts,
  useFormasPago,
  useCreatePedido,
  useCart,
} from '@/features/cajero/hooks/useCajero'
import useToastStore from '@/store/toastStore'
import ProductGrid from '@/features/cajero/components/ProductGrid'
import ProductCustomizerModal from '@/features/cajero/components/ProductCustomizerModal'
import CartPanel from '@/features/cajero/components/CartPanel'
import OrderSuccessModal from '@/features/cajero/components/OrderSuccessModal'
import type { CajeroProduct, PedidoOut } from '@/features/cajero/types'
import { SkeletonGrid } from '@/shared/Skeleton'
export default function CajeroPage() {
  const { data: products, isLoading, isError, refetch } = useCajeroProducts()
  const { data: formasPago } = useFormasPago()
  const { mutateAsync: createPedido, isPending } = useCreatePedido()
  const cart = useCart()
  const [selectedPago, setSelectedPago] = useState('')
  const [clienteNombre, setClienteNombre] = useState('')
  const [successPedido, setSuccessPedido] = useState<PedidoOut | null>(null)
  const [customizingProduct, setCustomizingProduct] = useState<CajeroProduct | null>(null)

  const handleConfirmCustomization = (personalizacion: number[] | null) => {
    if (!customizingProduct) return
    cart.addItem(customizingProduct, personalizacion)
    setCustomizingProduct(null)
  }

  const handleCreateOrder = async () => {
    if (cart.isEmpty || !selectedPago || !clienteNombre.trim()) return
    try {
      const pedido = await createPedido({
        forma_pago_codigo: selectedPago,
        nombre_para: clienteNombre.trim(),
        direccion_id: null,
        notas: null,
        items: cart.items.map((i) => ({
          producto_id: i.id,
          cantidad: i.cantidad,
          personalizacion: i.personalizacion,
        })),
      })
      setSuccessPedido(pedido)
      cart.clearCart()
      setSelectedPago('')
      setClienteNombre('')
    } catch (error) {
      const raw = (error as any)?.response?.data?.detail
      const msg = typeof raw === 'string' ? raw : raw?.detail ?? 'Error al crear pedido'
      useToastStore.getState().addToast('error', msg)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 h-[calc(100vh-7rem)]">
        <div className="animate-pulse bg-surface-container-high h-8 w-48 mb-2" />
        <SkeletonGrid />
      </div>
    )
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <span className="material-symbols-outlined text-[48px] text-error opacity-60">cloud_off</span>
        <p className="text-body-md text-on-surface-variant">Error al cargar productos</p>
        <button onClick={() => void refetch()} className="px-4 py-2 bg-primary-container text-on-primary-container text-label-md font-bold hover:brightness-110 transition-all cursor-pointer">Reintentar</button>
      </div>
    )
  }
  return (
    <div className="flex gap-0 h-[calc(100vh-7rem)]">
      <ProductGrid products={products ?? []} onAddProduct={setCustomizingProduct} />
      <CartPanel
        items={cart.items}
        formasPago={formasPago ?? []}
        selectedPago={selectedPago}
        onSelectPago={setSelectedPago}
        clienteNombre={clienteNombre}
        onClienteNombreChange={setClienteNombre}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        subtotal={cart.subtotal}
        isEmpty={cart.isEmpty}
        isSubmitting={isPending}
        onCreateOrder={handleCreateOrder}
      />
      {customizingProduct && (
        <ProductCustomizerModal
          product={customizingProduct}
          onConfirm={handleConfirmCustomization}
          onClose={() => setCustomizingProduct(null)}
        />
      )}
      {successPedido && (
        <OrderSuccessModal pedido={successPedido} onClose={() => setSuccessPedido(null)} />
      )}
    </div>
  )
}