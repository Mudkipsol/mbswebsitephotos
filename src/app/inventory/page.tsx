'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ShoppingCart,
  Search,
  Package,
  Eye,
  Edit,
  Lock,
  FileText,
  Download,
  AlertTriangle,
  Filter,
  Save,
  Minus,
  Plus
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

// Categories in exact specified order - made editable
const getInitialCategories = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mbs_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading saved categories:', error);
      }
    }
  }
  return [
    { id: 'shingles', name: 'Shingles', hasSubcategories: true, image: 'https://i.ibb.co/zTZzG2LM/Shingles.jpg' },
    { id: 'underlayment', name: 'Underlayment', hasSubcategories: false, image: 'https://i.ibb.co/XrPdP74S/Underlayment.png' },
    { id: 'hip-and-ridge', name: 'Hip and Ridge', hasSubcategories: true, image: 'https://i.ibb.co/MDQFXdrc/Hip-Ridge.png' },
    { id: 'ice-and-water', name: 'Ice and Water', hasSubcategories: false, image: 'https://i.ibb.co/hRgJ23bS/Ice-and-Water.jpg' },
    { id: 'drip-edge', name: 'Drip Edge and Gutter Apron', hasSubcategories: false, image: 'https://i.ibb.co/sJqx94Ms/Drip-Edge-Gytter-Apron.jpg' },
    { id: 'ventilation', name: 'Ventilation', hasSubcategories: false, image: 'https://i.ibb.co/RknpXthD/Ventilation.png' },
    { id: 'flashings', name: 'Flashings', hasSubcategories: false, image: 'https://i.ibb.co/dwBYrnWx/Flashings.jpg' },
    { id: 'accessories', name: 'Accessories', hasSubcategories: false, image: 'https://i.ibb.co/XfPtwRWR/Accessories.png' },
    { id: 'nails', name: 'Nails', hasSubcategories: false, image: 'https://i.ibb.co/yBK8zdXf/Nails.png' },
    { id: 'paint-caulking', name: 'Paint and Caulking', hasSubcategories: false, image: 'https://i.ibb.co/RTTVwFwf/Paint-and-Caulking.png' },
    { id: 'valley-metal', name: 'Valley Metal', hasSubcategories: false, image: 'https://i.ibb.co/tTBH0B70/Valley-Metal.jpg' }
  ];
};

// Brands for categories with subcategories - made editable
const getInitialBrands = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mbs_brands');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading saved brands:', error);
      }
    }
  }
  return {
    shingles: [
      {
        id: 'certainteed',
        name: 'CertainTeed',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop'
      },
      {
        id: 'atlas',
        name: 'Atlas',
        image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop'
      }
    ],
    'hip-and-ridge': [
      {
        id: 'certainteed',
        name: 'CertainTeed',
        image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop'
      },
      {
        id: 'atlas',
        name: 'Atlas',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop'
      }
    ]
  };
};

// Products by brand - made editable
const getInitialProducts = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mbs_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading saved products:', error);
      }
    }
  }
  return {
    certainteed: {
      shingles: [
        {
          id: 'landmark',
          name: 'Landmark',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
          startingPrice: 125.99,
          hasColors: true
        },
        {
          id: 'landmark-pro',
          name: 'Landmark Pro',
          image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
          startingPrice: 145.99,
          hasColors: true
        },
        {
          id: 'presidential-shake',
          name: 'Presidential Shake',
          image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
          startingPrice: 185.99,
          hasColors: true
        }
      ],
      'hip-and-ridge': [
        {
          id: 'hip-ridge-shingles',
          name: 'Hip & Ridge Shingles',
          image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
          startingPrice: 89.99,
          hasColors: true
        },
        {
          id: 'ridge-vent',
          name: 'Ridge Vent',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
          startingPrice: 45.99,
          hasColors: true
        }
      ]
    },
    atlas: {
      shingles: [
        {
          id: 'prolam',
          name: 'ProLam',
          image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
          startingPrice: 115.99,
          hasColors: true
        },
        {
          id: 'pinnacle',
          name: 'Pinnacle',
          image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
          startingPrice: 135.99,
          hasColors: true
        },
        {
          id: 'storm-master',
          name: 'StormMaster',
          image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
          startingPrice: 149.99,
          hasColors: true
        }
      ],
      'hip-and-ridge': [
        {
          id: 'storm-master-ridge',
          name: 'StormMaster Ridge',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
          startingPrice: 95.99,
          hasColors: true
        },
        {
          id: 'atlas-ridge-cap',
          name: 'Atlas Ridge Cap',
          image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
          startingPrice: 78.99,
          hasColors: true
        }
      ]
    }
  };
};

