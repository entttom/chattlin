import MaassKeyboardShortcutModal from './MaassKeyShortcutModal.vue';

export default {
  title: 'Components/Shortcuts/Keyboard Shortcut',
  component: MaassKeyboardShortcutModal,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MaassKeyboardShortcutModal },
  template:
    '<woot-keyboard-shortcut-modal v-bind="$props"></woot-keyboard-shortcut-modal>',
});

export const KeyboardShortcut = Template.bind({});
KeyboardShortcut.args = {};
