import { addClass, removeClass, toggleClass, wootOn } from './DOMHelpers';
import { IFrameHelper } from './IFrameHelper';
import { BUBBLE_DESIGN } from './constants';

export const bubbleImg =
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAGdWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iNDgiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI0OCIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSI0OCIKICAgdGlmZjpJbWFnZVdpZHRoPSI0OCIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iMzAwLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjMwMC8xIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTA0LTI1VDE2OjE0OjAxKzAyOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNC0yNVQxNjoxNDowMSswMjowMCI+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+TG9nbzwvcmRmOmxpPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gKE1hciAzMSAyMDIwKSIKICAgICAgeG1wTU06d2hlbj0iMjAyMS0wNC0yMlQwODoyNDoxMiswMjowMCIvPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gKE1hciAzMSAyMDIwKSIKICAgICAgeG1wTU06d2hlbj0iMjAyMS0wNC0yMlQwODoyNDo0MiswMjowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgRGVzaWduZXIgMS4xMC4zIgogICAgICBzdEV2dDp3aGVuPSIyMDIyLTA0LTI1VDE2OjE0OjAxKzAyOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz7ZO0bGAAABgmlDQ1BzUkdCIElFQzYxOTY2LTIuMQAAKJF1kc8rRFEUxz8zRiM/GoWiLCYNqxkxamKjjISaNI1Rfm1mnvmhZsbrvSfJVtkqSmz8WvAXsFXWShEpWcqa2DA9581TI5lzO/d87vfec7r3XHDGc0ped/VAvmBosdGwd3pm1ut+xkUbtbQQSCi6OhSNRqhoH3c4rHgTsGpVPvev1S2kdAUcNcKDiqoZwmPCkRVDtXhbuFnJJhaET4X9mlxQ+NbSkza/WJyx+ctiLR4bBmejsDfzi5O/WMlqeWF5Ob58bln5uY/1kvpUYWpSYod4OzoxRgnjZZwRhgnRy4DMIQIE6ZYVFfJ7SvkTLEmuIrPKKhqLZMhi4Bd1WaqnJKZFT8nIsWr1/29f9XRf0K5eH4bqJ9N86wT3FhQ3TfPz0DSLR1D1CBeFcv7SAfS/i75Z1nz74FmHs8uyltyB8w1ofVATWqIkVYk702l4PYGGGWi6hto5u2c/+xzfQ3xNvuoKdvegS8575r8BXsdn4rhn99gAAAAJcEhZcwAALiMAAC4jAXilP3YAAARPSURBVGiB7ZhPaBxVHMc/MzvZ2e3MJmIyEZoVWtQeNFI864Lee+jBCnqwB0+CoN68vEI7Qk2lLRJBbET8W1BoCS2CIkUUUo2xRLFQtiaaVjTSF3Wb+DTZ7loPs7vdbGZ2Z3ZnE5D9QNjNzrzf+37f781v3nvQo0ePQIRUtwuptK3W0Qy9xfX9wKyQ6gkhlbEZgqLSygDAbuB94Ach1TNCqm1d1hSJVgZu1n3fAYwDV4RUB4RUg11TFYEwGWhkCDiIZ+S4kOrOmDVFoh0DVSzgOeBHIdXbQqr7YtIUiShTKAgDeBK4KKQ6K6R6qHNZ4Ym7suwB9gippoAx4CPXsf6NuY91xJEBPx4EzgDfC6n2C6mSbcZpSSfPQBjuBd4C5oVUzwup7Lg7aGpgdkntmi+sslrqeBZkgWPAVSHVISGV02nAKoHLhFxePlxcK52YvlK4B2Ao3Uc2Y5K1k4zYJs62vuDGrfkHeBM46jrWT+2HCTCQy8udwEyxWCpMLxTu8rvHTOiM2EmyGdP7tE1SRuQZWQY+BMZcx/ouamPwMZDLywxwHhgtFkvzQQb8GEr3eRnKmGRtEyfdhxY+TR/jVa7PXccKXTzWhc/lpQ6cAvYCFIuluemFwt2hJTSQrGbJNslmvKmXbp2lr/GMTIYpwY0GDgGi+n+nBvwYrGQpa5uMZEyGg7N0GXgZeNd1rLWgeLWmubx8DPig/mI3DDRSzVL1ecpuzNIicBx43XWs5cb2GkAuLx8ApoB0/cXNMODHYMqoPUfZTJLhdBJN4zrwGvCK61i/Ve/Vcnl5BzADbFhVbpWBRpIJje1W5TmykjeGreTJ20zjRdex5rSnfr7+tG1oj/s1/GO11P/Lamn3ZgtuhXYT7IS2pMM+Y3vKmAD2AY803qinmFsoljdfYR0aYBs6/ZU/O6FfshL6QeCU61glDaCyu5oBdtY3/qtUnvtmeW1Tp1BS12piB4wEmYSO7pWaL4DDwCf174laFRJSjQJfArUFV7cNaECmNroJ+g2dlL6hpp7Be1OfD4pRQ0i1Fzhd/T1uA2bd6PavH91GysBJ4IjrWBebxdzQXEh1AG/P25EBnVtzd6AyumaA2jpWgTfwFnkLYfrx25G5wP3Ao1F2M6auMVA3FWxDj7LZKACvAuOuY12L0K3/alRIZQFTK6WydcEnA7oGmcQtsSFH149FvH3CCb+3bBgCexVS7SjcKJ/9dmVtNFWbuwkGKqPb4XnjHHAEeKfZOicMTXU8u7j8QkrXDyfbG10/ZvFK4WnXsWJ5wTQ9leg3Er/H0QnwGfAS8GmUtX4YWh2rdNrZJF4N/6rDOIF048S5hHcYPOY61qUuxF9HnBn4G5gAjrmOdbV9SdGIIwN/4p1aj7uOtRRDvEh0koFfgaPAhOtYK/FJikY7GbiMV8Pf67SGx0GUDFzAq+GTcdXwOAiTgXN4Nfxc3DW86wipzK3W0KNHj/85/wFr8l0cSxU0ywAAAABJRU5ErkJggg=='
export const body = document.getElementsByTagName('body')[0];
export const widgetHolder = document.createElement('div');

