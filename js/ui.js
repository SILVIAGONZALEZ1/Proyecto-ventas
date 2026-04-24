const FiltroUI = {
  selectors: {
    views: document.querySelectorAll(".view"),
    navItems: document.querySelectorAll(".nav-item"),
    pageTitle: document.getElementById("pageTitle"),
    currentUserName: document.getElementById("currentUserName"),
    currentUserRole: document.getElementById("currentUserRole"),
    logoutBtn: document.getElementById("logoutBtn"),
    searchProduct: document.getElementById("searchProduct"),
    filterCategory: document.getElementById("filterCategory"),
    productsTable: document.querySelector("#productsTable tbody"),
    stockTable: document.querySelector("#stockTable tbody"),
    ordersTable: document.querySelector("#ordersTable tbody"),
    usersTable: document.querySelector("#usersTable tbody"),
    lowStockTable: document.querySelector("#lowStockTable tbody"),
    recentOrdersTable: document.querySelector("#recentOrdersTable tbody"),
    metricProducts: document.getElementById("metricProducts"),
    metricOrders: document.getElementById("metricOrders"),
    metricLowStock: document.getElementById("metricLowStock"),
    metricRevenue: document.getElementById("metricRevenue"),
    openProductFormBtn: document.getElementById("openProductFormBtn"),
    openOrderFormBtn: document.getElementById("openOrderFormBtn"),
    openUserFormBtn: document.getElementById("openUserFormBtn"),
    overlay: document.getElementById("overlay"),
    modalPanel: document.getElementById("modalPanel"),
    modalTitle: document.getElementById("modalTitle"),
    modalBody: document.getElementById("modalBody"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    notification: document.getElementById("notification"),
    loginContainer: document.getElementById("loginContainer"),
    loginForm: document.getElementById("loginForm"),
    registerForm: document.getElementById("registerForm"),
    showRegisterBtn: document.getElementById("showRegisterBtn"),
    showLoginBtn: document.getElementById("showLoginBtn"),
    registerSwitch: document.getElementById("registerSwitch"),
  },

  init() {
    this.bindNavigation();
    this.bindAuthForms();
    this.bindModalActions();
    this.bindProductFilters();
    this.updateUserInfo();
    this.renderCategoryOptions();
    this.refreshViews();
    this.showRoleAccess();
  },

  bindNavigation() {
    this.selectors.navItems.forEach((button) => {
      button.addEventListener("click", () => {
        this.selectors.navItems.forEach((item) =>
          item.classList.remove("active"),
        );
        button.classList.add("active");
        this.showView(button.dataset.view);
      });
    });
    this.selectors.logoutBtn.addEventListener("click", () => {
      FiltroAuth.logout();
      this.showLoginPanel();
    });
  },

  bindAuthForms() {
    this.selectors.loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = event.target.querySelector("#loginEmail").value.trim();
      const password = event.target
        .querySelector("#loginPassword")
        .value.trim();
      try {
        FiltroAuth.login(email, password);
        this.showNotification("Sesión iniciada correctamente.");
        this.closeLoginPanel();
        this.updateUserInfo();
        this.refreshViews();
      } catch (error) {
        this.showNotification(error.message, true);
      }
    });

    this.selectors.registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = event.target.querySelector("#registerName").value.trim();
      const email = event.target.querySelector("#registerEmail").value.trim();
      const password = event.target
        .querySelector("#registerPassword")
        .value.trim();
      const role = event.target.querySelector("#registerRole").value;
      try {
        FiltroAuth.register(name, email, password, role);
        this.showNotification("Usuario registrado con éxito. Inicia sesión.");
        this.toggleAuthForms("login");
      } catch (error) {
        this.showNotification(error.message, true);
      }
    });

    this.selectors.showRegisterBtn.addEventListener("click", () =>
      this.toggleAuthForms("register"),
    );
    this.selectors.showLoginBtn.addEventListener("click", () =>
      this.toggleAuthForms("login"),
    );
  },

  toggleAuthForms(mode) {
    const loginPanel = this.selectors.loginForm;
    const registerPanel = this.selectors.registerForm;
    const registerSwitch = this.selectors.registerSwitch;
    if (mode === "register") {
      loginPanel.classList.add("hidden");
      registerPanel.classList.remove("hidden");
      registerSwitch.classList.remove("hidden");
    } else {
      loginPanel.classList.remove("hidden");
      registerPanel.classList.add("hidden");
      registerSwitch.classList.add("hidden");
    }
  },

  bindModalActions() {
    this.selectors.closeModalBtn.addEventListener("click", () =>
      this.closeModal(),
    );
    this.selectors.overlay.addEventListener("click", () => this.closeModal());
    this.selectors.openProductFormBtn.addEventListener("click", () =>
      this.openProductForm(),
    );
    this.selectors.openOrderFormBtn.addEventListener("click", () =>
      this.openOrderForm(),
    );
    this.selectors.openUserFormBtn?.addEventListener("click", () =>
      this.openUserForm(),
    );
  },

  bindProductFilters() {
    this.selectors.searchProduct.addEventListener("input", () =>
      this.renderProducts(),
    );
    this.selectors.filterCategory.addEventListener("change", () =>
      this.renderProducts(),
    );
  },

  showView(viewId) {
    this.selectors.views.forEach((view) =>
      view.classList.toggle("active", view.id === `${viewId}View`),
    );
    const titleMap = {
      dashboard: "Dashboard",
      productos: "Productos",
      stock: "Stock",
      pedidos: "Pedidos",
      usuarios: "Usuarios",
    };
    this.selectors.pageTitle.textContent = titleMap[viewId] || "Dashboard";
    this.refreshViews();
  },

  updateUserInfo() {
    const user = FiltroAuth.currentUser;
    if (user) {
      this.selectors.currentUserName.textContent = user.name;
      this.selectors.currentUserRole.textContent =
        user.role === "administrador" ? "Administrador" : "Vendedor";
    }
  },

  renderCategoryOptions() {
    const categories = FiltroStorage.categories;
    this.selectors.filterCategory.innerHTML =
      '<option value="">Todas las categorías</option>' +
      categories
        .map((category) => `<option value="${category}">${category}</option>`)
        .join("");
  },

  refreshViews() {
    if (!FiltroAuth.isAuthenticated) {
      return;
    }
    this.renderDashboard();
    this.renderProducts();
    this.renderStock();
    this.renderOrders();
    this.renderUsers();
    this.showRoleAccess();
  },

  renderDashboard() {
    const metrics = FiltroData.getMetrics();
    this.selectors.metricProducts.textContent = metrics.totalProducts;
    this.selectors.metricOrders.textContent = metrics.totalOrders;
    this.selectors.metricLowStock.textContent = metrics.lowStockCount;
    this.selectors.metricRevenue.textContent = `$${metrics.revenue}`;

    const recentOrders = FiltroData.getOrders().slice(0, 5);
    this.selectors.recentOrdersTable.innerHTML = recentOrders
      .map(
        (order) =>
          `<tr><td>${order.id.slice(-6)}</td><td>${order.customer}</td><td>$${order.total}</td><td>${this.renderStatusLabel(order.status)}</td><td>${this.formatDate(order.createdAt)}</td></tr>`,
      )
      .join("");

    const lowProducts = FiltroData.getLowStockProducts();
    this.selectors.lowStockTable.innerHTML = lowProducts
      .map(
        (item) =>
          `<tr><td>${item.name}</td><td>${item.category}</td><td>${item.stock}</td></tr>`,
      )
      .join("");
  },

  renderProducts() {
    const filterText = this.selectors.searchProduct.value.trim();
    const category = this.selectors.filterCategory.value;
    const products = FiltroData.getProducts(filterText, category);
    this.selectors.productsTable.innerHTML = products
      .map((product) => {
        const lowClass = product.stock <= 5 ? "warning" : "";
        return `<tr>
          <td><strong>${product.name}</strong><br/><small>${product.description}</small></td>
          <td>${product.category}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td class="${lowClass}">${product.stock}</td>
          <td>
            <button class="btn btn-secondary" data-action="edit-product" data-id="${product.id}">Editar</button>
            <button class="btn btn-secondary" data-action="delete-product" data-id="${product.id}">Eliminar</button>
          </td>
        </tr>`;
      })
      .join("");
    this.selectors.productsTable
      .querySelectorAll('[data-action="edit-product"]')
      .forEach((button) => {
        button.addEventListener("click", () =>
          this.openProductForm(button.dataset.id),
        );
      });

    this.selectors.productsTable
      .querySelectorAll('[data-action="delete-product"]')
      .forEach((button) => {
        button.addEventListener("click", () => {
          if (confirm("¿Deseas eliminar este producto?")) {
            FiltroData.deleteProduct(button.dataset.id);
            this.showNotification("Producto eliminado.");
            this.refreshViews();
          }
        });
      });
  },

  renderStock() {
    const stockList = FiltroData.getStockOverview();
    this.selectors.stockTable.innerHTML = stockList
      .map(
        (item) =>
          `<tr><td>${item.name}</td><td>${item.stock}</td><td>${item.low ? '<strong style="color: var(--warning)">Bajo stock</strong>' : "Estable"}</td></tr>`,
      )
      .join("");
  },

  renderOrders() {
    const orders = FiltroData.getOrders();
    this.selectors.ordersTable.innerHTML = orders
      .map(
        (order) => `<tr>
        <td>${order.id.slice(-6)}</td>
        <td>${order.customer}</td>
        <td>$${Number(order.total).toFixed(2)}</td>
        <td>${this.renderStatusLabel(order.status)}</td>
        <td>${this.formatDate(order.createdAt)}</td>
        <td><button class="btn btn-secondary" data-action="change-status" data-id="${order.id}">Cambiar</button></td>
      </tr>`,
      )
      .join("");
    this.selectors.ordersTable
      .querySelectorAll('[data-action="change-status"]')
      .forEach((button) => {
        button.addEventListener("click", () => {
          const order = FiltroData.getOrders().find(
            (item) => item.id === button.dataset.id,
          );
          const nextStatus = this.getNextOrderStatus(order.status);
          if (confirm(`Cambiar estado a ${nextStatus}?`)) {
            FiltroData.updateOrderStatus(order.id, nextStatus);
            this.showNotification("Estado de pedido actualizado.");
            this.refreshViews();
          }
        });
      });
  },

  renderUsers() {
    if (!FiltroAuth.hasRole("administrador")) {
      return;
    }
    const users = FiltroData.getUsers();
    this.selectors.usersTable.innerHTML = users
      .map(
        (user) => `<tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="btn btn-secondary" data-action="delete-user" data-id="${user.id}">Eliminar</button>
        </td>
      </tr>`,
      )
      .join("");
    this.selectors.usersTable
      .querySelectorAll('[data-action="delete-user"]')
      .forEach((button) => {
        button.addEventListener("click", () => {
          if (confirm("Eliminar usuario de forma permanente?")) {
            FiltroData.deleteUser(button.dataset.id);
            this.showNotification("Usuario eliminado.");
            this.refreshViews();
          }
        });
      });
  },

  renderStatusLabel(status) {
    const label = {
      pendiente: "Pendiente",
      enviado: "Enviado",
      entregado: "Entregado",
    }[status];
    return `<span>${label}</span>`;
  },

  getNextOrderStatus(status) {
    if (status === "pendiente") return "enviado";
    if (status === "enviado") return "entregado";
    return "entregado";
  },

  formatDate(iso) {
    return new Date(iso).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  showNotification(message, isError = false) {
    const notification = this.selectors.notification;
    notification.textContent = message;
    notification.className = `notification show ${isError ? "error" : ""}`;
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => {
      notification.classList.remove("show");
    }, 2800);
  },

  showLoginPanel() {
    this.selectors.loginContainer.classList.remove("hidden");
    this.selectors.overlay.classList.remove("hidden");
    this.selectors.authForm = document.querySelector(".auth-form");
  },

  closeLoginPanel() {
    this.selectors.loginContainer.classList.add("hidden");
    this.selectors.overlay.classList.add("hidden");
  },

  openModal(title, contentHTML) {
    this.selectors.modalTitle.textContent = title;
    this.selectors.modalBody.innerHTML = contentHTML;
    this.selectors.modalPanel.classList.remove("hidden");
    this.selectors.overlay.classList.remove("hidden");
  },

  closeModal() {
    this.selectors.modalPanel.classList.add("hidden");
    this.selectors.overlay.classList.add("hidden");
    this.selectors.modalBody.innerHTML = "";
  },

  openProductForm(productId = "") {
    const product = productId ? FiltroData.getProductById(productId) : null;
    const title = product ? "Editar producto" : "Agregar producto";
    const content = `
      <form id="productForm" class="auth-form">
        <label>Nombre<input type="text" id="productName" value="${product?.name || ""}" required /></label>
        <label>Descripción<textarea id="productDescription" rows="3" required>${product?.description || ""}</textarea></label>
        <label>Precio<input type="number" id="productPrice" min="0" step="0.01" value="${product?.price || ""}" required /></label>
        <label>Categoría<select id="productCategory" required>${FiltroStorage.categories.map((category) => `<option value="${category}" ${product?.category === category ? "selected" : ""}>${category}</option>`).join("")}</select></label>
        <label>Imagen (URL)<input type="url" id="productImage" value="${product?.image || ""}" required /></label>
        <label>Stock<input type="number" id="productStock" min="0" step="1" value="${product?.stock ?? ""}" required /></label>
        <button type="submit" class="btn btn-primary">Guardar producto</button>
      </form>
    `;
    this.openModal(title, content);
    document
      .getElementById("productForm")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const data = {
          id: product?.id || FiltroStorage.generateId(),
          name: document.getElementById("productName").value.trim(),
          description: document
            .getElementById("productDescription")
            .value.trim(),
          price: Number(document.getElementById("productPrice").value),
          category: document.getElementById("productCategory").value,
          image: document.getElementById("productImage").value.trim(),
          stock: Number(document.getElementById("productStock").value),
        };
        if (!data.name || !data.description || !data.image) {
          this.showNotification("Completa todos los campos.", true);
          return;
        }
        if (product) {
          FiltroData.updateProduct(data);
          this.showNotification("Producto actualizado.");
        } else {
          FiltroData.addProduct(data);
          this.showNotification("Producto agregado.");
        }
        this.closeModal();
        this.refreshViews();
      });
  },

  openOrderForm() {
    const products = FiltroData.getProducts();
    const content = `
      <form id="orderForm" class="auth-form">
        <label>Cliente<input type="text" id="orderCustomer" required /></label>
        <div class="order-items">
          ${products
            .map(
              (product) => `
              <label class="order-item">
                <span>${product.name} ($${product.price})</span>
                <input type="number" min="0" max="${product.stock}" value="0" data-product-id="${product.id}" />
              </label>
            `,
            )
            .join("")}
        </div>
        <label>Total estimado<input type="text" id="orderTotal" value="$0.00" readonly /></label>
        <button type="submit" class="btn btn-primary">Generar pedido</button>
      </form>
    `;
    this.openModal("Nuevo pedido", content);
    const orderForm = document.getElementById("orderForm");
    const quantityInputs = orderForm.querySelectorAll("[data-product-id]");
    const totalField = document.getElementById("orderTotal");

    const updateTotal = () => {
      const total = Array.from(quantityInputs).reduce((sum, input) => {
        const product = products.find(
          (item) => item.id === input.dataset.productId,
        );
        return sum + product.price * Number(input.value);
      }, 0);
      totalField.value = `$${total.toFixed(2)}`;
    };
    quantityInputs.forEach((input) =>
      input.addEventListener("input", updateTotal),
    );

    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const customer = document.getElementById("orderCustomer").value.trim();
      const items = Array.from(quantityInputs)
        .map((input) => ({
          productId: input.dataset.productId,
          quantity: Number(input.value),
        }))
        .filter((item) => item.quantity > 0);
      if (!customer || !items.length) {
        this.showNotification(
          "Agrega un cliente y al menos un producto.",
          true,
        );
        return;
      }
      const total = items.reduce((sum, item) => {
        const product = products.find(
          (productItem) => productItem.id === item.productId,
        );
        return sum + product.price * item.quantity;
      }, 0);
      try {
        FiltroData.addOrder({
          id: FiltroStorage.generateId(),
          customer,
          items,
          total,
          status: "pendiente",
          createdAt: new Date().toISOString(),
        });
        this.showNotification("Pedido creado y stock actualizado.");
        this.closeModal();
        this.refreshViews();
      } catch (error) {
        this.showNotification(error.message, true);
      }
    });
  },

  openUserForm() {
    if (!FiltroAuth.hasRole("administrador")) {
      this.showNotification("No tienes permiso para crear usuarios.", true);
      return;
    }
    const content = `
      <form id="newUserForm" class="auth-form">
        <label>Nombre<input type="text" id="newUserName" required /></label>
        <label>Email<input type="email" id="newUserEmail" required /></label>
        <label>Contraseña<input type="password" id="newUserPassword" required minlength="4" /></label>
        <label>Rol<select id="newUserRole">
          <option value="vendedor">Vendedor</option>
          <option value="administrador">Administrador</option>
        </select></label>
        <button type="submit" class="btn btn-primary">Guardar usuario</button>
      </form>
    `;
    this.openModal("Nuevo usuario", content);
    document
      .getElementById("newUserForm")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("newUserName").value.trim();
        const email = document.getElementById("newUserEmail").value.trim();
        const password = document
          .getElementById("newUserPassword")
          .value.trim();
        const role = document.getElementById("newUserRole").value;
        try {
          FiltroAuth.register(name, email, password, role);
          this.showNotification("Usuario creado correctamente.");
          this.closeModal();
          this.refreshViews();
        } catch (error) {
          this.showNotification(error.message, true);
        }
      });
  },

  showRoleAccess() {
    const isAdmin = FiltroAuth.hasRole("administrador");
    const userNavButton = Array.from(this.selectors.navItems).find(
      (button) => button.dataset.view === "usuarios",
    );
    if (!isAdmin) {
      userNavButton?.classList.add("hidden");
      document.getElementById("usuariosView").classList.add("hidden");
    } else {
      userNavButton?.classList.remove("hidden");
      document.getElementById("usuariosView").classList.remove("hidden");
    }
  },
};
