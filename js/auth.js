import { FiltroStorage } from "./storage.js";

const FiltroAuth = {
  currentUser: null,

  async init() {
    const session = FiltroStorage.getSession();
    if (session) {
      this.currentUser = session;
    }
  },

  async login(email, password) {
    const users = await FiltroStorage.getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Credenciales inválidas");
    }
    this.currentUser = {
      uid: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    FiltroStorage.saveSession(this.currentUser);
    return this.currentUser;
  },

  async register(name, email, password, role) {
    const users = await FiltroStorage.getUsers();
    if (users.find((u) => u.email === email)) {
      throw new Error("Usuario ya existe");
    }
    const newUser = {
      id: FiltroStorage.generateId(),
      name,
      email,
      password,
      role,
    };
    users.push(newUser);
    await FiltroStorage.saveUsers(users);
    this.currentUser = {
      uid: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    FiltroStorage.saveSession(this.currentUser);
    return this.currentUser;
  },

  async logout() {
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

export { FiltroAuth };
