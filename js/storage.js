import { db } from "./firebase-config.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  setDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const FiltroStorage = {
  categories: ["Filtros", "Recambios", "Bombas", "Accesorios"],

  generateId() {
    return (
      Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
    );
  },

  async getCollection(collectionName, orderField = null) {
    try {
      const collectionRef = collection(db, collectionName);
      const queryRef = orderField ? query(collectionRef, orderBy(orderField, "asc")) : collectionRef;
      const snapshot = await getDocs(queryRef);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (error) {
      console.error(`Error leyendo colección ${collectionName}:`, error);
      return [];
    }
  },

  async getDocument(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
      console.error(`Error leyendo documento ${id} en ${collectionName}:`, error);
      return null;
    }
  },

  async saveDocument(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, { ...data, id });
    } catch (error) {
      console.error(`Error guardando documento ${id} en ${collectionName}:`, error);
      throw error;
    }
  },

  async addDocument(collectionName, data) {
    try {
      const id = data.id || this.generateId();
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, { ...data, id });
      return id;
    } catch (error) {
      console.error(`Error creando documento en ${collectionName}:`, error);
      throw error;
    }
  },

  async deleteDocument(collectionName, id) {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error(`Error eliminando documento ${id} en ${collectionName}:`, error);
      throw error;
    }
  },

  async getUsers() {
    return this.getCollection("users", "name");
  },

  async getProducts() {
    return this.getCollection("products", "name");
  },

  async getOrders() {
    return this.getCollection("orders", "createdAt");
  },

  async getCategories() {
    return this.getCollection("categories", "name");
  },

  async saveUsers(users) {
    await Promise.all(
      users.map((user) => this.saveDocument("users", user.id, user)),
    );
  },

  async saveProducts(products) {
    await Promise.all(
      products.map((product) => this.saveDocument("products", product.id, product)),
    );
  },

  async saveOrders(orders) {
    await Promise.all(
      orders.map((order) => this.saveDocument("orders", order.id, order)),
    );
  },

  async initialize() {
    await this.seedCategories();
    await this.seedProducts();
    await this.seedOrders();
  },

  async seedCategories() {
    const existing = await this.getCategories();
    if (existing.length) {
      return;
    }
    await Promise.all(
      this.categories.map((name) =>
        this.addDocument("categories", {
          id: this.generateId(),
          name,
        }),
      ),
    );
  },

  async seedProducts() {
    const existing = await this.getProducts();
    if (existing.length) {
      return;
    }

    const defaultProducts = [
      {
        name: "Filtro de agua doméstico",
        description: "Filtro de alto rendimiento para agua potable en el hogar.",
        price: 120,
        category: "Filtros",
        imageUrl:
          "https://images.unsplash.com/photo-1516594798943-7faf0f1b0a98?auto=format&fit=crop&w=400&q=80",
        stock: 16,
      },
      {
        name: "Recambio de cartucho",
        description: "Cartucho de repuesto compatible con filtros domésticos.",
        price: 28,
        category: "Recambios",
        imageUrl:
          "https://images.unsplash.com/photo-1581091870622-41f12aa762cd?auto=format&fit=crop&w=400&q=80",
        stock: 22,
      },
      {
        name: "Bomba de presión",
        description: "Bomba para garantizar flujo estable en sistemas de filtrado.",
        price: 200,
        category: "Bombas",
        imageUrl:
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80",
        stock: 8,
      },
      {
        name: "Kit de conexión",
        description: "Accesorios para instalación de filtros y tuberías de agua.",
        price: 45,
        category: "Accesorios",
        imageUrl:
          "https://images.unsplash.com/photo-1580281657524-5f2d45dd9d03?auto=format&fit=crop&w=400&q=80",
        stock: 12,
      },
    ];

    await Promise.all(
      defaultProducts.map((product) =>
        this.addDocument("products", {
          id: this.generateId(),
          ...product,
        }),
      ),
    );
  },

  async seedOrders() {
    const existing = await this.getOrders();
    if (existing.length) {
      return;
    }

    const products = await this.getProducts();
    if (products.length < 3) {
      return;
    }

    const firstOrderId = this.generateId();
    const secondOrderId = this.generateId();

    const firstOrder = {
      id: firstOrderId,
      customerId: this.generateId(),
      customerName: "Tienda Central",
      total: 440,
      status: "pendiente",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    };

    const secondOrder = {
      id: secondOrderId,
      customerId: this.generateId(),
      customerName: "Comercial Aqua",
      total: 140,
      status: "enviado",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    };

    await this.saveDocument("orders", firstOrder.id, firstOrder);
    await this.saveDocument("orders", secondOrder.id, secondOrder);

    await Promise.all([
      this.addDocument("orderItems", {
        id: this.generateId(),
        orderId: firstOrderId,
        productId: products[0].id,
        quantity: 2,
        priceAtPurchase: products[0].price,
      }),
      this.addDocument("orderItems", {
        id: this.generateId(),
        orderId: firstOrderId,
        productId: products[2].id,
        quantity: 1,
        priceAtPurchase: products[2].price,
      }),
      this.addDocument("orderItems", {
        id: this.generateId(),
        orderId: secondOrderId,
        productId: products[1].id,
        quantity: 5,
        priceAtPurchase: products[1].price,
      }),
    ]);
  },
};

export { FiltroStorage };
