<template>
  <div class="image message-text__wrap">
    <img :src="url" @click="onClick" />
    <maass-modal :full-width="true" :show.sync="show" :on-close="onClose">
      <img :src="url" class="modal-image" />
    </maass-modal>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    onClose() {
      this.show = false;
    },
    onClick() {
      this.show = true;
    },
  },
};
</script>
