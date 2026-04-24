const FiltroApp = {
  init() {
    FiltroStorage.initialize();
    FiltroAuth.init();
    FiltroUI.init();
    if (!FiltroAuth.isAuthenticated) {
      FiltroUI.showLoginPanel();
    }
  },
};

FiltroApp.init();
