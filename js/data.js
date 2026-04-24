const FiltroData = {
  getProducts(filterText = "", category = "") {
    let products = FiltroStorage.getProducts();
    if (filterText) {
      const query = filterText.toLowerCase();
      products = products.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }
    if (category) {
      products = products.filter((item) => item.category === category);
    }
    return products;
  },

  getProductById(id) {
    return FiltroStorage.getProducts().find((item) => item.id === id);
  },

  addProduct(product) {
    const products = FiltroStorage.getProducts();
    products.push(product);
    FiltroStorage.saveProducts(products);
  },

  updateProduct(updatedProduct) {
    const products = FiltroStorage.getProducts().map((item) =>
      item.id === updatedProduct.id ? updatedProduct : item,
    );
    FiltroStorage.saveProducts(products);
  },

  deleteProduct(id) {
    const products = FiltroStorage.getProducts().filter(
      (item) => item.id !== id,
    );
    FiltroStorage.saveProducts(products);
  },

  getOrders() {
    return FiltroStorage.getOrders().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  },

  addOrder(order) {
    const products = FiltroStorage.getProducts();
    order.items.forEach((item) => {
      const product = products.find(
        (productItem) => productItem.id === item.productId,
      );
      if (!product) {
        throw new Error("Producto no encontrado en el pedido.");
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}.`);
      }
      product.stock -= item.quantity;
    });
    FiltroStorage.saveProducts(products);
    const orders = FiltroStorage.getOrders();
    orders.push(order);
    FiltroStorage.saveOrders(orders);
  },

  updateOrderStatus(orderId, status) {
    const orders = FiltroStorage.getOrders().map((order) => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    });
    FiltroStorage.saveOrders(orders);
  },

  getUsers() {
    return FiltroStorage.getUsers();
  },

  updateUser(user) {
    const users = FiltroStorage.getUsers().map((item) =>
      item.id === user.id ? user : item,
    );
    FiltroStorage.saveUsers(users);
  },

  deleteUser(userId) {
    const users = FiltroStorage.getUsers().filter((item) => item.id !== userId);
    FiltroStorage.saveUsers(users);
  },

  getMetrics() {
    const products = FiltroStorage.getProducts();
    const orders = FiltroStorage.getOrders();
    const lowStock = products.filter((item) => item.stock <= 5);
    const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      lowStockCount: lowStock.length,
      revenue: revenue,
    };
  },

  getLowStockProducts() {
    return FiltroStorage.getProducts().filter((item) => item.stock <= 5);
  },

  getStockOverview() {
    return FiltroStorage.getProducts().map((item) => ({
      id: item.id,
      name: item.name,
      stock: item.stock,
      low: item.stock <= 5,
    }));
  },
};
