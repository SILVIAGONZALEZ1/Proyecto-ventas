import { FiltroStorage } from "./storage.js";
import { db } from "./firebase-config.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const FiltroData = {
  products: [],
  orders: [],
  users: [],
  categories: [],
  orderItems: [],
  updateHandler: null,

  async initRealtime() {
    await FiltroStorage.initialize();
    this.categories = await FiltroStorage.getCategories();
    await Promise.all([
      this.listenProducts(),
      this.listenOrders(),
      this.listenUsers(),
    ]);
  },

  setUpdateHandler(handler) {
    this.updateHandler = handler;
  },

  notifyUpdate() {
    if (typeof this.updateHandler === "function") {
      this.updateHandler();
    }
  },

  normalizeProduct(docData) {
    return {
      ...docData,
      image: docData.imageUrl || docData.image || "",
      category: docData.category || docData.categoryName || "",
    };
  },

  normalizeOrder(docData) {
    return {
      ...docData,
      customer: docData.customerName || docData.customer || "Cliente",
    };
  },

  listenProducts() {
    return new Promise((resolve, reject) => {
      const productsRef = collection(db, "products");
      const productsQuery = query(productsRef, orderBy("name", "asc"));
      onSnapshot(
        productsQuery,
        (snapshot) => {
          this.products = snapshot.docs.map((docSnap) =>
            this.normalizeProduct({ id: docSnap.id, ...docSnap.data() }),
          );
          this.notifyUpdate();
          resolve();
        },
        (error) => reject(error),
      );
    });
  },

  listenOrders() {
    return new Promise((resolve, reject) => {
      const ordersRef = collection(db, "orders");
      const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"));
      onSnapshot(
        ordersQuery,
        (snapshot) => {
          this.orders = snapshot.docs
            .map((docSnap) => this.normalizeOrder({ id: docSnap.id, ...docSnap.data() }))
            .sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
          this.notifyUpdate();
          resolve();
        },
        (error) => reject(error),
      );
    });
  },

  listenUsers() {
    return new Promise((resolve, reject) => {
      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, orderBy("name", "asc"));
      onSnapshot(
        usersQuery,
        (snapshot) => {
          this.users = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          this.notifyUpdate();
          resolve();
        },
        (error) => reject(error),
      );
    });
  },

  getProducts(filterText = "", category = "") {
    let products = [...this.products];
    if (filterText) {
      const queryText = filterText.toLowerCase();
      products = products.filter(
        (item) =>
          item.name.toLowerCase().includes(queryText) ||
          item.description.toLowerCase().includes(queryText),
      );
    }
    if (category) {
      products = products.filter((item) => item.category === category);
    }
    return products;
  },

  getProductById(id) {
    return this.products.find((item) => item.id === id);
  },

  async addProduct(product) {
    await FiltroStorage.saveDocument("products", product.id, {
      ...product,
      imageUrl: product.image,
    });
  },

  async updateProduct(updatedProduct) {
    await FiltroStorage.saveDocument("products", updatedProduct.id, {
      ...updatedProduct,
      imageUrl: updatedProduct.image,
    });
  },

  async deleteProduct(id) {
    await FiltroStorage.deleteDocument("products", id);
  },

  getOrders() {
    return [...this.orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  },

  async addOrder(order) {
    const products = [...this.products];
    for (const item of order.items) {
      const product = products.find((productItem) => productItem.id === item.productId);
      if (!product) {
        throw new Error("Producto no encontrado en el pedido.");
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}.`);
      }
      await this.updateProduct({ ...product, stock: product.stock - item.quantity });
    }

    const orderDoc = {
      id: order.id,
      customerId: order.customerId || FiltroStorage.generateId(),
      customerName: order.customer || order.customerName,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    };

    await FiltroStorage.saveDocument("orders", order.id, orderDoc);

    await Promise.all(
      order.items.map((item) =>
        FiltroStorage.addDocument("orderItems", {
          id: FiltroStorage.generateId(),
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase:
            this.getProductById(item.productId)?.price ?? item.priceAtPurchase,
        }),
      ),
    );
  },

  async updateOrderStatus(orderId, status) {
    const order = this.orders.find((item) => item.id === orderId);
    if (!order) {
      throw new Error("Pedido no encontrado.");
    }
    await FiltroStorage.saveDocument("orders", orderId, {
      ...order,
      status,
    });
  },

  getUsers() {
    return [...this.users];
  },

  async updateUser(user) {
    await FiltroStorage.saveDocument("users", user.id, user);
  },

  async deleteUser(userId) {
    await FiltroStorage.deleteDocument("users", userId);
  },

  getMetrics() {
    const products = [...this.products];
    const orders = [...this.orders];
    const lowStock = products.filter((item) => item.stock <= 5);
    const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      lowStockCount: lowStock.length,
      revenue,
    };
  },

  getLowStockProducts() {
    return this.products.filter((item) => item.stock <= 5);
  },

  getStockOverview() {
    return this.products.map((item) => ({
      id: item.id,
      name: item.name,
      stock: item.stock,
      low: item.stock <= 5,
    }));
  },
};

export { FiltroData };
