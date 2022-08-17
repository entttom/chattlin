import { shallowMount } from '@vue/test-utils';
import messageFormatterMixin from '../messageFormatterMixin';

describe('messageFormatterMixin', () => {
  it('returns correct plain text', () => {
    const Component = {
      render() {},
      mixins: [messageFormatterMixin],
    };
    const wrapper = shallowMount(Component);
    const message =
      '<b>Chattlin is an opensource tool. https://www.chattlin.com</b>';
    expect(wrapper.vm.getPlainText(message)).toMatch(
      'Chattlin is an opensource tool. https://www.chattlin.com'
    );
  });
});
