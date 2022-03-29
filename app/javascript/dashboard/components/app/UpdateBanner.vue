<template>
  <banner
    v-if="shouldShowBanner"
    class="update-banner"
    color-scheme="primary"
    :banner-message="bannerMessage"
    href-link="https://github.com/entttom/chattlin/releases"
    :href-link-text="$t('GENERAL_SETTINGS.LEARN_MORE')"
    has-close-button
    @close="dismissUpdateBanner"
  />
</template>
<script>
import Banner from 'dashboard/components/ui/Banner.vue';
import LocalStorage from '../../helper/localStorage';
import { mapGetters } from 'vuex';
import adminMixin from 'dashboard/mixins/isAdmin';

const semver = require('semver');
const dismissedUpdates = new LocalStorage('dismissedUpdates');

export default {
  components: {
    Banner,
  },
  mixins: [adminMixin],
  props: {
    latestChattlinVersion: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters({ globalConfig: 'globalConfig/get' }),
    hasAnUpdateAvailable() {
      if (!semver.valid(this.latestChattlinVersion)) {
        return false;
      }
      return semver.lt(
        this.globalConfig.appVersion,
        this.latestChattlinVersion
      );
    },
    bannerMessage() {
      return this.$t('GENERAL_SETTINGS.UPDATE_CHATTLIN', {
        latestChattlinVersion: this.latestChattlinVersion,
      });
    },
    shouldShowBanner() {
      return (
        this.globalConfig.displayManifest &&
        this.hasAnUpdateAvailable &&
        !this.isVersionNotificationDismissed(this.latestChattlinVersion) &&
        this.isAdmin
      );
    },
  },
  methods: {
    isVersionNotificationDismissed(version) {
      return dismissedUpdates.get().includes(version);
    },
    dismissUpdateBanner() {
      let updatedDismissedItems = dismissedUpdates.get();
      if (updatedDismissedItems instanceof Array) {
        updatedDismissedItems.push(this.latestChattlinVersion);
      } else {
        updatedDismissedItems = [this.latestChattlinVersion];
      }
      dismissedUpdates.store(updatedDismissedItems);
      this.latestChattlinVersion = this.globalConfig.appVersion;
    },
  },
};
</script>
