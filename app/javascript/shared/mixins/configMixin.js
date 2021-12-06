export default {
  computed: {
    hostURL() {
      return window.chattlinConfig.hostURL;
    },
    vapidPublicKey() {
      return window.chattlinConfig.vapidPublicKey;
    },
    enabledLanguages() {
      return window.chattlinConfig.enabledLanguages;
    },
  },
};
