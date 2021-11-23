export default {
  computed: {
    hostURL() {
      return window.maasConfig.hostURL;
    },
    vapidPublicKey() {
      return window.maasConfig.vapidPublicKey;
    },
    enabledLanguages() {
      return window.maasConfig.enabledLanguages;
    },
  },
};
