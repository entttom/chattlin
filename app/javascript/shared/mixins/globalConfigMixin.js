export default {
  methods: {
    useInstallationName(str = '', installationName) {
      return str.replace(/Maas/g, installationName);
    },
  },
};
