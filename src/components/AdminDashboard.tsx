'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Check,
  X,
  Eye,
  Truck,
  DollarSign,
  Calendar
} from 'lucide-react'
import Header from '@/components/Header'

interface Product {
  id: string
  name: string
  category: string
  brand: string
  price: number
  stock: number
  unit: string
  lowStockAlert: number
}

interface Order {
  id: string
  customerName: string
  company: string
  date: string
  deliveryDate: string
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  total: number
  items: { name: string; quantity: number; price: number }[]
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    unit: '',
    lowStockAlert: '',
    description: ''
  })

  // Sample data
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Architectural Shingles - Charcoal', category: 'shingles', brand: 'Owens Corning', price: 89.99, stock: 150, unit: 'bundle', lowStockAlert: 50 },
    { id: '2', name: 'Synthetic Underlayment - 10 SQ', category: 'underlayment', brand: 'Titanium UDL', price: 89.99, stock: 25, unit: 'roll', lowStockAlert: 30 },
    { id: '3', name: 'Aluminum Drip Edge - White', category: 'drip-edge', brand: 'Amerimax', price: 3.25, stock: 500, unit: 'linear ft', lowStockAlert: 100 },
  ])

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'John Smith',
      company: 'ABC Roofing Co.',
      date: '2024-08-27',
      deliveryDate: '2024-08-30',
      status: 'pending',
      total: 1324.89,
      items: [
        { name: 'Architectural Shingles - Charcoal', quantity: 10, price: 89.99 },
        { name: 'Synthetic Underlayment', quantity: 5, price: 89.99 }
      ]
    },
    {
      id: 'ORD-002',
      customerName: 'Sarah Johnson',
      company: 'Professional Roofers LLC',
      date: '2024-08-26',
      deliveryDate: '2024-08-29',
      status: 'confirmed',
      total: 2156.78,
      items: [
        { name: 'Designer Shingles - Aged Copper', quantity: 15, price: 125.99 }
      ]
    }
  ])

  const stats = {
    totalProducts: products.length,
    lowStockItems: products.filter(p => p.stock <= p.lowStockAlert).length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  }

  const updateOrderStatus = (orderId: string, newStatus: 'confirmed' | 'cancelled') => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const addProduct = () => {
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      brand: newProduct.brand,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      unit: newProduct.unit,
      lowStockAlert: parseInt(newProduct.lowStockAlert)
    }
    setProducts(prev => [...prev, product])
    setNewProduct({
      name: '',
      category: '',
      brand: '',
      price: '',
      stock: '',
      unit: '',
      lowStockAlert: '',
      description: ''
    })
    setIsAddProductOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'confirmed': return 'bg-blue-500'
      case 'delivered': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">MBS Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage inventory, orders, and customer accounts</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                      <p className="text-3xl font-bold text-red-600">{stats.lowStockItems}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 5).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.company}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {order.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  className="bg-red-600 text-white hover:bg-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Inventory Management</h2>

              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="mbs-red mbs-red-hover">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Add a new product to your inventory
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-name">Product Name</Label>
                        <Input
                          id="product-name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shingles">Shingles</SelectItem>
                          <SelectItem value="underlayment">Underlayment</SelectItem>
                          <SelectItem value="drip-edge">Drip Edge</SelectItem>
                          <SelectItem value="flashings">Flashings</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          placeholder="bundle, roll, ft"
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="low-stock">Low Stock Alert Level</Label>
                      <Input
                        id="low-stock"
                        type="number"
                        value={newProduct.lowStockAlert}
                        onChange={(e) => setNewProduct({...newProduct, lowStockAlert: e.target.value})}
                      />
                    </div>

                    <Button onClick={addProduct} className="w-full mbs-red mbs-red-hover">
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{product.category.replace('-', ' ')}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.stock} {product.unit}</p>
                            {product.stock <= product.lowStockAlert && (
                              <Badge className="bg-red-500 text-white text-xs">Low Stock</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>
                          <Badge className={product.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">Order Management</h2>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.company}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                            {order.deliveryDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {order.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  className="bg-red-500 text-white hover:bg-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {order.status === 'confirmed' && (
                              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                                <Truck className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <h2 className="text-2xl font-bold">Customer Management</h2>

            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Management</h3>
                <p className="text-gray-600">Customer management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  )
}
