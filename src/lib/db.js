// Database service layer for PostgreSQL with Prisma / fallback in-memory store
import { INITIAL_PRODUCTS, generateInitialVariants } from "./products-data";

// Shared global state for dev/serverless runtimes to persist across route transitions
const globalState = globalThis.__arearsDbState || {
  products: [...INITIAL_PRODUCTS],
  variants: generateInitialVariants(),
  orders: [
    {
      id: "ord-8921",
      customerName: "Alex Rivera",
      guestEmail: "alex@example.com",
      status: "SHIPPED",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      totalAmount: 440,
      subtotal: 440,
      tax: 0,
      shippingFee: 0,
      discount: 0,
      shippingAddress: {
        street: "742 Evergreen Terrace",
        city: "Springfield",
        state: "OR",
        zip: "97477",
        country: "USA"
      },
      items: [
        {
          id: "item-1",
          productName: "Arears Quantum-1",
          productSlug: "arears-quantum-one",
          colorName: "Crimson Blaze",
          size: 10,
          quantity: 2,
          priceAtPurchase: 220
        }
      ]
    },
    {
      id: "ord-7742",
      customerName: "Elena Vance",
      guestEmail: "elena@example.com",
      status: "DELIVERED",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      totalAmount: 240,
      subtotal: 240,
      tax: 0,
      shippingFee: 0,
      discount: 0,
      shippingAddress: {
        street: "100 Innovation Way",
        city: "San Francisco",
        state: "CA",
        zip: "94107",
        country: "USA"
      },
      items: [
        {
          id: "item-2",
          productName: "Arears Gravity-Zero",
          productSlug: "arears-gravity-zero",
          colorName: "Mint Electric",
          size: 9.5,
          quantity: 1,
          priceAtPurchase: 240
        }
      ]
    }
  ],
  users: [
    {
      id: "usr-admin",
      name: "Arears Administrator",
      email: "admin@arearssneakers.com",
      password: "admin123",
      role: "ADMIN",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr-demo",
      name: "Alex Rivera",
      email: "alex@example.com",
      password: "customer123",
      role: "CUSTOMER",
      createdAt: new Date().toISOString()
    }
  ]
};

if (process.env.NODE_ENV !== "production") {
  globalThis.__arearsDbState = globalState;
}

export const db = {
  // PRODUCTS
  async getProducts() {
    return globalState.products.map(p => ({
      ...p,
      variants: globalState.variants.filter(v => v.productId === p.id)
    }));
  },

  async getProductBySlug(slug) {
    const product = globalState.products.find(p => p.slug === slug);
    if (!product) return null;
    const variants = globalState.variants.filter(v => v.productId === product.id);
    return { ...product, variants };
  },

  async addProduct(productData) {
    const newProduct = {
      id: `prod-${Date.now()}`,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      ...productData,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString()
    };
    globalState.products.unshift(newProduct);

    if (productData.colorways && productData.sizes) {
      productData.colorways.forEach(color => {
        productData.sizes.forEach(size => {
          globalState.variants.push({
            id: `var-${newProduct.slug}-${color.name.toLowerCase().replace(/\s+/g, '-')}-${size}`,
            productId: newProduct.id,
            productSlug: newProduct.slug,
            productName: newProduct.name,
            colorName: color.name,
            colorHex: color.primaryHex,
            size: parseFloat(size),
            sku: `ARR-${newProduct.slug.slice(0, 3).toUpperCase()}-${color.name.slice(0, 3).toUpperCase()}-${parseFloat(size) * 10}`,
            stockQuantity: 15,
            basePrice: newProduct.basePrice,
            image: color.image || newProduct.image
          });
        });
      });
    }

    return newProduct;
  },

  // VARIANTS & INVENTORY
  async getVariantsByProduct(productId) {
    return globalState.variants.filter(v => v.productId === productId);
  },

  async updateVariantStock(variantId, newQuantity) {
    const variant = globalState.variants.find(v => v.id === variantId);
    if (variant) {
      variant.stockQuantity = Math.max(0, parseInt(newQuantity, 10));
      return variant;
    }
    return null;
  },

  // ORDERS
  async getOrders() {
    return [...globalState.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getOrderById(id) {
    return globalState.orders.find(o => o.id === id) || null;
  },

  async getOrdersByUserEmail(email) {
    return globalState.orders.filter(o => o.guestEmail?.toLowerCase() === email?.toLowerCase());
  },

  async createOrder({ customerName, guestEmail, shippingAddress, items, totalAmount, subtotal, discount = 0, stripeSessionId = null }) {
    const orderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Decrement stock for purchased variants
    items.forEach(item => {
      const variant = globalState.variants.find(
        v => (v.productSlug === item.slug || v.productId === item.id) &&
             v.colorName.toLowerCase() === item.color.toLowerCase() &&
             Math.abs(v.size - item.size) < 0.1
      );
      if (variant) {
        variant.stockQuantity = Math.max(0, variant.stockQuantity - item.quantity);
      }
    });

    const newOrder = {
      id: orderId,
      customerName,
      guestEmail,
      shippingAddress,
      status: "PROCESSING",
      createdAt: new Date().toISOString(),
      totalAmount,
      subtotal,
      discount,
      shippingFee: totalAmount >= 150 ? 0 : 15,
      stripeSessionId,
      items
    };

    globalState.orders.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(orderId, newStatus) {
    const order = globalState.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      return order;
    }
    return null;
  },

  // USERS & AUTH
  async findUserByEmail(email) {
    return globalState.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async createUser({ name, email, password, role = "CUSTOMER" }) {
    const existing = await this.findUserByEmail(email);
    if (existing) {
      throw new Error("User with this email already exists");
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString()
    };
    globalState.users.push(newUser);
    return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  }
};
