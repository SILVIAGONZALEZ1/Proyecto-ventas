const STORAGE_KEYS = {
  users: "filtroApp_users",
  products: "filtroApp_products",
  orders: "filtroApp_orders",
  session: "filtroApp_session",
};

const FiltroStorage = {
  categories: ["Filtros", "Recambios", "Bombas", "Accesorios"],

  generateId() {
    return (
      Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
    );
  },

  load(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error("Error leyendo localStorage:", error);
      return null;
    }
  },

  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getUsers() {
    return this.load(STORAGE_KEYS.users) || [];
  },

  getProducts() {
    return this.load(STORAGE_KEYS.products) || [];
  },

  getOrders() {
    return this.load(STORAGE_KEYS.orders) || [];
  },

  getSession() {
    return this.load(STORAGE_KEYS.session);
  },

  saveUsers(users) {
    this.save(STORAGE_KEYS.users, users);
  },

  saveProducts(products) {
    this.save(STORAGE_KEYS.products, products);
  },

  saveOrders(orders) {
    this.save(STORAGE_KEYS.orders, orders);
  },

  saveSession(user) {
    if (user) {
      this.save(STORAGE_KEYS.session, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.session);
    }
  },

  initialize() {
    if (!this.getUsers()?.length) {
      this.saveUsers([
        {
          id: this.generateId(),
          name: "Admin General",
          email: "admin@filtros.com",
          password: "admin123",
          role: "administrador",
        },
        {
          id: this.generateId(),
          name: "Laura Vendedor",
          email: "laura@filtros.com",
          password: "venta123",
          role: "vendedor",
        },
      ]);
    }

    if (!this.getProducts()?.length) {
      this.saveProducts([
        {
          id: this.generateId(),
          name: "Filtro de agua doméstico",
          description:
            "Filtro de alto rendimiento para agua potable en el hogar.",
          price: 120,
          category: "Filtros",
          image:
            "https://images.unsplash.com/photo-1516594798943-7faf0f1b0a98?auto=format&fit=crop&w=400&q=80",
          stock: 16,
        },
        {
          id: this.generateId(),
          name: "Recambio de cartucho",
          description:
            "Cartucho de repuesto compatible con filtros domésticos.",
          price: 28,
          category: "Recambios",
          image:
            "https://images.unsplash.com/photo-1581091870622-41f12aa762cd?auto=format&fit=crop&w=400&q=80",
          stock: 22,
        },
        {
          id: this.generateId(),
          name: "Bomba de presión",
          description:
            "Bomba para garantizar flujo estable en sistemas de filtrado.",
          price: 200,
          category: "Bombas",
          image:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80",
          stock: 8,
        },
        {
          id: this.generateId(),
          name: "Kit de conexión",
          description:
            "Accesorios para instalación de filtros y tuberías de agua.",
          price: 45,
          category: "Accesorios",
          image:
            "https://images.unsplash.com/photo-1580281657524-5f2d45dd9d03?auto=format&fit=crop&w=400&q=80",
          stock: 12,
        },
      ]);
    }

    if (!this.getOrders()?.length) {
      const products = this.getProducts();
      this.saveOrders([
        {
          id: this.generateId(),
          customer: "Tienda Central",
          items: [
            { productId: products[0].id, quantity: 2 },
            { productId: products[2].id, quantity: 1 },
          ],
          total: 440,
          status: "pendiente",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          id: this.generateId(),
          customer: "Comercial Aqua",
          items: [{ productId: products[1].id, quantity: 5 }],
          total: 140,
          status: "enviado",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        },
      ]);
    }
  },
};
