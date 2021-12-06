export default {
  methods: {
    useInstallationName(str = '', installationName) {
      return str.replace(/Chattlin/g, installationName);
    },
  },
};
