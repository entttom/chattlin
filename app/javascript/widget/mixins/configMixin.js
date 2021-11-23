export default {
  computed: {
    useInboxAvatarForBot() {
      return window.maasWidgetDefaults.useInboxAvatarForBot;
    },
    hasAConnectedAgentBot() {
      return !!window.maasWebChannel.hasAConnectedAgentBot;
    },
    inboxAvatarUrl() {
      return window.maasWebChannel.avatarUrl;
    },
    channelConfig() {
      return window.maasWebChannel;
    },
    hasEmojiPickerEnabled() {
      return this.channelConfig.enabledFeatures.includes('emoji_picker');
    },
    hasAttachmentsEnabled() {
      return this.channelConfig.enabledFeatures.includes('attachments');
    },
    preChatFormEnabled() {
      return window.maasWebChannel.preChatFormEnabled;
    },
    preChatFormOptions() {
      let requireEmail = false;
      let preChatMessage = '';
      const options = window.maasWebChannel.preChatFormOptions || {};
      if (!this.isOnNewConversation) {
        requireEmail = options.require_email;
        preChatMessage = options.pre_chat_message;
      }
      return {
        requireEmail,
        preChatMessage,
      };
    },
  },
};
