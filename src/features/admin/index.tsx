import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  IconUsers,
  IconCar,
  IconClipboardList,
  IconPackage,
  IconPlus,
  IconSearch,
  IconShieldCheck,
} from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { mockCustomers, mockVehicles, mockInspections, mockInventory, type InventoryItem } from '@/data/mock'
import { useAuthStore } from '@/stores/authStore'

export default function AdminPage() {
  const { auth } = useAuthStore()
  const navigate = useNavigate()
  const [items, setItems] = useState<InventoryItem[]>(() => [...mockInventory])
  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('General')
  const [stock, setStock] = useState(0)
  const [sellPrice, setSellPrice] = useState(0)
  const [supplier, setSupplier] = useState('AutoParts Ethiopia')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!auth.user || !auth.accessToken) {
      navigate({ to: '/sign-in' })
    }
  }, [auth.accessToken, auth.user, navigate])

  const handleAddItem = () => {
    setError('')

    if (!sku.trim() || !name.trim()) {
      setError('Enter a valid SKU and name for the item.')
      return
    }

    const nextItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      sku: sku.trim(),
      name: name.trim(),
      category: category.trim() || 'General',
      stock: Math.max(0, stock),
      minStock: 1,
      unit: 'Unit',
      costPrice: Math.round(sellPrice * 0.65),
      sellPrice: sellPrice,
      supplier: supplier.trim() || 'Local Supplier',
      lastRestocked: new Date().toISOString().split('T')[0],
    }

    setItems((prev) => [nextItem, ...prev])
    setSku('')
    setName('')
    setCategory('General')
    setStock(0)
    setSellPrice(0)
    setSupplier('AutoParts Ethiopia')
  }

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconShieldCheck className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Admin Dashboard</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-6 grid gap-4 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <IconUsers className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-xl font-semibold">{mockCustomers.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <IconCar className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="text-sm text-muted-foreground">Vehicles</p>
                <p className="text-xl font-semibold">{mockVehicles.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <IconClipboardList className="h-6 w-6 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Inspections</p>
                <p className="text-xl font-semibold">{mockInspections.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <IconPackage className="h-6 w-6 text-violet-600" />
              <div>
                <p className="text-sm text-muted-foreground">Inventory Items</p>
                <p className="text-xl font-semibold">{items.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardContent>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Add inventory item</h2>
                  <p className="text-sm text-muted-foreground">Admin can add items here before they go to stock.</p>
                </div>
                <Button onClick={handleAddItem} className="gap-2">
                  <IconPlus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="SKU"
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                />
                <Input
                  placeholder="Item name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <Input
                  placeholder="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />
                <Input
                  placeholder="Supplier"
                  value={supplier}
                  onChange={(event) => setSupplier(event.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Stock quantity"
                  value={stock > 0 ? stock : ''}
                  onChange={(event) => setStock(Number(event.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Sell price"
                  value={sellPrice > 0 ? sellPrice : ''}
                  onChange={(event) => setSellPrice(Number(event.target.value))}
                />
              </div>
              {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-4 flex items-center gap-3">
                <IconSearch className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h2 className="text-lg font-semibold">Admin controls</h2>
                  <p className="text-sm text-muted-foreground">Use this page for protected administration tasks.</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Use your admin login to manage inventory, review inspections, and keep stock updated.</p>
                <p>Only signed in admin users can access this page.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Inventory items</h2>
                <p className="text-sm text-muted-foreground">Recent inventory items added by admin.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Supplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{item.sku}</td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3">{item.stock}</td>
                      <td className="px-4 py-3">ETB {item.sellPrice.toLocaleString()}</td>
                      <td className="px-4 py-3">{item.supplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
