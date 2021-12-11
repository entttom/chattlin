import { actions } from '../../appConfig';

const commit = jest.fn();
describe('#actions', () => {
  describe('#setReferrerHost', () => {
    it('creates actions properly', () => {
      actions.setReferrerHost({ commit }, 'www.chattlin.com');
      expect(commit.mock.calls).toEqual([
        ['SET_REFERRER_HOST', 'www.chattlin.com'],
      ]);
    });
  });

  describe('#setWidgetColor', () => {
    it('creates actions properly', () => {
      actions.setWidgetColor({ commit }, { widgetColor: '#eaeaea' });
      expect(commit.mock.calls).toEqual([
        ['SET_WIDGET_COLOR', { widgetColor: '#eaeaea' }],
      ]);
    });
  });
});