export const bubbleHolder = document.createElement('div');
export const chatBubble = document.createElement('button');
export const closeBubble = document.createElement('button');
export const notificationBubble = document.createElement('span');

export const getBubbleView = type =>
  BUBBLE_DESIGN.includes(type) ? type : BUBBLE_DESIGN[0];
export const isExpandedView = type => getBubbleView(type) === BUBBLE_DESIGN[1];

export const setBubbleText = bubbleText => {
  if (isExpandedView(window.$chattlin.type)) {
    const textNode = document.getElementById('woot-widget--expanded__text');
    textNode.innerHTML = bubbleText;
  }
};

export const createBubbleIcon = ({ className, src, target }) => {
  let bubbleClassName = `${className} woot-elements--${window.$chattlin.position}`;
  const bubbleIcon = document.createElement('img');
  bubbleIcon.src = src;
  bubbleIcon.alt = 'bubble-icon';
  target.appendChild(bubbleIcon);

  if (isExpandedView(window.$chattlin.type)) {
    const textNode = document.createElement('div');
    textNode.id = 'woot-widget--expanded__text';
    textNode.innerHTML = '';
    target.appendChild(textNode);
    bubbleClassName += ' woot-widget--expanded';
  }

  target.className = bubbleClassName;
  return target;
};

export const createBubbleHolder = () => {
  addClass(bubbleHolder, 'woot--bubble-holder');
  body.appendChild(bubbleHolder);
};

export const createNotificationBubble = () => {
  addClass(notificationBubble, 'woot--notification');
  return notificationBubble;
};

export const onBubbleClick = (props = {}) => {
  const { toggleValue } = props;
  const { isOpen } = window.$chattlin;
  if (isOpen !== toggleValue) {
    const newIsOpen = toggleValue === undefined ? !isOpen : toggleValue;
    window.$chattlin.isOpen = newIsOpen;

    toggleClass(chatBubble, 'woot--hide');
    toggleClass(closeBubble, 'woot--hide');
    toggleClass(widgetHolder, 'woot--hide');
    IFrameHelper.events.onBubbleToggle(newIsOpen);

    if (!newIsOpen) {
      chatBubble.focus();
    }
  }
};

export const onClickChatBubble = () => {
  wootOn(bubbleHolder, 'click', onBubbleClick);
};

export const addUnreadClass = () => {
  const holderEl = document.querySelector('.woot-widget-holder');
  addClass(holderEl, 'has-unread-view');
};

export const removeUnreadClass = () => {
  const holderEl = document.querySelector('.woot-widget-holder');
  removeClass(holderEl, 'has-unread-view');
};
