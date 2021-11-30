import Cookies from 'js-cookie';
import {
  maassOn,
  addClass,
  loadCSS,
  removeClass,
  onLocationChangeListener,
} from './DOMHelpers';
import {
  body,
  widgetHolder,
  createBubbleHolder,
  createBubbleIcon,
  bubbleImg,
  chatBubble,
  closeBubble,
  bubbleHolder,
  createNotificationBubble,
  onClickChatBubble,
  onBubbleClick,
  setBubbleText,
} from './bubbleHelpers';
import { dispatchWindowEvent } from 'shared/helpers/CustomEventHelper';

const EVENT_NAME = 'maas:ready';

export const IFrameHelper = {
  getUrl({ baseUrl, websiteToken }) {
    return `${baseUrl}/widget?website_token=${websiteToken}`;
  },
  createFrame: ({ baseUrl, websiteToken }) => {
    if (IFrameHelper.getAppFrame()) {
      return;
    }

    loadCSS();
    const iframe = document.createElement('iframe');
    const cwCookie = Cookies.get('cw_conversation');
    let widgetUrl = IFrameHelper.getUrl({ baseUrl, websiteToken });
    if (cwCookie) {
      widgetUrl = `${widgetUrl}&cw_conversation=${cwCookie}`;
    }
    iframe.src = widgetUrl;

    iframe.id = 'maas_live_chat_widget';
    iframe.style.visibility = 'hidden';

    let holderClassName = `maass-widget-holder maass--hide maass-elements--${window.$maas.position}`;
    if (window.$maas.hideMessageBubble) {
      holderClassName += ` maass-widget--without-bubble`;
    }
    addClass(widgetHolder, holderClassName);
    widgetHolder.appendChild(iframe);
    body.appendChild(widgetHolder);
    IFrameHelper.initPostMessageCommunication();
    IFrameHelper.initWindowSizeListener();
    IFrameHelper.preventDefaultScroll();
  },
  getAppFrame: () => document.getElementById('maas_live_chat_widget'),
  getBubbleHolder: () => document.getElementsByClassName('maass--bubble-holder'),
  sendMessage: (key, value) => {
    const element = IFrameHelper.getAppFrame();
    element.contentWindow.postMessage(
      `maas-widget:${JSON.stringify({ event: key, ...value })}`,
      '*'
    );
  },
  initPostMessageCommunication: () => {
    window.onmessage = e => {
      if (
        typeof e.data !== 'string' ||
        e.data.indexOf('maas-widget:') !== 0
      ) {
        return;
      }
      const message = JSON.parse(e.data.replace('maas-widget:', ''));
      if (typeof IFrameHelper.events[message.event] === 'function') {
        IFrameHelper.events[message.event](message);
      }
    };
  },
  initWindowSizeListener: () => {
    maassOn(window, 'resize', () => IFrameHelper.toggleCloseButton());
  },
  preventDefaultScroll: () => {
    widgetHolder.addEventListener('wheel', event => {
      const deltaY = event.deltaY;
      const contentHeight = widgetHolder.scrollHeight;
      const visibleHeight = widgetHolder.offsetHeight;
      const scrollTop = widgetHolder.scrollTop;

      if (
        (scrollTop === 0 && deltaY < 0) ||
        (visibleHeight + scrollTop === contentHeight && deltaY > 0)
      ) {
        event.preventDefault();
      }
    });
  },

  setFrameHeightToFitContent: (extraHeight, isFixedHeight) => {
    const iframe = IFrameHelper.getAppFrame();
    const updatedIframeHeight = isFixedHeight ? `${extraHeight}px` : '100%';

    if (iframe)
      iframe.setAttribute('style', `height: ${updatedIframeHeight} !important`);
  },

  events: {
    loaded: message => {
      Cookies.set('cw_conversation', message.config.authToken, {
        expires: 365,
        sameSite: 'Lax',
      });
      window.$maas.hasLoaded = true;
      IFrameHelper.sendMessage('config-set', {
        locale: window.$maas.locale,
        position: window.$maas.position,
        hideMessageBubble: window.$maas.hideMessageBubble,
        showPopoutButton: window.$maas.showPopoutButton,
      });
      IFrameHelper.onLoad({
        widgetColor: message.config.channelConfig.widgetColor,
      });
      IFrameHelper.toggleCloseButton();

      if (window.$maas.user) {
        IFrameHelper.sendMessage('set-user', window.$maas.user);
      }
      dispatchWindowEvent(EVENT_NAME);
    },

    setBubbleLabel(message) {
      if (window.$maas.hideMessageBubble) {
        return;
      }
      setBubbleText(window.$maas.launcherTitle || message.label);
    },

    toggleBubble: state => {
      let bubbleState = {};
      if (state === 'open') {
        bubbleState.toggleValue = true;
      } else if (state === 'close') {
        bubbleState.toggleValue = false;
      }

      onBubbleClick(bubbleState);
    },

    onBubbleToggle: isOpen => {
      IFrameHelper.sendMessage('toggle-open', { isOpen });
      if (!isOpen) {
        IFrameHelper.events.resetUnreadMode();
      } else {
        IFrameHelper.pushEvent('webwidget.triggered');
      }
    },
    onLocationChange: ({ referrerURL, referrerHost }) => {
      IFrameHelper.sendMessage('change-url', {
        referrerURL,
        referrerHost,
      });
    },

    setUnreadMode: message => {
      const { unreadMessageCount } = message;
      const { isOpen } = window.$maas;
      const toggleValue = true;

      if (!isOpen && unreadMessageCount > 0) {
        IFrameHelper.sendMessage('set-unread-view');
        onBubbleClick({ toggleValue });
        const holderEl = document.querySelector('.maass-widget-holder');
        addClass(holderEl, 'has-unread-view');
      }
    },

    setCampaignMode: () => {
      const { isOpen } = window.$maas;
      const toggleValue = true;
      if (!isOpen) {
        onBubbleClick({ toggleValue });
        const holderEl = document.querySelector('.maass-widget-holder');
        addClass(holderEl, 'has-unread-view');
      }
    },

    updateIframeHeight: message => {
      const { extraHeight = 0, isFixedHeight } = message;
      if (!extraHeight) return;

      IFrameHelper.setFrameHeightToFitContent(extraHeight, isFixedHeight);
    },

    resetUnreadMode: () => {
      IFrameHelper.sendMessage('unset-unread-view');
      IFrameHelper.events.removeUnreadClass();
    },

    removeUnreadClass: () => {
      const holderEl = document.querySelector('.maass-widget-holder');
      removeClass(holderEl, 'has-unread-view');
    },

    closeChat: () => {
      onBubbleClick({ toggleValue: false });
    },
  },
  pushEvent: eventName => {
    IFrameHelper.sendMessage('push-event', { eventName });
  },

  onLoad: ({ widgetColor }) => {
    const iframe = IFrameHelper.getAppFrame();
    iframe.style.visibility = '';
    iframe.setAttribute('id', `maas_live_chat_widget`);

    if (IFrameHelper.getBubbleHolder().length) {
      return;
    }
    createBubbleHolder();
    onLocationChangeListener();
    if (!window.$maas.hideMessageBubble) {
      const chatIcon = createBubbleIcon({
        className: 'maass-widget-bubble',
        src: bubbleImg,
        target: chatBubble,
      });

      const closeIcon = closeBubble;
      const closeIconclassName = `maass-elements--${window.$maas.position} maass-widget-bubble maass--close maass--hide`;
      addClass(closeIcon, closeIconclassName);

      chatIcon.style.background = widgetColor;
      closeIcon.style.background = widgetColor;

      bubbleHolder.appendChild(chatIcon);
      bubbleHolder.appendChild(closeIcon);
      bubbleHolder.appendChild(createNotificationBubble());
      onClickChatBubble();
    }
  },
  toggleCloseButton: () => {
    if (window.matchMedia('(max-width: 668px)').matches) {
      IFrameHelper.sendMessage('toggle-close-button', {
        showClose: true,
      });
    } else {
      IFrameHelper.sendMessage('toggle-close-button', {
        showClose: false,
      });
    }
  },
};
