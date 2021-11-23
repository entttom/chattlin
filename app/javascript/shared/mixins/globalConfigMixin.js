export default {
  methods: {
    useInstallationName(str = '', installationName) {
      return str.replace(/MaaS/g, installationName);
    },
  },
};
