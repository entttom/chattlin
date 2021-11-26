import MessageFormatter from '../MessageFormatter';

describe('#MessageFormatter', () => {
  describe('content with links', () => {
    it('should format correctly', () => {
      const message =
        'Maas is an opensource tool. [Maas](https://www.maas.work)';
      expect(new MessageFormatter(message).formattedMessage).toMatch(
        '<p>Maas is an opensource tool. <a rel="noreferrer noopener nofollow" href="https://www.maas.work" class="link" title="" target="_blank">Maas</a></p>'
      );
    });
    it('should format correctly', () => {
      const message =
        'Maas is an opensource tool. https://www.maas.work';
      expect(new MessageFormatter(message).formattedMessage).toMatch(
        '<p>Maas is an opensource tool. <a rel="noreferrer noopener nofollow" href="https://www.maas.work" class="link" title="" target="_blank">https://www.maas.work</a></p>'
      );
    });
  });

  describe('parses heading to strong', () => {
    it('should format correctly', () => {
      const message = '### opensource \n ## tool';
      expect(new MessageFormatter(message).formattedMessage).toMatch(
        '<strong>opensource</strong><strong>tool</strong>'
      );
    });
  });

  describe('tweets', () => {
    it('should return the same string if not tags or @mentions', () => {
      const message = 'Maas is an opensource tool';
      expect(new MessageFormatter(message).formattedMessage).toMatch(message);
    });

    it('should add links to @mentions', () => {
      const message =
        '@maasapp is an opensource tool thanks @longnonexistenttwitterusername';
      expect(new MessageFormatter(message, true).formattedMessage).toMatch(
        '<p><a href="http://twitter.com/maasapp" target="_blank" rel="noreferrer nofollow noopener">@maasapp</a> is an opensource tool thanks @longnonexistenttwitterusername</p>'
      );
    });

    it('should add links to #tags', () => {
      const message = '#maasapp is an opensource tool';
      expect(new MessageFormatter(message, true).formattedMessage).toMatch(
        '<p><a href="https://twitter.com/hashtag/maasapp" target="_blank" rel="noreferrer nofollow noopener">#maasapp</a> is an opensource tool</p>'
      );
    });
  });

  describe('plain text content', () => {
    it('returns the plain text without HTML', () => {
      const message =
        '<b>Maas is an opensource tool. https://www.maas.work</b>';
      expect(new MessageFormatter(message).plainText).toMatch(
        'Maas is an opensource tool. https://www.maas.work'
      );
    });
  });
});
