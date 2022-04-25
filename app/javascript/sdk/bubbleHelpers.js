import { addClass, removeClass, toggleClass, wootOn } from './DOMHelpers';
import { IFrameHelper } from './IFrameHelper';
import { BUBBLE_DESIGN } from './constants';

export const bubbleImg =
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAGdWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iNDgiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI0OCIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSI0OCIKICAgdGlmZjpJbWFnZVdpZHRoPSI0OCIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iMzAwLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjMwMC8xIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTA0LTI1VDE1OjU0OjM0KzAyOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNC0yNVQxNTo1NDozNCswMjowMCI+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+TG9nbzwvcmRmOmxpPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gKE1hciAzMSAyMDIwKSIKICAgICAgeG1wTU06d2hlbj0iMjAyMS0wNC0yMlQwODoyNDoxMiswMjowMCIvPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gKE1hciAzMSAyMDIwKSIKICAgICAgeG1wTU06d2hlbj0iMjAyMS0wNC0yMlQwODoyNDo0MiswMjowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgRGVzaWduZXIgMS4xMC4zIgogICAgICBzdEV2dDp3aGVuPSIyMDIyLTA0LTI1VDE1OjU0OjM0KzAyOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz41u7TyAAABgmlDQ1BzUkdCIElFQzYxOTY2LTIuMQAAKJF1kc8rRFEUxz8zRiM/GoWiLCYNqxkxamKjjISaNI1Rfm1mnvmhZsbrvSfJVtkqSmz8WvAXsFXWShEpWcqa2DA9581TI5lzO/d87vfec7r3XHDGc0ped/VAvmBosdGwd3pm1ut+xkUbtbQQSCi6OhSNRqhoH3c4rHgTsGpVPvev1S2kdAUcNcKDiqoZwmPCkRVDtXhbuFnJJhaET4X9mlxQ+NbSkza/WJyx+ctiLR4bBmejsDfzi5O/WMlqeWF5Ob58bln5uY/1kvpUYWpSYod4OzoxRgnjZZwRhgnRy4DMIQIE6ZYVFfJ7SvkTLEmuIrPKKhqLZMhi4Bd1WaqnJKZFT8nIsWr1/29f9XRf0K5eH4bqJ9N86wT3FhQ3TfPz0DSLR1D1CBeFcv7SAfS/i75Z1nz74FmHs8uyltyB8w1ofVATWqIkVYk702l4PYGGGWi6hto5u2c/+xzfQ3xNvuoKdvegS8575r8BXsdn4rhn99gAAAAJcEhZcwAALiMAAC4jAXilP3YAAANsSURBVGiB7Ze9bxRHGMZ/s7O7d96xg0I85z8gVJHSRXSuUqSIhCKkFJGCUiVSlMIKUlKxTbZygyiooMG2RAIWJBIFaUgTlMgSoHw0XOQAiRwJaUA22JuY44wpZsG+893N3qelaH/SFHt7987z7Pu8t7tQUFBQUFDQhtikk7FJ5X7r6ITnOH8M+Ds26Wxs0jdGIahbRKeTsUk/B07u+ugGMAd8nWj1cJjC8uI7zm83Hb+VrZOxSa9gzVxNtHo6DHF5cBloRwAczZaJTXoea+aXRKtm00PFNQN5xGhgBrgF/Bqb9Hhs0qm+leXENQMzwKke6m4B32O7ciXRarOHGrnodgbyIoF3s7UWm/QbrJmlQUesYweO3DanlRSfVaKQV8KB3A6qWCMLiVYrgyjY1sB01Xxaq9WPL91bOwRQ9j0qYwGVKGAqCqlEAToKKEnXGLVkG7iGNXM50erfntTTxsB01cwAp2q1+p9L99Ze71TgQMlnKrLGKpmx18oBXsfeNrAOLGLNXE+0etaF/r0GpqvmS2AWII+BVkghmHzZrR1jE+4Y3gXmgflEqzt59mowMF01MfDVi+Narb78IkKDYMz3Gjo1FQXosZBQtmzXj9iuLCZaPW5XU2TCRSb8xO6TgzbQjldLfoOxShRwcCeG/wGXsWZ+SLTaajCQiZ8FvmguPCoDrZCeQI8FDfM1WfbvT4TynBBiLtHqNoD44K/VjwR80qrIxpP6xMp67c3RSu9MKAUHQp9xX1S34UP/UBQuYh+b327+8kYol1dH+mSzl0AIlBQo30NJj7Infos8cbYsvYVEq0cCIDZpGfgOeGf3jzfqW8s3Hj8ZSYQ8IJIeyvcYlwIlreCSHYQV7AzMJ1r9sft3L8c/NmkJuIS9/Q/VQNkTjGdX1C5BJL3m//RN7PCeo8Xw7jEAEJs0BC4A7w3CQHP7xzOxUnS8y/2Uib6YaPXItceeSrFJfeA88H5eA47252EFewOba46Ii5Y7ZC/y8+v1rcM3mwzkbH8eckXERdt9Y5N6D2r1xdX6s6NdtD8PXUXEheuF5mPgTL+b0EdEXAzrhQYGFBEXvb7Ud+JndiKyNoT6DQyqA/+wE5Fqf5K6o58ObALfYq/2tWFFxEUvHRhpRFzkNbBvEXHhMvA79gFv3yJSUFBQUFDwv+Y5aKYnTYbsz1kAAAAASUVORK5CYII='
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