// Colors for products
const COLORS = {
  landmark: [
    { id: 'charcoal-black', name: 'Charcoal Black', hex: '#2C2C2C', price: 125.99, stock: 450 },
    { id: 'weathered-wood', name: 'Weathered Wood', hex: '#8B7355', price: 125.99, stock: 325 },
    { id: 'driftwood', name: 'Driftwood', hex: '#A0978C', price: 125.99, stock: 275 },
    { id: 'colonial-slate', name: 'Colonial Slate', hex: '#4A5568', price: 125.99, stock: 380 },
    { id: 'burnt-sienna', name: 'Burnt Sienna', hex: '#8B4513', price: 125.99, stock: 195 }
  ],
  'landmark-pro': [
    { id: 'charcoal-black', name: 'Charcoal Black', hex: '#2C2C2C', price: 145.99, stock: 200 },
    { id: 'weathered-wood', name: 'Weathered Wood', hex: '#8B7355', price: 145.99, stock: 150 },
    { id: 'pewter-gray', name: 'Pewter Gray', hex: '#696969', price: 145.99, stock: 175 },
    { id: 'storm-cloud', name: 'Storm Cloud', hex: '#778899', price: 145.99, stock: 125 }
  ],
  'presidential-shake': [
    { id: 'autumn-brown', name: 'Autumn Brown', hex: '#8B4513', price: 185.99, stock: 85 },
    { id: 'charcoal-black', name: 'Charcoal Black', hex: '#2C2C2C', price: 185.99, stock: 65 },
    { id: 'weathered-wood', name: 'Weathered Wood', hex: '#8B7355', price: 185.99, stock: 45 }
  ],
  'hip-ridge-shingles': [
    { id: 'charcoal-black', name: 'Charcoal Black', hex: '#2C2C2C', price: 89.99, stock: 150 },
    { id: 'weathered-wood', name: 'Weathered Wood', hex: '#8B7355', price: 89.99, stock: 125 },
    { id: 'storm-cloud', name: 'Storm Cloud', hex: '#778899', price: 89.99, stock: 95 }
  ],
  'ridge-vent': [
    { id: 'black', name: 'Black', hex: '#000000', price: 45.99, stock: 300 },
    { id: 'brown', name: 'Brown', hex: '#8B4513', price: 45.99, stock: 250 },
    { id: 'gray', name: 'Gray', hex: '#696969', price: 45.99, stock: 275 }
  ],
  prolam: [
    { id: 'charcoal-black', name: 'Charcoal Black', hex: '#2C2C2C', price: 115.99, stock: 320 },
    { id: 'weathered-wood', name: 'Weathered Wood', hex: '#8B7355', price: 115.99, stock: 285 },
    { id: 'storm-gray', name: 'Storm Gray', hex: '#708090', price: 115.99, stock: 205 },
    { id: 'burnt-sienna', name: 'Burnt Sienna', hex: '#8B4513', price: 115.99, stock: 165 }
  ],
  pinnacle: [
    { id: 'charcoal-black', name: 'Charcoal Black', hex: '#2C2C2C', price: 135.99, stock: 180 },
    { id: 'weathered-wood', name: 'Weathered Wood', hex: '#8B7355', price: 135.99, stock: 145 },
    { id: 'slate-gray', name: 'Slate Gray', hex: '#708090', price: 135.99, stock: 125 }
  ],
  'storm-master': [
    { id: 'charcoal-black', name: 'Charcoal Black', hex: '#2C2C2C', price: 149.99, stock: 95 },
    { id: 'weathered-wood', name: 'Weathered Wood', hex: '#8B7355', price: 149.99, stock: 75 },
    { id: 'storm-cloud', name: 'Storm Cloud', hex: '#778899', price: 149.99, stock: 85 }
  ],
  'storm-master-ridge': [
    { id: 'charcoal-black', name: 'Charcoal Black', hex: '#2C2C2C', price: 95.99, stock: 110 },
    { id: 'weathered-wood', name: 'Weathered Wood', hex: '#8B7355', price: 95.99, stock: 85 },
    { id: 'storm-gray', name: 'Storm Gray', hex: '#708090', price: 95.99, stock: 95 }
  ],
  'atlas-ridge-cap': [
    { id: 'charcoal-black', name: 'Charcoal Black', hex: '#2C2C2C', price: 78.99, stock: 185 },
    { id: 'weathered-wood', name: 'Weathered Wood', hex: '#8B7355', price: 78.99, stock: 155 },
    { id: 'brown', name: 'Brown', hex: '#8B4513', price: 78.99, stock: 165 }
  ]
};

