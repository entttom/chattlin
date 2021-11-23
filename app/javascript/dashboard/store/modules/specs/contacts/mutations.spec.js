import types from '../../../mutation-types';
import Contacts from '../../contacts';
const { mutations } = Contacts;

describe('#mutations', () => {
  describe('#SET_CONTACTS', () => {
    it('set contact records', () => {
      const state = { records: {} };
      mutations[types.SET_CONTACTS](state, [
        { id: 2, name: 'contact2', email: 'contact2@maas.work' },
        { id: 1, name: 'contact1', email: 'contact1@maas.work' },
      ]);
      expect(state.records).toEqual({
        1: {
          id: 1,
          name: 'contact1',
          email: 'contact1@maas.work',
        },
        2: {
          id: 2,
          name: 'contact2',
          email: 'contact2@maas.work',
        },
      });
      expect(state.sortOrder).toEqual([2, 1]);
    });
  });

  describe('#SET_CONTACT_ITEM', () => {
    it('push contact data to the store', () => {
      const state = {
        records: {
          1: { id: 1, name: 'contact1', email: 'contact1@maas.work' },
        },
        sortOrder: [1],
      };
      mutations[types.SET_CONTACT_ITEM](state, {
        id: 2,
        name: 'contact2',
        email: 'contact2@maas.work',
      });
      expect(state.records).toEqual({
        1: { id: 1, name: 'contact1', email: 'contact1@maas.work' },
        2: { id: 2, name: 'contact2', email: 'contact2@maas.work' },
      });
      expect(state.sortOrder).toEqual([1, 2]);
    });
  });

  describe('#EDIT_CONTACT', () => {
    it('update contact', () => {
      const state = {
        records: {
          1: { id: 1, name: 'contact1', email: 'contact1@maas.work' },
        },
      };
      mutations[types.EDIT_CONTACT](state, {
        id: 1,
        name: 'contact2',
        email: 'contact2@maas.work',
      });
      expect(state.records).toEqual({
        1: { id: 1, name: 'contact2', email: 'contact2@maas.work' },
      });
    });
  });
});
