import { useState } from 'react'
import { IconPackage, IconAlertTriangle, IconSearch, IconPlus } from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockInventory } from '@/data/mock'

export default function Inventory() {
  const [search, setSearch] = useState('')
  const lowStock = mockInventory.filter((i) => i.stock <= i.minStock)
  const filtered = mockInventory.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconPackage className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Inventory</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button size="sm" className="gap-2">
            <IconPlus className="h-4 w-4" />
            Add Part
          </Button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground text-sm">{mockInventory.length} parts catalogued</p>
        </div>

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
            <IconAlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                {lowStock.length} items below minimum stock
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                {lowStock.map((i) => i.name).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-5 relative max-w-sm">
          <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search parts..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">SKU</th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Part Name</th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Category</th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Stock</th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Cost</th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Sell Price</th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((item) => {
                  const isLow = item.stock <= item.minStock
                  const isOut = item.stock === 0
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 cursor-pointer transition-colors">
                      <td className="px-4 py-3">
                        <span className="bg-muted rounded-md px-2 py-0.5 font-mono text-xs">{item.sku}</span>
                      </td>
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold tabular-nums ${isOut ? 'text-red-500' : isLow ? 'text-amber-500' : ''}`}>
                            {item.stock}
                          </span>
                          <span className="text-muted-foreground text-xs">/ min {item.minStock}</span>
                          {isOut && <IconAlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                          {isLow && !isOut && <IconAlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 tabular-nums">ETB {item.costPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 tabular-nums font-medium">ETB {item.sellPrice.toLocaleString()}</td>
                      <td className="text-muted-foreground px-4 py-3 text-xs">{item.supplier}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </Main>
    </>
  )
}