// Sample products for direct categories - made editable
const getInitialDirectProducts = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mbs_direct_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading saved direct products:', error);
      }
    }
  }
  return {
    underlayment: [
      {
        id: 'synthetic-underlayment',
        name: 'Synthetic Underlayment Roll',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
        price: 89.99,
        stock: 150,
        hasOptions: false
      },
      {
        id: 'felt-underlayment',
        name: 'Felt Underlayment #30',
        image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
        price: 45.99,
        stock: 200,
        hasOptions: false
      },
      {
        id: 'ice-water-shield',
        name: 'Ice & Water Shield',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        price: 125.99,
        stock: 85,
        hasOptions: false
      }
    ],
    'ice-and-water': [
      {
        id: 'ice-water-barrier',
        name: 'Self-Adhering Ice & Water Barrier',
        image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
        price: 135.99,
        stock: 75,
        hasOptions: false
      },
      {
        id: 'modified-bitumen',
        name: 'Modified Bitumen Membrane',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
        price: 185.99,
        stock: 45,
        hasOptions: false
      }
    ],
    'drip-edge': [
      {
        id: 'aluminum-drip-edge',
        name: 'Aluminum Drip Edge - 10ft',
        image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
        price: 12.99,
        stock: 500,
        hasOptions: false
      },
      {
        id: 'galvanized-drip-edge',
        name: 'Galvanized Steel Drip Edge - 10ft',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        price: 15.99,
        stock: 350,
        hasOptions: false
      },
      {
        id: 'gutter-apron',
        name: 'Gutter Apron - 10ft',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
        price: 18.99,
        stock: 225,
        hasOptions: false
      }
    ],
    ventilation: [
      {
        id: 'ridge-vent-system',
        name: 'Ridge Vent System - 20ft',
        image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
        price: 89.99,
        stock: 125,
        hasOptions: false
      },
      {
        id: 'soffit-vent',
        name: 'Continuous Soffit Vent - 8ft',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
        price: 25.99,
        stock: 275,
        hasOptions: false
      },
      {
        id: 'turbine-vent',
        name: 'Aluminum Turbine Vent',
        image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
        price: 45.99,
        stock: 85,
        hasOptions: false
      }
    ],
    flashings: [
      {
        id: 'step-flashing',
        name: 'Aluminum Step Flashing - 8"x10"',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        price: 2.85,
        stock: 1000,
        hasOptions: false
      },
      {
        id: 'pipe-boot',
        name: 'EPDM Pipe Boot - 1.5"',
        image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
        price: 15.99,
        stock: 150,
        hasOptions: false
      },
      {
        id: 'valley-flashing',
        name: 'Galvanized Valley Flashing - 10ft',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
        price: 35.99,
        stock: 95,
        hasOptions: false
      }
    ],
    accessories: [
      {
        id: 'roof-cement',
        name: 'Roofing Cement - 10.3oz Tube',
        image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
        price: 8.99,
        stock: 300,
        hasOptions: false
      },
      {
        id: 'roofing-tape',
        name: 'Butyl Roofing Tape - 4"x25ft',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        price: 25.99,
        stock: 125,
        hasOptions: false
      },
      {
        id: 'roof-screws',
        name: 'Self-Drilling Roof Screws - 100 pack',
        image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
        price: 18.99,
        stock: 250,
        hasOptions: false
      }
    ],
    nails: [
      {
        id: 'roofing-nails-125',
        name: 'Roofing Nails - 1.25" (50lb box)',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
        price: 89.99,
        stock: 75,
        hasOptions: false
      },
      {
        id: 'roofing-nails-175',
        name: 'Roofing Nails - 1.75" (50lb box)',
        image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
        price: 95.99,
        stock: 65,
        hasOptions: false
      },
      {
        id: 'cap-nails',
        name: 'Plastic Cap Nails - 1.5" (5lb box)',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        price: 45.99,
        stock: 150,
        hasOptions: false
      }
    ],
    'paint-caulking': [
      {
        id: 'exterior-caulk',
        name: 'Exterior Acrylic Caulk - Clear',
        image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
        price: 6.99,
        stock: 200,
        hasOptions: false
      },
      {
        id: 'roof-coating',
        name: 'Elastomeric Roof Coating - 5 Gallon',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
        price: 185.99,
        stock: 25,
        hasOptions: false
      },
      {
        id: 'primer-sealer',
        name: 'Metal Roof Primer & Sealer - 1 Gallon',
        image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
        price: 45.99,
        stock: 85,
        hasOptions: false
      }
    ],
    'valley-metal': [
      {
        id: 'galvanized-valley',
        name: 'Galvanized Valley Metal - 10ft',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        price: 35.99,
        stock: 125,
        hasOptions: false
      },
      {
        id: 'aluminum-valley',
        name: 'Aluminum Valley Metal - 10ft',
        image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
        price: 42.99,
        stock: 95,
        hasOptions: false
      },
      {
        id: 'copper-valley',
        name: 'Copper Valley Metal - 10ft',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
        price: 125.99,
        stock: 35,
        hasOptions: false
      }
    ]
  };
};

