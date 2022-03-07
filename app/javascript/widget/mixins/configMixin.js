export default {
  computed: {
    useInboxAvatarForBot() {
      return window.chattlinWidgetDefaults.useInboxAvatarForBot;
    },
    hasAConnectedAgentBot() {
      return !!window.chattlinWebChannel.hasAConnectedAgentBot;
    },
    inboxAvatarUrl() {
      return window.chattlinWebChannel.avatarUrl;
    },
    channelConfig() {
      return window.chattlinWebChannel;
    },
    hasEmojiPickerEnabled() {
      return this.channelConfig.enabledFeatures.includes('emoji_picker');
    },
    hasAttachmentsEnabled() {
      return this.channelConfig.enabledFeatures.includes('attachments');
    },
    preChatFormEnabled() {
      return window.chattlinWebChannel.preChatFormEnabled;
    },
    preChatFormOptions() {
      let requireEmail = false;
      let preChatMessage = '';
      const options = window.chattlinWebChannel.preChatFormOptions || {};
      requireEmail = options.require_email;
      preChatMessage = options.pre_chat_message;
      return {
        requireEmail,
        preChatMessage,
      };
    },
  },
};
