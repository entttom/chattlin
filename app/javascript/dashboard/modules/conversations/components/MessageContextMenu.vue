<template>
  <div class="context-menu">
    <maass-button
      icon="ion-more"
      size="large"
      class="button--delete-message"
      color-scheme="secondary"
      variant="link"
      @click="handleContextMenuClick"
    />
    <div
      v-if="isOpen"
      v-on-clickaway="handleContextMenuClick"
      class="dropdown-pane dropdown-pane--open"
      :class="`dropdown-pane--${menuPosition}`"
    >
      <maass-dropdown-menu>
        <maass-dropdown-item v-if="showCopy">
          <maass-button
            variant="clear"
            size="small"
            icon="ion-ios-copy-outline"
            @click="handleCopy"
          >
            {{ $t('CONVERSATION.CONTEXT_MENU.COPY') }}
          </maass-button>
        </maass-dropdown-item>
        <maass-dropdown-item>
          <maass-button
            variant="clear"
            color-scheme="alert"
            size="small"
            icon="ion-trash-a"
            @click="handleDelete"
          >
            {{ $t('CONVERSATION.CONTEXT_MENU.DELETE') }}
          </maass-button>
        </maass-dropdown-item>
      </maass-dropdown-menu>
    </div>
  </div>
</template>
<script>
import { mixin as clickaway } from 'vue-clickaway';

import MaassDropdownItem from 'shared/components/ui/dropdown/DropdownItem';
import MaassDropdownMenu from 'shared/components/ui/dropdown/DropdownMenu';

export default {
  components: {
    MaassDropdownMenu,
    MaassDropdownItem,
  },
  mixins: [clickaway],
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    showCopy: {
      type: Boolean,
      default: false,
    },
    menuPosition: {
      type: String,
      default: 'left',
    },
  },
  methods: {
    handleContextMenuClick() {
      this.$emit('toggle', !this.isOpen);
    },
    handleCopy() {
      this.$emit('copy');
    },
    handleDelete() {
      this.$emit('delete');
    },
  },
};
</script>
<style lang="scss" scoped>
/* TDOD: Remove once MenuComponent supports postions */
.dropdown-pane {
  bottom: var(--space-medium);
}
.dropdown-pane--left {
  right: var(--space-small);
}
.dropdown-pane--right {
  left: var(--space-small);
}
</style>
