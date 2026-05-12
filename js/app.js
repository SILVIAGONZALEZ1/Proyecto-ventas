import { FiltroAuth } from "./auth.js";
import { FiltroData } from "./data.js";
import { FiltroUI } from "./ui.js";

const FiltroApp = {
  async init() {
    await FiltroAuth.init();
    // Temporarily set dummy user to bypass login
    // if (!FiltroAuth.isAuthenticated) {
    //   FiltroAuth.currentUser = {
    //     uid: 'dummy-admin',
    //     name: 'Admin',
    //     email: 'admin@filtros.com',
    //     role: 'administrador'
    //   };
    // }
    FiltroData.setUpdateHandler(() => FiltroUI.refreshViews());
    await FiltroData.initRealtime();
    FiltroUI.init();
    // Temporarily disabled login check
    if (!FiltroAuth.isAuthenticated) {
      FiltroUI.showLoginPanel();
    }
  },
};

FiltroApp.init();
