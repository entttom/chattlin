<template>
  <transition name="menu-slide">
    <div
      v-if="show"
      v-on-clickaway="() => $emit('close')"
      class="dropdown-pane dropdowm--top"
    >
      <maass-dropdown-menu>
        <maass-dropdown-item v-if="showChangeAccountOption">
          <maass-button
            variant="clear"
            size="small"
            class=" change-accounts--button"
            @click="$emit('toggle-accounts')"
          >
            {{ $t('SIDEBAR_ITEMS.CHANGE_ACCOUNTS') }}
          </maass-button>
        </maass-dropdown-item>
        <maass-dropdown-item v-if="globalConfig.maasInboxToken">
          <maass-button
            variant="clear"
            size="small"
            class=" change-accounts--button"
            @click="$emit('show-support-chat-window')"
          >
            Contact Support
          </maass-button>
        </maass-dropdown-item>
        <maass-dropdown-item>
          <maass-button
            variant="clear"
            size="small"
            class=" change-accounts--button"
            @click="$emit('key-shortcut-modal')"
          >
            {{ $t('SIDEBAR_ITEMS.KEYBOARD_SHORTCUTS') }}
          </maass-button>
        </maass-dropdown-item>
        <maass-dropdown-item>
          <router-link
            :to="`/app/accounts/${accountId}/profile/settings`"
            class="button clear small change-accounts--button"
          >
            {{ $t('SIDEBAR_ITEMS.PROFILE_SETTINGS') }}
          </router-link>
        </maass-dropdown-item>
        <maass-dropdown-item>
          <maass-button
            variant="clear"
            size="small"
            class=" change-accounts--button"
            @click="logout"
          >
            {{ $t('SIDEBAR_ITEMS.LOGOUT') }}
          </maass-button>
        </maass-dropdown-item>
      </maass-dropdown-menu>
    </div>
  </transition>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';
import { mapGetters } from 'vuex';
import Auth from '../../../api/auth';
import MaassDropdownItem from 'shared/components/ui/dropdown/DropdownItem.vue';
import MaassDropdownMenu from 'shared/components/ui/dropdown/DropdownMenu.vue';

export default {
  components: {
    MaassDropdownMenu,
    MaassDropdownItem,
  },
  mixins: [clickaway],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
      globalConfig: 'globalConfig/get',
      accountId: 'getCurrentAccountId',
    }),
    showChangeAccountOption() {
      if (this.globalConfig.createNewAccountFromDashboard) {
        return true;
      }
      return this.currentUser.accounts.length > 1;
    },
  },
  methods: {
    logout() {
      Auth.logout();
    },
  },
};
</script>
<style lang="scss" scoped>
.dropdown-pane {
  right: 0;
}
</style>
