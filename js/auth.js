const FiltroAuth = {
  currentUser: null,

  init() {
    this.currentUser = FiltroStorage.getSession();
  },

  login(email, password) {
    const users = FiltroStorage.getUsers();
    const user = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user || user.password !== password) {
      throw new Error("Usuario o contraseña inválidos.");
    }
    this.currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    FiltroStorage.saveSession(this.currentUser);
    return this.currentUser;
  },

  register(name, email, password, role) {
    const users = FiltroStorage.getUsers();
    if (
      users.some((item) => item.email.toLowerCase() === email.toLowerCase())
    ) {
      throw new Error("Ya existe un usuario con ese email.");
    }
    const newUser = {
      id: FiltroStorage.generateId(),
      name,
      email,
      password,
      role,
    };
    users.push(newUser);
    FiltroStorage.saveUsers(users);
    return newUser;
  },

  logout() {
    this.currentUser = null;
    FiltroStorage.saveSession(null);
  },

  get isAuthenticated() {
    return Boolean(this.currentUser);
  },

  hasRole(role) {
    return this.currentUser?.role === role;
  },
};