type SortOption = 'sales' | 'price-low' | 'price-high';

// Bulk Pricing Tiers - Buy more, save more!
const BULK_PRICING = {
  shingles: [
    { minQty: 1, discount: 0, label: 'Regular Price' },
    { minQty: 10, discount: 0.05, label: '5% off 10+ bundles' },
    { minQty: 25, discount: 0.10, label: '10% off 25+ bundles' },
    { minQty: 50, discount: 0.15, label: '15% off 50+ bundles' }
  ],
  underlayment: [
    { minQty: 1, discount: 0, label: 'Regular Price' },
    { minQty: 5, discount: 0.05, label: '5% off 5+ rolls' },
    { minQty: 15, discount: 0.10, label: '10% off 15+ rolls' }
  ],
  'ice-and-water': [
    { minQty: 1, discount: 0, label: 'Regular Price' },
    { minQty: 10, discount: 0.08, label: '8% off 10+ rolls' },
    { minQty: 20, discount: 0.12, label: '12% off 20+ rolls' }
  ]
};

// Stock by Location
const STOCK_LOCATIONS = [
  { id: 'youngstown', name: 'Youngstown, OH', isMain: true },
  { id: 'akron', name: 'Akron, OH', isMain: false },
  { id: 'columbus', name: 'Columbus, OH', isMain: false },
  { id: 'cleveland', name: 'Cleveland, OH', isMain: false },
  { id: 'pittsburgh', name: 'Pittsburgh, PA', isMain: false }
];

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, items: cartItems, getTotalItems } = useCart();

  // Editable data states
  const [categories, setCategories] = useState(getInitialCategories());
  const [brands, setBrands] = useState(getInitialBrands());
  const [products, setProducts] = useState(getInitialProducts());
  const [directProducts, setDirectProducts] = useState(getInitialDirectProducts());

  // Navigation state
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentBrand, setCurrentBrand] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<string | null>(null);

  // Other state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('sales');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [editPassword, setEditPassword] = useState('');
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'category' | 'brand' | 'product' | 'directProduct'>('category');
  const [editItem, setEditItem] = useState<any>(null);

  // Save data to localStorage
  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mbs_categories', JSON.stringify(categories));
      localStorage.setItem('mbs_brands', JSON.stringify(brands));
      localStorage.setItem('mbs_products', JSON.stringify(products));
      localStorage.setItem('mbs_direct_products', JSON.stringify(directProducts));
    }
  };

  // Get current view data
  const getCurrentViewData = () => {
    if (!currentCategory) {
      return { type: 'categories', data: categories };
    }

    const category = categories.find((c: any) => c.id === currentCategory);
    if (!category) return { type: 'categories', data: categories };

    if (category.hasSubcategories) {
      if (!currentBrand) {
        return { type: 'brands', data: brands[currentCategory as keyof typeof brands] || [] };
      }

      if (!currentProduct) {
        const productList = products[currentBrand as keyof typeof products]?.[currentCategory as keyof typeof products] || [];
        return { type: 'products', data: productList };
      }

      const colors = COLORS[currentProduct as keyof typeof COLORS] || [];
      return { type: 'colors', data: colors };
    } else {
      const productList = directProducts[currentCategory as keyof typeof directProducts] || [];
      return { type: 'direct-products', data: productList };
    }
  };

  const currentView = getCurrentViewData();

  // Navigation functions
  const navigateToCategory = (categoryId: string) => {
    setCurrentCategory(categoryId);
    setCurrentBrand(null);
    setCurrentProduct(null);
    setSelectedColor('');
  };

  const navigateToBrand = (brandId: string) => {
    setCurrentBrand(brandId);
    setCurrentProduct(null);
    setSelectedColor('');
  };

  const navigateToProduct = (productId: string) => {
    setCurrentProduct(productId);
    setSelectedColor('');
  };

  const handleBack = () => {
    if (currentProduct) {
      setCurrentProduct(null);
      setSelectedColor('');
    } else if (currentBrand) {
      setCurrentBrand(null);
    } else if (currentCategory) {
      setCurrentCategory(null);
    }
  };

  // Edit functions
  const openEditDialog = (type: 'category' | 'brand' | 'product' | 'directProduct', item: any) => {
    setEditType(type);
    setEditItem({ ...item });
    setEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (!editItem) return;

    switch (editType) {
      case 'category':
        const newCategories = categories.map((cat: any) =>
          cat.id === editItem.id ? editItem : cat
        );
        setCategories(newCategories);
        break;
      case 'brand':
        const newBrands = { ...brands };
        if (currentCategory && newBrands[currentCategory as keyof typeof newBrands]) {
          newBrands[currentCategory as keyof typeof newBrands] =
            newBrands[currentCategory as keyof typeof newBrands].map((brand: any) =>
              brand.id === editItem.id ? editItem : brand
            );
          setBrands(newBrands);
        }
        break;
      case 'product':
        const newProducts = { ...products };
        if (currentBrand && currentCategory &&
            newProducts[currentBrand as keyof typeof newProducts] &&
            newProducts[currentBrand as keyof typeof newProducts][currentCategory as keyof typeof newProducts[keyof typeof newProducts]]) {
          newProducts[currentBrand as keyof typeof newProducts][currentCategory as keyof typeof newProducts[keyof typeof newProducts]] =
            newProducts[currentBrand as keyof typeof newProducts][currentCategory as keyof typeof newProducts[keyof typeof newProducts]].map((prod: any) =>
              prod.id === editItem.id ? editItem : prod
            );
          setProducts(newProducts);
        }
        break;
      case 'directProduct':
        const newDirectProducts = { ...directProducts };
        if (currentCategory && newDirectProducts[currentCategory as keyof typeof newDirectProducts]) {
          newDirectProducts[currentCategory as keyof typeof newDirectProducts] =
            newDirectProducts[currentCategory as keyof typeof newDirectProducts].map((prod: any) =>
              prod.id === editItem.id ? editItem : prod
            );
          setDirectProducts(newDirectProducts);
        }
        break;
    }

    saveToLocalStorage();
    setEditDialogOpen(false);
  };

  // Cart functions
  const handleAddToCart = (productData: { id: string; name: string; price: number; image: string }) => {
    const quantity = quantities[productData.id] || 1;
    addToCart({
      id: `${productData.id}-${selectedColor || 'default'}`,
      name: selectedColor ? `${productData.name} - ${selectedColor}` : productData.name,
      price: productData.price,
      image: productData.image
    }, quantity);

    // Reset quantity and show success
    setQuantities(prev => ({ ...prev, [productData.id]: 1 }));

    // Show success toast (you can implement a proper toast system)
    alert('Added to cart. View Cart →');
  };

  const handleQuantityChange = (productId: string, value: string) => {
    const numValue = parseInt(value) || 1;
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, numValue)
    }));
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return 'bg-red-500';
    if (stock > 100) return 'bg-green-500';
    if (stock > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 15) return `Only ${stock} left`;
    return `${stock} in stock`;
  };

  // Breadcrumb generation
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: 'Categories', onClick: () => {
      setCurrentCategory(null);
      setCurrentBrand(null);
      setCurrentProduct(null);
      setSelectedColor('');
    }}];

    if (currentCategory) {
      const category = categories.find((c: any) => c.id === currentCategory);
      breadcrumbs.push({
        label: category?.name || '',
        onClick: () => navigateToCategory(currentCategory)
      });
    }

    if (currentBrand) {
      const brand = brands[currentCategory as keyof typeof brands]?.find((b: any) => b.id === currentBrand);
      breadcrumbs.push({
        label: brand?.name || '',
        onClick: () => navigateToBrand(currentBrand)
      });
    }

    if (currentProduct) {
      const product = products[currentBrand as keyof typeof products]?.[currentCategory as keyof typeof products[keyof typeof products]]?.find((p: { id: string; name: string }) => p.id === currentProduct);
      breadcrumbs.push({
        label: product?.name || '',
        onClick: () => navigateToProduct(currentProduct)
      });
    }

    return breadcrumbs;
  };

  // Get bulk pricing discount
  const getBulkDiscount = (category: string, quantity: number) => {
    const categoryPricing = BULK_PRICING[category as keyof typeof BULK_PRICING];
    if (!categoryPricing) return { discount: 0, label: 'Regular Price' };

    let bestTier = categoryPricing[0];
    for (const tier of categoryPricing) {
      if (quantity >= tier.minQty) {
        bestTier = tier;
      }
    }
    return bestTier;
  };

  // Calculate price with bulk discount
  const calculateBulkPrice = (basePrice: number, category: string, quantity: number) => {
    const bulkTier = getBulkDiscount(category, quantity);
    return basePrice * (1 - bulkTier.discount);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">MBS Inventory</h1>
              <p className="text-gray-600">Professional roofing supplies in stock and ready to ship</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Admin Edit Button */}
              {!editMode ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    placeholder="Admin password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-32 h-9"
                  />
                  <Button
                    onClick={() => {
                      if (editPassword === 'MBS2024admin') {
                        setEditMode(true);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                  >
                    <Lock className="w-4 h-4 mr-1" />
                    Admin Edit
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setEditMode(false)}
                  variant="outline"
                  size="sm"
                  className="h-9 px-3"
                >
                  Exit Edit Mode
                </Button>
              )}

              {/* View Cart Button */}
              <Button
                onClick={() => router.push('/cart')}
                variant="outline"
                size="sm"
                className="h-9 px-3 relative"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                View Cart
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center bg-red-500">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="price-low">Price (Low → High)</SelectItem>
                  <SelectItem value="price-high">Price (High → Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Breadcrumbs */}
          {currentCategory && (
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getBreadcrumbs().map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {index > 0 && <span>/</span>}
                    <span
                      className={`${
                        index === getBreadcrumbs().length - 1
                          ? 'font-semibold text-black'
                          : 'cursor-pointer hover:text-red-600 hover:underline'
                      }`}
                      onClick={index === getBreadcrumbs().length - 1 ? undefined : crumb.onClick}
                    >
                      {crumb.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex gap-8">
            {/* Left Sidebar - Categories */}
            <div className="w-80">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-4 w-4" />
                    <h3 className="font-semibold">Categories</h3>
                  </div>
                  <div className="space-y-1">
                    <Button
                      variant={!currentCategory ? "default" : "ghost"}
                      className={`w-full justify-start ${!currentCategory ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                      onClick={() => {
                        setCurrentCategory(null);
                        setCurrentBrand(null);
                        setCurrentProduct(null);
                        setSelectedColor('');
                      }}
                    >
                      All Categories
                    </Button>
                    {categories.map((category: any) => (
                      <Button
                        key={category.id}
                        variant={currentCategory === category.id ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          currentCategory === category.id ? 'bg-red-500 hover:bg-red-600 text-white' : ''
                        }`}
                        onClick={() => navigateToCategory(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Categories View */}
              {currentView.type === 'categories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category: any) => (
                    <Card
                      key={category.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden relative"
                      onClick={() => navigateToCategory(category.id)}
                    >
                      <div className="relative h-48 bg-gray-200">
                        <Image
                          src={category.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <h3 className="text-xl font-bold text-white text-center">{category.name}</h3>
                        </div>
                        {editMode && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog('category', category);
                            }}
                            size="sm"
                            className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Brands View */}
              {currentView.type === 'brands' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(currentView.data as { id: string; name: string; image: string }[]).map((brand) => (
                    <Card
                      key={brand.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden relative"
                      onClick={() => navigateToBrand(brand.id)}
                    >
                      <div className="relative h-48">
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          fill
                          className="object-cover"
                        />
                        {editMode && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog('brand', brand);
                            }}
                            size="sm"
                            className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <CardContent className="p-6 text-center">
                        <h3 className="text-xl font-bold">{brand.name}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Products View */}
              {currentView.type === 'products' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(currentView.data as { id: string; name: string; image: string; startingPrice: number; hasColors: boolean }[]).map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
                      <div className="relative h-48 cursor-pointer" onClick={() => navigateToProduct(product.id)}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-200"
                        />
                        {editMode && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog('product', product);
                            }}
                            size="sm"
                            className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-3">Starting at ${product.startingPrice}</p>

                        {/* Product Docs & Guides */}
                        <div className="flex gap-2 mb-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Simulate PDF download
                              const link = document.createElement('a');
                              link.href = '#';
                              link.download = `${product.name}-specs.pdf`;
                              alert(`📄 Downloading: ${product.name} Technical Specifications`);
                            }}
                            className="text-xs"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Specs
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Simulate PDF download
                              alert(`📋 Downloading: ${product.name} Installation Guide`);
                            }}
                            className="text-xs"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Install Guide
                          </Button>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => navigateToProduct(product.id)}
                        >
                          {product.hasColors ? 'Select Colors' : 'Select Options'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Colors/Variants View */}
              {currentView.type === 'colors' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(currentView.data as { id: string; name: string; hex: string; price: number; stock: number }[]).map((color) => {
                      const product = products[currentBrand as keyof typeof products]?.[currentCategory as keyof typeof products[keyof typeof products]]?.find((p: { id: string; name: string }) => p.id === currentProduct);
                      const brand = brands[currentCategory as keyof typeof brands]?.find((b: any) => b.id === currentBrand);

                      return (
                        <Card key={color.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-48 bg-gray-200">
                            {product?.image ? (
                              <Image
                                src={product.image}
                                alt={`${product.name} - ${color.name}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                            <Badge className={`absolute top-2 left-2 ${getStockBadgeColor(color.stock)} text-white`}>
                              {getStockText(color.stock)}
                            </Badge>
                            {/* Color indicator */}
                            <div
                              className="absolute top-2 right-2 w-6 h-6 rounded border-2 border-white shadow-lg"
                              style={{ backgroundColor: color.hex }}
                            />
                          </div>

                          <CardContent className="p-6">
                            <div className="mb-4">
                              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                {product?.name} - {color.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">{brand?.name}</p>
                              <p className="text-sm text-gray-600 mb-2">
                                Certainteed {product?.name} Architectural Shingle
                              </p>
                              <p className="text-xs text-gray-500 mb-4">
                                SKU: {product?.id?.toUpperCase()}-{color.id.toUpperCase()}
                              </p>
                            </div>

                            <div className="mb-4">
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-gray-900">
                                  ${color.price}
                                </span>
                                <span className="text-sm text-gray-600">/ Square</span>
                              </div>
                            </div>

                            <div className="space-y-3 mb-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Qty:</span>
                                <div className="flex items-center">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleQuantityChange(color.id, String(Math.max(1, (quantities[color.id] || 1) - 1)))}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <Input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={quantities[color.id] || 1}
                                    onChange={(e) => handleQuantityChange(color.id, e.target.value)}
                                    className="w-16 h-8 text-center mx-1"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleQuantityChange(color.id, String((quantities[color.id] || 1) + 1))}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  // Simulate view details
                                  alert(`📋 Viewing details for ${product?.name} - ${color.name}`);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                className="flex-1 bg-red-500 hover:bg-red-600"
                                disabled={color.stock === 0}
                                onClick={() => {
                                  if (product) {
                                    handleAddToCart({
                                      id: `${currentProduct}-${color.id}`,
                                      name: `${product.name} - ${color.name}`,
                                      price: color.price,
                                      image: product.image
                                    });
                                  }
                                }}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>


                </div>
              )}

              {/* Direct Products View */}
              {currentView.type === 'direct-products' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(currentView.data as { id: string; name: string; image: string; price: number; stock: number; hasOptions: boolean }[]).map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
                      <div className="relative h-48">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        <Badge className={`absolute top-2 left-2 ${getStockBadgeColor(product.stock)} text-white`}>
                          {getStockText(product.stock)}
                        </Badge>
                        {/* Stock by Location - show on hover or click */}
                        <div className="absolute top-2 right-16 opacity-0 hover:opacity-100 transition-opacity bg-white rounded shadow-lg p-2 text-xs">
                          <div className="space-y-1">
                            {STOCK_LOCATIONS.slice(0, 3).map((location) => (
                              <div key={location.id} className="flex justify-between">
                                <span>{location.name}:</span>
                                <span className="font-medium">{Math.floor(Math.random() * 200)}</span>
                              </div>
                            ))}
                            <div className="text-blue-600 cursor-pointer">View all locations →</div>
                          </div>
                        </div>
                        {editMode && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog('directProduct', product);
                            }}
                            size="sm"
                            className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                        <p className="text-2xl font-bold text-green-600 mb-4">${product.price}</p>

                        {product.stock > 0 ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Quantity:</span>
                              <Input
                                type="number"
                                min="1"
                                step="1"
                                max={product.stock}
                                value={quantities[product.id] || 1}
                                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                className="w-20 h-8 text-center"
                              />
                            </div>
                            {/* Bulk Pricing for Direct Products */}
                            {currentCategory && BULK_PRICING[currentCategory as keyof typeof BULK_PRICING] && (
                              <div className="space-y-1">
                                {BULK_PRICING[currentCategory as keyof typeof BULK_PRICING]?.map((tier, index) => {
                                  const currentQty = quantities[product.id] || 1;
                                  const isActive = currentQty >= tier.minQty;
                                  const discountedPrice = calculateBulkPrice(product.price, currentCategory, currentQty);

                                  return (
                                    <div key={index} className={`text-xs p-1 rounded ${isActive ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-50 text-gray-600'}`}>
                                      {tier.label} {isActive && `(${discountedPrice.toFixed(2)} each)`}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            <Button
                              onClick={() => handleAddToCart(product)}
                              className="w-full bg-red-500 hover:bg-red-600"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Button disabled className="w-full">
                              Out of Stock
                            </Button>
                            {/* Product Substitution Alert */}
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-yellow-800">Similar Product Available</p>
                                  <p className="text-yellow-700">Try our premium alternative with similar specs</p>
                                  <Button variant="link" className="h-auto p-0 text-yellow-700 underline text-xs">
                                    View Alternative →
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {currentView.data.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                  <p className="text-gray-500">Try adjusting your search or browse other categories.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editType}</DialogTitle>
            <DialogDescription>
              Make changes to the {editType} details below
            </DialogDescription>
          </DialogHeader>

          {editItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editItem.name || ''}
                  onChange={(e) => setEditItem({...editItem, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={editItem.image || ''}
                  onChange={(e) => setEditItem({...editItem, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {(editType === 'product' || editType === 'directProduct') && (
                <div>
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editItem.startingPrice || editItem.price || 0}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      if (editType === 'product') {
                        setEditItem({...editItem, startingPrice: price});
                      } else {
                        setEditItem({...editItem, price: price});
                      }
                    }}
                  />
                </div>
              )}

              {editType === 'directProduct' && (
                <div>
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editItem.stock || 0}
                    onChange={(e) => setEditItem({...editItem, stock: parseInt(e.target.value) || 0})}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEdit} className="bg-red-500 hover:bg-red-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
