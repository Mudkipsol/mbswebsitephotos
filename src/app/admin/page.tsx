'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Image as ImageIcon,
  CreditCard,
  PieChart,
  Calendar,
  Bell,
  Truck,
  Target,
  Mail,
  Lock,
  Upload,
  Download,
  FileSpreadsheet,
  ScanLine,
  Building2,
  TrendingDown,
  Activity
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Category {
  id: string;
  name: string;
  brands: Brand[];
}

interface Brand {
  id: string;
  name: string;
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  specifications: string;
  barcode?: string;
  lastUpdated?: string;
  updatedBy?: string;
}

interface Order {
  id: string;
  customerName: string;
  date: string;
  orderType: 'delivery' | 'willcall' | 'desk' | 'counter';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'preparing' | 'ready' | 'picked-up' | 'quote-requested' | 'quote-sent' | 'quote-approved' | 'quote-rejected' | 'ordered-from-supplier' | 'completed' | 'hold-for-pickup';
  total: number;
  items: { productName: string; quantity: number; price: number }[];
  branchLocation?: string; // For will call orders
  pickupDate?: string; // For will call orders
  contactName?: string;
  contactPhone?: string;
}

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  units: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  // Barcode scanning state
  const [scanMode, setScanMode] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');

  // Supplier portal state
  interface SupplierUpdate {
    id: string;
    supplier: string;
    product: string;
    type: string;
    oldValue: number;
    newValue: number;
    date: string;
    status: string;
  }
  const [supplierUpdates, setSupplierUpdates] = useState<SupplierUpdate[]>([]);

  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBrand, setEditingBrand] = useState<{ brand: Brand; categoryId: string } | null>(null);
  const [editingProduct, setEditingProduct] = useState<{ product: Product; brandId: string; categoryId: string } | null>(null);

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedCategoryForBrand, setSelectedCategoryForBrand] = useState<string>('');
  const [selectedBrandForProduct, setSelectedBrandForProduct] = useState<{ brandId: string; categoryId: string } | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('mbs-categories');
    const savedOrders = localStorage.getItem('mbs-orders');
    const savedReturns = localStorage.getItem('mbs-returns');
    const savedSalesData = localStorage.getItem('mbs-sales-data');
    const savedSupplierUpdates = localStorage.getItem('mbs-supplier-updates');

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Initialize with default data
      const defaultCategories: Category[] = [
        {
          id: '1',
          name: 'Shingles',
          brands: [
            {
              id: '1-1',
              name: 'Certainteed',
              products: [
                {
                  id: '1-1-1',
                  name: 'Certainteed Landmark',
                  sku: 'CTL-001',
                  price: 125.99,
                  stock: 450,
                  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
                  description: 'Premium architectural shingles with superior protection',
                  specifications: 'Class A fire rating, 130 mph wind warranty',
                  barcode: '123456789012',
                  lastUpdated: new Date().toISOString(),
                  updatedBy: 'Admin'
                },
                {
                  id: '1-1-2',
                  name: 'Certainteed Landmark Pro',
                  sku: 'CTLP-001',
                  price: 145.99,
                  stock: 325,
                  image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
                  description: 'Professional grade architectural shingles',
                  specifications: 'Class A fire rating, 150 mph wind warranty, Enhanced granule adhesion',
                  barcode: '123456789013',
                  lastUpdated: new Date().toISOString(),
                  updatedBy: 'Admin'
                }
              ]
            },
            {
              id: '1-2',
              name: 'Atlas',
              products: [
                {
                  id: '1-2-1',
                  name: 'Atlas ProLam',
                  sku: 'APL-001',
                  price: 115.99,
                  stock: 380,
                  image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
                  description: 'Durable laminated shingles for all climates',
                  specifications: 'Scotchgard protection, HP42 technology',
                  barcode: '123456789014',
                  lastUpdated: new Date().toISOString(),
                  updatedBy: 'Admin'
                },
                {
                  id: '1-2-2',
                  name: 'Atlas StormMaster',
                  sku: 'ASM-001',
                  price: 135.99,
                  stock: 275,
                  image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
                  description: 'Impact-resistant shingles for severe weather',
                  specifications: 'Class 4 impact rating, SBS modified asphalt',
                  barcode: '123456789015',
                  lastUpdated: new Date().toISOString(),
                  updatedBy: 'Admin'
                }
              ]
            }
          ]
        },
        {
          id: '2',
          name: 'Siding',
          brands: [
            {
              id: '2-1',
              name: 'James Hardie',
              products: [
                {
                  id: '2-1-1',
                  name: 'HardiePlank Lap Siding',
                  sku: 'JH-001',
                  price: 8.50,
                  stock: 1200,
                  image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
                  description: 'Fiber cement lap siding',
                  specifications: '5/16" thickness, ColorPlus Technology',
                  barcode: '123456789016',
                  lastUpdated: new Date().toISOString(),
                  updatedBy: 'Admin'
                }
              ]
            }
          ]
        }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('mbs-categories', JSON.stringify(defaultCategories));
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Initialize with sample orders including will call
      const sampleOrders: Order[] = [
        {
          id: 'ORD-001',
          customerName: 'ABC Roofing Co.',
          date: '2024-01-15',
          orderType: 'delivery',
          status: 'delivered',
          total: 5679.55,
          items: [
            { productName: 'Certainteed Landmark', quantity: 45, price: 125.99 }
          ],
          contactName: 'John Smith',
          contactPhone: '(555) 123-4567'
        },
        {
          id: 'ORD-002',
          customerName: 'XYZ Construction',
          date: '2024-01-16',
          orderType: 'delivery',
          status: 'processing',
          total: 3477.72,
          items: [
            { productName: 'Atlas ProLam', quantity: 30, price: 115.99 }
          ],
          contactName: 'Mike Johnson',
          contactPhone: '(555) 234-5678'
        },
        {
          id: 'WC-001',
          customerName: 'Summit Contractors',
          date: '2024-01-17',
          orderType: 'willcall',
          status: 'ready',
          total: 1289.97,
          items: [
            { productName: 'Certainteed Landmark Pro', quantity: 10, price: 145.99 },
            { productName: 'Synthetic Underlayment', quantity: 3, price: 89.99 }
          ],
          branchLocation: 'youngstown',
          pickupDate: '2024-01-18',
          contactName: 'Sarah Williams',
          contactPhone: '(555) 345-6789'
        },
        {
          id: 'WC-002',
          customerName: 'Valley Roofing',
          date: '2024-01-16',
          orderType: 'willcall',
          status: 'preparing',
          total: 567.94,
          items: [
            { productName: 'Atlas ProLam', quantity: 5, price: 115.99 }
          ],
          branchLocation: 'akron',
          pickupDate: '2024-01-19',
          contactName: 'Dave Brown',
          contactPhone: '(555) 456-7890'
        },
        {
          id: 'ORD-003',
          customerName: 'Premium Builders',
          date: '2024-01-14',
          orderType: 'delivery',
          status: 'returned',
          total: 437.97,
          items: [
            { productName: 'Certainteed Landmark Pro', quantity: 3, price: 145.99 }
          ],
          contactName: 'Tom Davis',
          contactPhone: '(555) 567-8901'
        },
        {
          id: 'DESK-001',
          customerName: 'Elite Construction',
          date: '2024-01-18',
          orderType: 'desk',
          status: 'quote-requested',
          total: 0, // Quote pending
          items: [
            { productName: 'Custom Metal Roofing - Standing Seam', quantity: 50, price: 0 },
            { productName: 'Specialty Gutters - 7" K-Style', quantity: 200, price: 0 }
          ],
          contactName: 'Maria Rodriguez',
          contactPhone: '(555) 678-9012'
        },
        {
          id: 'DESK-002',
          customerName: 'Heritage Restoration',
          date: '2024-01-17',
          orderType: 'desk',
          status: 'quote-sent',
          total: 2847.50,
          items: [
            { productName: 'Historical Clay Tiles - Mission Style', quantity: 30, price: 94.92 }
          ],
          contactName: 'Robert Chen',
          contactPhone: '(555) 789-0123'
        },
        {
          id: 'CTR-001',
          customerName: 'Mike Johnson (Walk-in)',
          date: '2024-01-18',
          orderType: 'counter',
          status: 'completed',
          total: 267.47,
          items: [
            { productName: 'Roofing Nails - 1.25"', quantity: 2, price: 89.99 },
            { productName: 'Roof Cement - 10.3oz', quantity: 5, price: 8.99 }
          ],
          contactName: 'Mike Johnson',
          contactPhone: '(555) 890-1234'
        },
        {
          id: 'CTR-002',
          customerName: 'Sarah Williams (Account)',
          date: '2024-01-18',
          orderType: 'counter',
          status: 'hold-for-pickup',
          total: 145.99,
          items: [
            { productName: 'Step Flashing - Aluminum', quantity: 50, price: 2.85 }
          ],
          contactName: 'Sarah Williams',
          contactPhone: '(555) 901-2345'
        }
      ];
      setOrders(sampleOrders);
      localStorage.setItem('mbs-orders', JSON.stringify(sampleOrders));
    }

    if (savedSalesData) {
      setSalesData(JSON.parse(savedSalesData));
    } else {
      // Generate sample sales data for the last 7 days
      const sampleSalesData: SalesData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        sampleSalesData.push({
          date: date.toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 10000) + 5000,
          orders: Math.floor(Math.random() * 20) + 10,
          units: Math.floor(Math.random() * 100) + 50
        });
      }
      setSalesData(sampleSalesData);
      localStorage.setItem('mbs-sales-data', JSON.stringify(sampleSalesData));
    }

    if (savedSupplierUpdates) {
      setSupplierUpdates(JSON.parse(savedSupplierUpdates));
    } else {
      // Sample supplier updates
      const sampleUpdates = [
        {
          id: '1',
          supplier: 'Certainteed',
          product: 'Landmark Pro',
          type: 'price',
          oldValue: 145.99,
          newValue: 149.99,
          date: new Date().toISOString(),
          status: 'pending'
        },
        {
          id: '2',
          supplier: 'Atlas',
          product: 'ProLam',
          type: 'stock',
          oldValue: 380,
          newValue: 450,
          date: new Date().toISOString(),
          status: 'approved'
        }
      ];
      setSupplierUpdates(sampleUpdates);
      localStorage.setItem('mbs-supplier-updates', JSON.stringify(sampleUpdates));
    }

    if (savedReturns) {
      setReturns(parseInt(savedReturns));
    } else {
      setReturns(3);
      localStorage.setItem('mbs-returns', '3');
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('mbs-categories', JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('mbs-orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mbs-returns', returns.toString());
  }, [returns]);

  useEffect(() => {
    if (salesData.length > 0) {
      localStorage.setItem('mbs-sales-data', JSON.stringify(salesData));
    }
  }, [salesData]);

  useEffect(() => {
    if (supplierUpdates.length > 0) {
      localStorage.setItem('mbs-supplier-updates', JSON.stringify(supplierUpdates));
    }
  }, [supplierUpdates]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'MBS2024admin') {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Invalid password. Please try again.');
    }
  };

  // Export products to CSV
  const exportToCSV = () => {
    const csvData: (string | number)[][] = [];
    csvData.push(['Category', 'Brand', 'Product Name', 'SKU', 'Price', 'Stock', 'Barcode', 'Description', 'Specifications']);

    categories.forEach(category => {
      category.brands.forEach(brand => {
        brand.products.forEach(product => {
          csvData.push([
            category.name,
            brand.name,
            product.name,
            product.sku,
            product.price,
            product.stock,
            product.barcode || '',
            product.description,
            product.specifications
          ]);
        });
      });
    });

    const csv = csvData.map(row => row.map((cell: string | number) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mbs-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Import products from CSV
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

      // Parse CSV and update categories
      interface ImportedRow {
        [key: string]: string;
      }
      const importedData: ImportedRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
          const row: ImportedRow = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
          importedData.push(row);
        }
      }

      // Process imported data and update categories
      // This is a simplified version - you'd want more robust error handling
      alert(`Successfully imported ${importedData.length} products!`);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Barcode scanning simulation
  const handleBarcodeScanning = () => {
    // Simulate barcode scanning
    const mockBarcode = '123456789' + Math.floor(Math.random() * 1000);
    setScannedBarcode(mockBarcode);

    // Find product by barcode
    let foundProduct: Product | null = null;
    let foundBrand: Brand | null = null;
    let foundCategory: Category | null = null;

    categories.forEach(category => {
      category.brands.forEach(brand => {
        brand.products.forEach(product => {
          if (product.barcode === mockBarcode) {
            foundProduct = product;
            foundBrand = brand;
            foundCategory = category;
          }
        });
      });
    });

    if (foundProduct && foundCategory && foundBrand) {
      alert(`Product found: ${(foundProduct as Product).name} (${(foundCategory as Category).name} > ${(foundBrand as Brand).name})`);
    } else {
      alert(`No product found with barcode: ${mockBarcode}`);
    }
  };

  // Calculate sales metrics
  const getTotalRevenue = () => {
    return salesData.reduce((sum, day) => sum + day.revenue, 0);
  };

  const getTotalOrders = () => {
    return salesData.reduce((sum, day) => sum + day.orders, 0);
  };

  const getAverageOrderValue = () => {
    const totalOrders = getTotalOrders();
    return totalOrders > 0 ? getTotalRevenue() / totalOrders : 0;
  };

  const getRevenueGrowth = () => {
    if (salesData.length < 2) return 0;
    const lastDay = salesData[salesData.length - 1].revenue;
    const previousDay = salesData[salesData.length - 2].revenue;
    return previousDay > 0 ? ((lastDay - previousDay) / previousDay) * 100 : 0;
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleBrand = (brandId: string) => {
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(brandId)) {
      newExpanded.delete(brandId);
    } else {
      newExpanded.add(brandId);
    }
    setExpandedBrands(newExpanded);
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      brands: []
    };
    setCategories([...categories, newCategory]);
    setCategoryDialogOpen(false);
  };

  const updateCategory = (categoryId: string, name: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId ? { ...cat, name } : cat
    ));
    setEditingCategory(null);
  };

  const deleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category and all its contents?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  const addBrand = (categoryId: string, brandName: string) => {
    const newBrand: Brand = {
      id: `${categoryId}-${Date.now()}`,
      name: brandName,
      products: []
    };

    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, brands: [...cat.brands, newBrand] }
        : cat
    ));
    setBrandDialogOpen(false);
    setSelectedCategoryForBrand('');
  };

  const updateBrand = (categoryId: string, brandId: string, name: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            brands: cat.brands.map(brand =>
              brand.id === brandId ? { ...brand, name } : brand
            )
          }
        : cat
    ));
    setEditingBrand(null);
  };

  const deleteBrand = (categoryId: string, brandId: string) => {
    if (confirm('Are you sure you want to delete this brand and all its products?')) {
      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, brands: cat.brands.filter(brand => brand.id !== brandId) }
          : cat
      ));
    }
  };

  const addProduct = (categoryId: string, brandId: string, product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `${brandId}-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Admin'
    };

    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            brands: cat.brands.map(brand =>
              brand.id === brandId
                ? { ...brand, products: [...brand.products, newProduct] }
                : brand
            )
          }
        : cat
    ));
    setProductDialogOpen(false);
    setSelectedBrandForProduct(null);
  };

  const updateProduct = (categoryId: string, brandId: string, productId: string, product: Omit<Product, 'id'>) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            brands: cat.brands.map(brand =>
              brand.id === brandId
                ? {
                    ...brand,
                    products: brand.products.map(p =>
                      p.id === productId ? {
                        ...product,
                        id: productId,
                        lastUpdated: new Date().toISOString(),
                        updatedBy: 'Admin'
                      } : p
                    )
                  }
                : brand
            )
          }
        : cat
    ));
    setEditingProduct(null);
  };

  const deleteProduct = (categoryId: string, brandId: string, productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              brands: cat.brands.map(brand =>
                brand.id === brandId
                  ? { ...brand, products: brand.products.filter(p => p.id !== productId) }
                  : brand
              )
            }
          : cat
      ));
    }
  };

  const getTotalInventoryValue = () => {
    return categories.reduce((total, category) =>
      total + category.brands.reduce((brandTotal, brand) =>
        brandTotal + brand.products.reduce((productTotal, product) =>
          productTotal + (product.price * product.stock), 0
        ), 0
      ), 0
    );
  };

  const getTotalProducts = () => {
    return categories.reduce((total, category) =>
      total + category.brands.reduce((brandTotal, brand) =>
        brandTotal + brand.products.length, 0
      ), 0
    );
  };

  const getTotalStock = () => {
    return categories.reduce((total, category) =>
      total + category.brands.reduce((brandTotal, brand) =>
        brandTotal + brand.products.reduce((productTotal, product) =>
          productTotal + product.stock, 0
        ), 0
      ), 0
    );
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status).length;
  };

  const handleSupplierUpdate = (updateId: string, action: 'approve' | 'reject') => {
    const update = supplierUpdates.find(u => u.id === updateId);
    if (!update) return;

    if (action === 'approve') {
      // Apply the update to the product
      categories.forEach(category => {
        category.brands.forEach(brand => {
          brand.products.forEach(product => {
            if (product.name === update.product) {
              if (update.type === 'price') {
                product.price = update.newValue;
              } else if (update.type === 'stock') {
                product.stock = update.newValue;
              }
              product.lastUpdated = new Date().toISOString();
              product.updatedBy = update.supplier;
            }
          });
        });
      });
      setCategories([...categories]);
    }

    // Update the status
    setSupplierUpdates(supplierUpdates.map(u =>
      u.id === updateId ? { ...u, status: action === 'approve' ? 'approved' : 'rejected' } : u
    ));
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Admin Access Required
              </CardTitle>
              <CardDescription>
                Enter the administrator password to access the full management dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Admin Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Access Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">MBS Admin Dashboard</h1>
            <p className="text-gray-600">Complete inventory and order management system</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Total Inventory Value
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${getTotalInventoryValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-gray-500 mt-1">{getTotalStock()} units in stock</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Active Orders
                  <ShoppingCart className="h-4 w-4 text-gray-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getOrdersByStatus('processing') + getOrdersByStatus('pending')}</div>
                <p className="text-xs text-gray-500 mt-1">{getOrdersByStatus('shipped')} shipped</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Returns Counter
                  <RotateCcw className="h-4 w-4 text-gray-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{returns}</div>
                <p className="text-xs text-gray-500 mt-1">Items returned this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Total Products
                  <Package className="h-4 w-4 text-gray-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalProducts()}</div>
                <p className="text-xs text-gray-500 mt-1">Across {categories.length} categories</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="categories" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 text-xs">
              <TabsTrigger value="categories">Products</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="willcall">Will Call</TabsTrigger>
              <TabsTrigger value="counter">Counter</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Product Categories Management
                    <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          addCategory(formData.get('name') as string);
                        }} className="space-y-4">
                          <div>
                            <Label htmlFor="category-name">Category Name</Label>
                            <Input id="category-name" name="name" required />
                          </div>
                          <Button type="submit" className="w-full">Add Category</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="border rounded-lg">
                        <div className="p-3 bg-gray-50 flex items-center justify-between">
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="flex items-center gap-2 flex-1 text-left hover:text-blue-600"
                          >
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span className="font-semibold">{category.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({category.brands.length} brands)
                            </span>
                          </button>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedCategoryForBrand(category.id);
                                setBrandDialogOpen(true);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingCategory(category)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {expandedCategories.has(category.id) && (
                          <div className="p-3 space-y-2">
                            {category.brands.map((brand) => (
                              <div key={brand.id} className="ml-4 border-l-2 border-gray-200 pl-4">
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => toggleBrand(brand.id)}
                                    className="flex items-center gap-2 flex-1 text-left hover:text-blue-600"
                                  >
                                    {expandedBrands.has(brand.id) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                    <span className="font-medium">{brand.name}</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                      ({brand.products.length} products)
                                    </span>
                                  </button>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedBrandForProduct({ brandId: brand.id, categoryId: category.id });
                                        setProductDialogOpen(true);
                                      }}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingBrand({ brand, categoryId: category.id })}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteBrand(category.id, brand.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {expandedBrands.has(brand.id) && (
                                  <div className="mt-2 space-y-2">
                                    {brand.products.map((product) => (
                                      <div key={product.id} className="ml-4 p-2 bg-white rounded border flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-12 w-12 object-cover rounded"
                                          />
                                          <div>
                                            <div className="font-medium">{product.name}</div>
                                            <div className="text-sm text-gray-500">
                                              SKU: {product.sku} | Stock: {product.stock} | ${product.price}
                                            </div>
                                            {product.barcode && (
                                              <div className="text-xs text-gray-400">
                                                Barcode: {product.barcode}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                              const newImageUrl = prompt('Enter new image URL:', product.image);
                                              if (newImageUrl && newImageUrl !== product.image) {
                                                updateProduct(category.id, brand.id, product.id, {
                                                  ...product,
                                                  image: newImageUrl
                                                });
                                              }
                                            }}
                                            title="Quick Edit Image"
                                          >
                                            <ImageIcon className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setEditingProduct({ product, brandId: brand.id, categoryId: category.id })}
                                            title="Edit Product"
                                          >
                                            <Edit2 className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => deleteProduct(category.id, brand.id, product.id)}
                                            title="Delete Product"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="import-export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Import/Export</CardTitle>
                  <CardDescription>Import or export your product catalog in CSV format</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Upload className="h-5 w-5" />
                          Import Products
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          Upload a CSV file with product data to bulk import into your catalog
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv"
                          onChange={handleFileImport}
                          className="hidden"
                        />
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Choose CSV File
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Download className="h-5 w-5" />
                          Export Products
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          Download your entire product catalog as a CSV file
                        </p>
                        <Button onClick={exportToCSV} className="w-full">
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Export to CSV
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      CSV format: Category, Brand, Product Name, SKU, Price, Stock, Barcode, Description, Specifications
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="barcode" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Barcode Scanner</CardTitle>
                  <CardDescription>Scan product barcodes for quick inventory management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ScanLine className="h-5 w-5" />
                          Scanner Controls
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button
                          onClick={() => setScanMode(!scanMode)}
                          className={`w-full ${scanMode ? 'bg-red-600 hover:bg-red-700' : ''}`}
                        >
                          {scanMode ? 'Stop Scanning' : 'Start Scanning'}
                        </Button>

                        {scanMode && (
                          <div className="p-4 border-2 border-dashed border-gray-300 rounded text-center">
                            <ScanLine className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">Scanner Active</p>
                            <p className="text-xs text-gray-500 mt-1">Point scanner at barcode</p>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="manual-barcode">Manual Entry</Label>
                          <Input
                            id="manual-barcode"
                            placeholder="Enter barcode manually"
                            value={scannedBarcode}
                            onChange={(e) => setScannedBarcode(e.target.value)}
                          />
                        </div>

                        <Button onClick={handleBarcodeScanning} variant="outline" className="w-full">
                          Simulate Scan
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Scans</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="font-medium">Certainteed Landmark</div>
                            <div className="text-sm text-gray-500">Barcode: 123456789012</div>
                            <div className="text-sm text-gray-500">Scanned: 2 minutes ago</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="font-medium">Atlas ProLam</div>
                            <div className="text-sm text-gray-500">Barcode: 123456789014</div>
                            <div className="text-sm text-gray-500">Scanned: 15 minutes ago</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="supplier" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Portal Updates</CardTitle>
                  <CardDescription>Review and approve supplier-submitted product updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {supplierUpdates.map((update) => (
                      <Card key={update.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                {update.supplier}
                              </CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {new Date(update.date).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs ${
                              update.status === 'approved' ? 'bg-green-100 text-green-700' :
                              update.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {update.status}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Product:</span> {update.product}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Update Type:</span> {update.type}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Change:</span> {update.oldValue} → {update.newValue}
                            </div>
                            {update.status === 'pending' && (
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => handleSupplierUpdate(update.id, 'approve')}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSupplierUpdate(update.id, 'reject')}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics Dashboard</CardTitle>
                  <CardDescription>Monitor sales performance and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          Total Revenue
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ${getTotalRevenue().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          +{getRevenueGrowth().toFixed(1)}% from yesterday
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          Total Orders
                          <Activity className="h-4 w-4 text-blue-500" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{getTotalOrders()}</div>
                        <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          Avg Order Value
                          <DollarSign className="h-4 w-4 text-purple-500" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ${getAverageOrderValue().toFixed(2)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Per transaction</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          Return Rate
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {((returns / orders.length) * 100).toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{returns} returns</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Revenue Trend (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {salesData.map((day) => (
                          <div key={day.date} className="flex items-center gap-4">
                            <div className="w-24 text-sm text-gray-600">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                            <div className="flex-1">
                              <div className="h-8 bg-gray-200 rounded relative">
                                <div
                                  className="h-full bg-blue-600 rounded"
                                  style={{ width: `${(day.revenue / Math.max(...salesData.map(d => d.revenue))) * 100}%` }}
                                />
                              </div>
                            </div>
                            <div className="w-20 text-right text-sm font-medium">
                              ${day.revenue.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Top Performing Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">Certainteed Landmark</div>
                            <div className="text-sm text-gray-500">245 units sold</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">$30,867.55</div>
                            <div className="text-xs text-green-600">+12% vs last week</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">Atlas ProLam</div>
                            <div className="text-sm text-gray-500">198 units sold</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">$22,966.02</div>
                            <div className="text-xs text-green-600">+8% vs last week</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">HardiePlank Lap Siding</div>
                            <div className="text-sm text-gray-500">1,450 units sold</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">$12,325.00</div>
                            <div className="text-xs text-red-600">-3% vs last week</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>Manage delivery orders, will call pickups, desk orders, and counter sales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-semibold">{order.id}</div>
                              <div className={`text-xs px-2 py-1 rounded ${
                                order.orderType === 'delivery' ? 'bg-blue-100 text-blue-700' :
                                order.orderType === 'willcall' ? 'bg-green-100 text-green-700' :
                                order.orderType === 'desk' ? 'bg-purple-100 text-purple-700' :
                                order.orderType === 'counter' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {order.orderType === 'willcall' ? 'WILL CALL' :
                                 order.orderType === 'counter' ? 'COUNTER SALE' :
                                 order.orderType.toUpperCase()}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.date}</div>
                            {order.orderType === 'willcall' && (
                              <div className="text-sm text-gray-500">
                                Pickup: {order.pickupDate} at {order.branchLocation?.toUpperCase()}
                              </div>
                            )}
                            {order.contactName && (
                              <div className="text-sm text-gray-500">
                                Contact: {order.contactName} - {order.contactPhone}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${order.total.toFixed(2)}</div>
                            <div className={`text-sm px-2 py-1 rounded inline-block ${
                              order.status === 'delivered' || order.status === 'picked-up' || order.status === 'quote-approved' || order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'processing' || order.status === 'preparing' || order.status === 'ordered-from-supplier' ? 'bg-yellow-100 text-yellow-700' :
                              order.status === 'ready' || order.status === 'hold-for-pickup' ? 'bg-green-100 text-green-700' :
                              order.status === 'quote-requested' || order.status === 'quote-sent' ? 'bg-purple-100 text-purple-700' :
                              order.status === 'quote-rejected' ? 'bg-red-100 text-red-700' :
                              order.status === 'returned' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status === 'preparing' ? 'PREPARING' :
                               order.status === 'ready' ? 'READY FOR PICKUP' :
                               order.status === 'picked-up' ? 'PICKED UP' :
                               order.status === 'quote-requested' ? 'QUOTE REQUESTED' :
                               order.status === 'quote-sent' ? 'QUOTE SENT' :
                               order.status === 'quote-approved' ? 'QUOTE APPROVED' :
                               order.status === 'quote-rejected' ? 'QUOTE REJECTED' :
                               order.status === 'ordered-from-supplier' ? 'ORDERED FROM SUPPLIER' :
                               order.status === 'completed' ? 'COMPLETED' :
                               order.status === 'hold-for-pickup' ? 'HOLD FOR PICKUP' :
                               order.status.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.items.map((item, idx) => (
                            <div key={idx}>
                              {item.quantity}x {item.productName} @ ${item.price}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => {
                              const newOrders = orders.map(o =>
                                o.id === order.id ? { ...o, status: value as Order['status'] } : o
                              );
                              setOrders(newOrders);

                              // Update returns counter if status changes to returned
                              if (value === 'returned' && order.status !== 'returned') {
                                setReturns(returns + 1);
                              } else if (value !== 'returned' && order.status === 'returned') {
                                setReturns(Math.max(0, returns - 1));
                              }
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              {order.orderType === 'delivery' ? (
                                <>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                </>
                              ) : order.orderType === 'willcall' ? (
                                <>
                                  <SelectItem value="preparing">Preparing</SelectItem>
                                  <SelectItem value="ready">Ready for Pickup</SelectItem>
                                  <SelectItem value="picked-up">Picked Up</SelectItem>
                                </>
                              ) : order.orderType === 'desk' ? (
                                <>
                                  <SelectItem value="quote-requested">Quote Requested</SelectItem>
                                  <SelectItem value="quote-sent">Quote Sent</SelectItem>
                                  <SelectItem value="quote-approved">Quote Approved</SelectItem>
                                  <SelectItem value="quote-rejected">Quote Rejected</SelectItem>
                                  <SelectItem value="ordered-from-supplier">Ordered from Supplier</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="ready">Ready</SelectItem>
                                </>
                              ) : order.orderType === 'counter' ? (
                                <>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="hold-for-pickup">Hold for Pickup</SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="ready">Ready</SelectItem>
                                </>
                              )}
                              <SelectItem value="returned">Returned</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="willcall" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Will Call Pickup Queue</CardTitle>
                  <CardDescription>Manage customer pickup orders and queue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Queue Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Orders Preparing</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-yellow-600">
                            {orders.filter(o => o.orderType === 'willcall' && o.status === 'preparing').length}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Ready for Pickup</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {orders.filter(o => o.orderType === 'willcall' && o.status === 'ready').length}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Today's Pickups</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">
                            {orders.filter(o =>
                              o.orderType === 'willcall' &&
                              o.pickupDate === new Date().toISOString().split('T')[0]
                            ).length}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Completed Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-gray-600">
                            {orders.filter(o =>
                              o.orderType === 'willcall' &&
                              o.status === 'picked-up' &&
                              o.date === new Date().toISOString().split('T')[0]
                            ).length}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Will Call Orders List */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Active Will Call Orders</h3>
                      {orders
                        .filter(order => order.orderType === 'willcall' && order.status !== 'picked-up')
                        .sort((a, b) => {
                          // Sort by status priority and then by pickup date
                          const statusPriority: Record<string, number> = {
                            'ready': 1,
                            'preparing': 2,
                            'pending': 3,
                            'processing': 4,
                            'shipped': 5,
                            'delivered': 6,
                            'returned': 7,
                            'picked-up': 8
                          };
                          const aPriority = statusPriority[a.status] || 9;
                          const bPriority = statusPriority[b.status] || 9;
                          if (aPriority !== bPriority) {
                            return aPriority - bPriority;
                          }
                          return new Date(a.pickupDate || '').getTime() - new Date(b.pickupDate || '').getTime();
                        })
                        .map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="font-semibold text-lg">{order.id}</div>
                                  <div className={`text-xs px-2 py-1 rounded font-medium ${
                                    order.status === 'ready' ? 'bg-green-100 text-green-700' :
                                    order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {order.status === 'ready' ? 'READY FOR PICKUP' :
                                     order.status === 'preparing' ? 'PREPARING' :
                                     order.status.toUpperCase()}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600">{order.customerName}</div>
                                <div className="text-sm text-gray-500">
                                  Pickup: {order.pickupDate} at {order.branchLocation?.toUpperCase()} Branch
                                </div>
                                <div className="text-sm text-gray-500">
                                  Contact: {order.contactName} - {order.contactPhone}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-lg">${order.total.toFixed(2)}</div>
                                <div className="text-sm text-gray-500">
                                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                                </div>
                              </div>
                            </div>

                            <div className="text-sm text-gray-600 mb-3">
                              <strong>Items:</strong>
                              {order.items.map((item, idx) => (
                                <div key={idx} className="ml-2">
                                  • {item.quantity}x {item.productName} @ ${item.price}
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              {order.status === 'preparing' && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const newOrders = orders.map(o =>
                                      o.id === order.id ? { ...o, status: 'ready' as const } : o
                                    );
                                    setOrders(newOrders);
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Mark Ready for Pickup
                                </Button>
                              )}

                              {order.status === 'ready' && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const newOrders = orders.map(o =>
                                      o.id === order.id ? { ...o, status: 'picked-up' as const } : o
                                    );
                                    setOrders(newOrders);
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Complete Pickup
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // In a real app, this would send notification
                                  alert(`Pickup notification sent to ${order.contactName} at ${order.contactPhone}`);
                                }}
                              >
                                Notify Customer
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="counter" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Counter Sales Management</CardTitle>
                  <CardDescription>Manage walk-in counter sales and immediate pickup orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Counter Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Today's Counter Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {orders.filter(o =>
                              o.orderType === 'counter' &&
                              o.date === new Date().toISOString().split('T')[0]
                            ).length}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Completed Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">
                            {orders.filter(o => o.orderType === 'counter' && o.status === 'completed').length}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Hold for Pickup</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-yellow-600">
                            {orders.filter(o => o.orderType === 'counter' && o.status === 'hold-for-pickup').length}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Today's Counter Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            $
                            {orders
                              .filter(o =>
                                o.orderType === 'counter' &&
                                o.status === 'completed' &&
                                o.date === new Date().toISOString().split('T')[0]
                              )
                              .reduce((sum, order) => sum + order.total, 0)
                              .toFixed(2)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Counter Orders List */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Active Counter Orders</h3>
                      {orders
                        .filter(order => order.orderType === 'counter')
                        .sort((a, b) => {
                          // Sort by status priority and then by date
                          const statusPriority: Record<string, number> = {
                            'hold-for-pickup': 1,
                            'processing': 2,
                            'completed': 3,
                            'returned': 4
                          };
                          const aPriority = statusPriority[a.status] || 5;
                          const bPriority = statusPriority[b.status] || 5;
                          if (aPriority !== bPriority) {
                            return aPriority - bPriority;
                          }
                          return new Date(b.date).getTime() - new Date(a.date).getTime();
                        })
                        .map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="font-semibold text-lg">{order.id}</div>
                                  <div className={`text-xs px-2 py-1 rounded font-medium ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    order.status === 'hold-for-pickup' ? 'bg-yellow-100 text-yellow-700' :
                                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {order.status === 'completed' ? 'COMPLETED' :
                                     order.status === 'hold-for-pickup' ? 'HOLD FOR PICKUP' :
                                     order.status === 'processing' ? 'PROCESSING' :
                                     order.status.toUpperCase()}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600">{order.customerName}</div>
                                <div className="text-sm text-gray-500">
                                  Sale Date: {order.date}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Contact: {order.contactName} - {order.contactPhone}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-lg">${order.total.toFixed(2)}</div>
                                <div className="text-sm text-gray-500">
                                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                                </div>
                              </div>
                            </div>

                            <div className="text-sm text-gray-600 mb-3">
                              <strong>Items:</strong>
                              {order.items.map((item, idx) => (
                                <div key={idx} className="ml-2">
                                  • {item.quantity}x {item.productName} @ ${item.price}
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              {order.status === 'processing' && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const newOrders = orders.map(o =>
                                      o.id === order.id ? { ...o, status: 'completed' as const } : o
                                    );
                                    setOrders(newOrders);
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Complete Sale
                                </Button>
                              )}

                              {order.status === 'hold-for-pickup' && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const newOrders = orders.map(o =>
                                      o.id === order.id ? { ...o, status: 'completed' as const } : o
                                    );
                                    setOrders(newOrders);
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Customer Picked Up
                                </Button>
                              )}

                              {order.status === 'completed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    alert('Receipt reprinted for order ' + order.id);
                                  }}
                                >
                                  Reprint Receipt
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // In a real app, this would open point-of-sale interface
                                  alert(`Opening POS interface for customer: ${order.contactName}`);
                                }}
                              >
                                Open POS
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-lg mb-4">Counter Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            alert('Opening new counter sale interface...');
                          }}
                        >
                          New Counter Sale
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => {
                            alert('Opening cash register interface...');
                          }}
                        >
                          Cash Register
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => {
                            alert('Opening daily sales report...');
                          }}
                        >
                          Daily Sales Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="returns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Returns Management</CardTitle>
                  <CardDescription>Track and manage product returns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Current return rate: {((returns / orders.length) * 100).toFixed(1)}% ({returns} returns out of {orders.length} orders)
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Monthly Returns</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-red-600">{returns}</div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => setReturns(0)}
                          >
                            Reset Counter
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Return Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">
                            ${orders.filter(o => o.status === 'returned')
                              .reduce((total, order) => total + order.total, 0)
                              .toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Total value of returned orders
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Returned Orders</h3>
                      {orders.filter(o => o.status === 'returned').map((order) => (
                        <div key={order.id} className="border rounded p-3">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">{order.id}</div>
                              <div className="text-sm text-gray-600">{order.customerName}</div>
                              <div className="text-sm text-gray-500">{order.date}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${order.total.toFixed(2)}</div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newOrders = orders.map(o =>
                                    o.id === order.id ? { ...o, status: 'processing' as const } : o
                                  );
                                  setOrders(newOrders);
                                  setReturns(Math.max(0, returns - 1));
                                }}
                              >
                                Process Return
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* === NEW ADMIN PRO FEATURES === */}

            {/* Customer Credit Management */}
            <TabsContent value="customers" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Customer Credit Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">ABC Roofing LLC</p>
                          <p className="text-sm text-gray-600">Credit Limit: $25,000</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">$18,500 Available</p>
                          <p className="text-sm text-gray-600">$6,500 Used</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Premier Construction</p>
                          <p className="text-sm text-gray-600">Credit Limit: $50,000</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-yellow-600">$5,200 Available</p>
                          <p className="text-sm text-gray-600">$44,800 Used</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Sunshine Roofing</p>
                          <p className="text-sm text-gray-600">Credit Limit: $15,000</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">$0 Available</p>
                          <p className="text-sm text-gray-600">$15,000 Used - OVERLIMIT</p>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">Manage Customer Credit</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Credit Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded">
                        <p className="font-medium">Elite Contractors Inc.</p>
                        <p className="text-sm text-gray-600">Requested: $30,000 | Applied: 2 days ago</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" className="bg-green-600">Approve</Button>
                          <Button size="sm" variant="outline">Review</Button>
                        </div>
                      </div>
                      <div className="p-3 border rounded">
                        <p className="font-medium">Metro Roofing Solutions</p>
                        <p className="text-sm text-gray-600">Requested: $20,000 | Applied: 5 days ago</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" className="bg-green-600">Approve</Button>
                          <Button size="sm" variant="outline">Review</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sales Analytics */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Top Products (30 Days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Architectural Shingles</span>
                        <span className="font-medium">$89,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Ice & Water Shield</span>
                        <span className="font-medium">$45,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Underlayment</span>
                        <span className="font-medium">$32,100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Ridge Vents</span>
                        <span className="font-medium">$18,900</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Top Customers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">ABC Roofing LLC</span>
                        <span className="font-medium">$125,400</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Premier Construction</span>
                        <span className="font-medium">$98,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Elite Contractors</span>
                        <span className="font-medium">$76,800</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Metro Roofing</span>
                        <span className="font-medium">$54,300</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Profit Margins
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Shingles</span>
                        <span className="font-medium text-green-600">34%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Underlayment</span>
                        <span className="font-medium text-green-600">42%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Ice & Water</span>
                        <span className="font-medium text-yellow-600">28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Metal Roofing</span>
                        <span className="font-medium text-red-600">18%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Inventory Forecasting */}
            <TabsContent value="forecasting" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Inventory Forecasting & Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Products Running Low</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <p className="font-medium text-red-800">Architectural Shingles - Charcoal</p>
                          <p className="text-sm text-red-600">Current: 25 bundles | Will run out in 8 days</p>
                          <p className="text-xs text-red-500">Recommended reorder: 200 bundles</p>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="font-medium text-yellow-800">Ice & Water Shield</p>
                          <p className="text-sm text-yellow-600">Current: 75 rolls | Will run out in 2 weeks</p>
                          <p className="text-xs text-yellow-500">Recommended reorder: 150 rolls</p>
                        </div>
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                          <p className="font-medium text-orange-800">Synthetic Underlayment</p>
                          <p className="text-sm text-orange-600">Current: 120 rolls | Will run out in 3 weeks</p>
                          <p className="text-xs text-orange-500">Recommended reorder: 100 rolls</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Seasonal Demand Forecast</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded">
                          <p className="font-medium">Spring Season (Mar-May)</p>
                          <p className="text-sm text-gray-600">Expected 40% increase in shingle demand</p>
                          <p className="text-xs text-blue-600">Suggested inventory boost: +60%</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded">
                          <p className="font-medium">Summer Peak (Jun-Aug)</p>
                          <p className="text-sm text-gray-600">Peak season - all categories high demand</p>
                          <p className="text-xs text-green-600">Stock levels: Optimal</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded">
                          <p className="font-medium">Fall Rush (Sep-Nov)</p>
                          <p className="text-sm text-gray-600">Pre-winter repairs spike expected</p>
                          <p className="text-xs text-purple-600">Focus: Ice & water protection products</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom Pricing */}
            <TabsContent value="pricing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Custom Contractor Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Pricing Tiers</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Tier 1 - Premium Contractors</span>
                            <span className="bg-gold text-black px-2 py-1 rounded text-xs">25% Discount</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">ABC Roofing, Premier Construction</p>
                        </div>
                        <div className="p-3 border rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Tier 2 - Regular Contractors</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">15% Discount</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Elite Contractors, Metro Roofing</p>
                        </div>
                        <div className="p-3 border rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Tier 3 - Standard Contractors</span>
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">10% Discount</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Sunshine Roofing, City Builders</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Special Product Pricing</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded">
                          <p className="font-medium">Volume Discounts Active</p>
                          <p className="text-sm text-gray-600">Shingles: 50+ bundles = Extra 5% off</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded">
                          <p className="font-medium">Seasonal Promotions</p>
                          <p className="text-sm text-gray-600">Underlayment: Spring special 20% off</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded">
                          <p className="font-medium">Loyalty Program</p>
                          <p className="text-sm text-gray-600">Repeat customers: Additional 3% discount</p>
                        </div>
                      </div>
                      <Button className="w-full mt-4">Manage Pricing Rules</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Low Stock Alerts */}
            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Low Stock Alerts & Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Active Alerts</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 border-l-4 border-red-500">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-red-800">CRITICAL</span>
                          </div>
                          <p className="text-sm mt-1">Architectural Shingles - Weathered Wood</p>
                          <p className="text-xs text-red-600">Only 5 bundles remaining!</p>
                        </div>
                        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium text-yellow-800">WARNING</span>
                          </div>
                          <p className="text-sm mt-1">Ice & Water Shield - Standard</p>
                          <p className="text-xs text-yellow-600">Below reorder threshold (25 rolls)</p>
                        </div>
                        <div className="p-3 bg-orange-50 border-l-4 border-orange-500">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-orange-800">NOTICE</span>
                          </div>
                          <p className="text-sm mt-1">Ridge Vent - Black</p>
                          <p className="text-xs text-orange-600">Approaching reorder point (15 pieces)</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Email Notifications</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="font-medium">Daily Stock Report</span>
                          </div>
                          <p className="text-sm text-gray-600">Sent every morning at 8:00 AM</p>
                          <p className="text-xs text-green-600">✓ Active - Last sent today</p>
                        </div>
                        <div className="p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="font-medium">Critical Alerts</span>
                          </div>
                          <p className="text-sm text-gray-600">Immediate notifications for stock-outs</p>
                          <p className="text-xs text-green-600">✓ Active - 3 alerts sent this week</p>
                        </div>
                        <div className="p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="font-medium">Weekly Summary</span>
                          </div>
                          <p className="text-sm text-gray-600">Comprehensive inventory report</p>
                          <p className="text-xs text-green-600">✓ Active - Sent every Friday</p>
                        </div>
                      </div>
                      <Button className="w-full mt-4">Configure Alerts</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Order Tracking */}
            <TabsContent value="tracking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Real-Time Order Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Order #MBS-2024-001</p>
                          <p className="text-sm text-gray-600">ABC Roofing LLC - $2,450.00</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">IN TRANSIT</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Order Confirmed - Yesterday 2:30 PM</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Picked & Packed - Today 8:15 AM</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Out for Delivery - Today 11:00 AM</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span>Delivered - ETA 2:00 PM</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Order #MBS-2024-002</p>
                          <p className="text-sm text-gray-600">Premier Construction - $5,680.00</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">PREPARING</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Order Confirmed - Today 9:45 AM</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Picking in Progress - Started 10:30 AM</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span>Ready for Delivery - ETA 3:00 PM</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Order #MBS-2024-003</p>
                          <p className="text-sm text-gray-600">Elite Contractors - $3,290.00</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">DELIVERED</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Delivered Successfully - Yesterday 3:45 PM</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Signed by: Mike Johnson
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit Dialogs */}
          {/* Category Edit Dialog */}
          <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                if (editingCategory) {
                  updateCategory(editingCategory.id, formData.get('name') as string);
                }
              }} className="space-y-4">
                <div>
                  <Label htmlFor="edit-category-name">Category Name</Label>
                  <Input
                    id="edit-category-name"
                    name="name"
                    defaultValue={editingCategory?.name}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Update Category</Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Brand Add Dialog */}
          <Dialog open={brandDialogOpen} onOpenChange={setBrandDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Brand</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                if (selectedCategoryForBrand) {
                  addBrand(selectedCategoryForBrand, formData.get('name') as string);
                }
              }} className="space-y-4">
                <div>
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input id="brand-name" name="name" required />
                </div>
                <Button type="submit" className="w-full">Add Brand</Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Brand Edit Dialog */}
          <Dialog open={!!editingBrand} onOpenChange={() => setEditingBrand(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Brand</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                if (editingBrand) {
                  updateBrand(editingBrand.categoryId, editingBrand.brand.id, formData.get('name') as string);
                }
              }} className="space-y-4">
                <div>
                  <Label htmlFor="edit-brand-name">Brand Name</Label>
                  <Input
                    id="edit-brand-name"
                    name="name"
                    defaultValue={editingBrand?.brand.name}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Update Brand</Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Product Add/Edit Dialog */}
          <Dialog open={productDialogOpen || !!editingProduct} onOpenChange={(open) => {
            if (!open) {
              setProductDialogOpen(false);
              setEditingProduct(null);
            }
          }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const product = {
                  name: formData.get('name') as string,
                  sku: formData.get('sku') as string,
                  price: parseFloat(formData.get('price') as string),
                  stock: parseInt(formData.get('stock') as string),
                  image: formData.get('image') as string,
                  description: formData.get('description') as string,
                  specifications: formData.get('specifications') as string,
                  barcode: formData.get('barcode') as string,
                };

                if (editingProduct) {
                  updateProduct(editingProduct.categoryId, editingProduct.brandId, editingProduct.product.id, product);
                } else if (selectedBrandForProduct) {
                  addProduct(selectedBrandForProduct.categoryId, selectedBrandForProduct.brandId, product);
                }
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input
                      id="product-name"
                      name="name"
                      defaultValue={editingProduct?.product.name}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-sku">SKU</Label>
                    <Input
                      id="product-sku"
                      name="sku"
                      defaultValue={editingProduct?.product.sku}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="product-price">Price</Label>
                    <Input
                      id="product-price"
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.product.price}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-stock">Stock</Label>
                    <Input
                      id="product-stock"
                      name="stock"
                      type="number"
                      defaultValue={editingProduct?.product.stock}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-barcode">Barcode</Label>
                    <Input
                      id="product-barcode"
                      name="barcode"
                      defaultValue={editingProduct?.product.barcode}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="product-image">Product Image</Label>
                  <div className="space-y-2">
                    <Input
                      id="product-image"
                      name="image"
                      defaultValue={editingProduct?.product.image}
                      placeholder="https://... or paste image URL"
                      required
                    />
                    {editingProduct?.product.image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Current Image Preview:</p>
                        <img
                          src={editingProduct.product.image}
                          alt="Product preview"
                          className="w-32 h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      💡 Tip: You can copy image URLs from Unsplash, upload to your own server, or use any public image URL
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    name="description"
                    defaultValue={editingProduct?.product.description}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="product-specifications">Specifications</Label>
                  <Textarea
                    id="product-specifications"
                    name="specifications"
                    defaultValue={editingProduct?.product.specifications}
                    rows={3}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Footer />
    </>
  );
}
