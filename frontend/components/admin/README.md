# Admin UI Components

A modern, minimal admin UI wrapper system with responsive design and accessibility features.

## Components

### AdminLayout
Main layout component with sidebar navigation and mobile responsiveness.

```tsx
import { AdminLayout } from '@/components/admin'

<AdminLayout currentPage="overview">
  <YourContent />
</AdminLayout>
```

### AdminContainer
Content wrapper with page header and optional product grid.

```tsx
import { AdminContainer } from '@/components/admin'

<AdminContainer currentPage="users" showProductGrid={true}>
  <YourContent />
</AdminContainer>
```

### AdminPage
Complete page wrapper with stats, product grid, and content area.

```tsx
import { AdminPage } from '@/components/admin'

<AdminPage 
  currentPage="overview" 
  showStats={true}
  showProductGrid={true}
  products={products}
>
  <YourContent />
</AdminPage>
```

### ProductGrid
Responsive 3-column grid that collapses to 2/1 columns on smaller screens.

```tsx
import { ProductGrid, ProductCard } from '@/components/admin'

<ProductGrid>
  <ProductCard 
    title="Product Name"
    description="Product description"
    category="Category"
    price={100}
    status="new"
  />
</ProductGrid>
```

### Badge
Status badges for products and content.

```tsx
import { Badge } from '@/components/admin'

<Badge variant="success" size="sm">New</Badge>
<Badge variant="warning">Sponsored</Badge>
<Badge variant="info">Highlight</Badge>
```

## Features

- **Responsive Design**: 3-column → 2-column → 1-column layout
- **Accessibility**: Focus states, keyboard navigation, ARIA labels
- **Hover Effects**: Lift animation on cards
- **Modern Typography**: Inter-like font family
- **Color Palette**: Light mode with soft grays and whites
- **Mobile First**: Collapsible sidebar with overlay
- **Consistent Spacing**: 16px rounded corners, soft shadows

## Usage Examples

### Basic Wrapper
```tsx
import { AdminWrapper } from '@/components/admin'

<AdminWrapper currentPage="dashboard">
  <YourExistingContent />
</AdminWrapper>
```

### With Product Grid
```tsx
import { AdminPage } from '@/components/admin'

const products = [
  {
    id: '1',
    title: 'Product Name',
    description: 'Product description',
    category: 'Category',
    price: 100,
    status: 'new'
  }
]

<AdminPage 
  currentPage="products" 
  showProductGrid={true}
  products={products}
>
  <AdditionalContent />
</AdminPage>
```

### Custom Layout
```tsx
import { AdminLayout, ProductGrid } from '@/components/admin'

<AdminLayout currentPage="custom">
  <div className="p-6">
    <h1>Custom Page</h1>
    <ProductGrid>
      {/* Your product cards */}
    </ProductGrid>
  </div>
</AdminLayout>
```

## Design System

### Colors
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Error: Red (#EF4444)
- Info: Purple (#8B5CF6)

### Spacing
- Base: 16px (1rem)
- Small: 8px (0.5rem)
- Large: 24px (1.5rem)
- XL: 32px (2rem)

### Typography
- Font Family: Inter, system-ui, sans-serif
- Headings: font-bold
- Body: font-medium
- Captions: font-normal

### Shadows
- Card: shadow-sm
- Hover: shadow-lg
- Focus: ring-2 ring-blue-500

## Accessibility

- Keyboard navigation support
- Focus indicators
- ARIA labels
- Screen reader friendly
- High contrast ratios
- Touch-friendly targets (44px minimum)
