import MessageFormatter from '../MessageFormatter';

describe('#MessageFormatter', () => {
  describe('content with links', () => {
    it('should format correctly', () => {
      const message =
        'Chattlin is an opensource tool. [Chattlin](https://www.chattlin.com)';
      expect(new MessageFormatter(message).formattedMessage).toMatch(
        '<p>Chattlin is an opensource tool. <a rel="noreferrer noopener nofollow" href="https://www.chattlin.com" class="link" title="" target="_blank">Chattlin</a></p>'
      );
    });
    it('should format correctly', () => {
      const message =
        'Chattlin is an opensource tool. https://www.chattlin.com';
      expect(new MessageFormatter(message).formattedMessage).toMatch(
        '<p>Chattlin is an opensource tool. <a rel="noreferrer noopener nofollow" href="https://www.chattlin.com" class="link" title="" target="_blank">https://www.chattlin.com</a></p>'
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
      const message = 'Chattlin is an opensource tool';
      expect(new MessageFormatter(message).formattedMessage).toMatch(message);
    });

    it('should add links to @mentions', () => {
      const message =
        '@chattlinapp is an opensource tool thanks @longnonexistenttwitterusername';
      expect(new MessageFormatter(message, true).formattedMessage).toMatch(
        '<p><a href="http://twitter.com/chattlinapp" target="_blank" rel="noreferrer nofollow noopener">@chattlinapp</a> is an opensource tool thanks @longnonexistenttwitterusername</p>'
      );
    });

    it('should add links to #tags', () => {
      const message = '#chattlinapp is an opensource tool';
      expect(new MessageFormatter(message, true).formattedMessage).toMatch(
        '<p><a href="https://twitter.com/hashtag/chattlinapp" target="_blank" rel="noreferrer nofollow noopener">#chattlinapp</a> is an opensource tool</p>'
      );
    });
  });

  describe('plain text content', () => {
    it('returns the plain text without HTML', () => {
      const message =
        '<b>Chattlin is an opensource tool. https://www.chattlin.com</b>';
      expect(new MessageFormatter(message).plainText).toMatch(
        'Chattlin is an opensource tool. https://www.chattlin.com'
      );
    });
  });
});
