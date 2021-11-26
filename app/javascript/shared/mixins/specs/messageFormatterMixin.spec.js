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
      '<b>Maas is an opensource tool. https://www.maas.work</b>';
    expect(wrapper.vm.getPlainText(message)).toMatch(
      'Maas is an opensource tool. https://www.maas.work'
    );
  });

  it('stripStyleCharacters returns message without style tags', () => {
    const Component = {
      render() {},
      mixins: [messageFormatterMixin],
    };
    const wrapper = shallowMount(Component);
    const message =
      '<b style="max-width:100%">Maas is an opensource tool. https://www.maas.work</b><style type="css">.message{}</style>';
    expect(wrapper.vm.stripStyleCharacters(message)).toMatch(
      '<b>Maas is an opensource tool. https://www.maas.work</b>'
    );
  });
});
