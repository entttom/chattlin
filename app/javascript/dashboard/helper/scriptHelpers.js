import posthog from 'posthog-js';

export const CHATTLIN_SET_USER = 'CHATTLIN_SET_USER';
export const CHATTLIN_RESET = 'CHATTLIN_RESET';

export const ANALYTICS_IDENTITY = 'ANALYTICS_IDENTITY';
export const ANALYTICS_RESET = 'ANALYTICS_RESET';

export const initializeAnalyticsEvents = () => {
  window.bus.$on(ANALYTICS_IDENTITY, ({ user }) => {
    if (window.analyticsConfig) {
      posthog.identify(user.id, { name: user.name, email: user.email });
    }
  });

  window.bus.$on(ANALYTICS_RESET, () => {
    if (window.analyticsConfig) {
      posthog.reset();
    }
  });
};

export const initializeChattlinEvents = () => {
  window.bus.$on(CHATTLIN_RESET, () => {
    if (window.$chattlin) {
      window.$chattlin.reset();
    }
  });
  window.bus.$on(CHATTLIN_SET_USER, ({ user }) => {
    if (window.$chattlin) {
      window.$chattlin.setUser(user.email, {
        avatar_url: user.avatar_url,
        email: user.email,
        identifier_hash: user.hmac_identifier,
        name: user.name,
      });
      window.$chattlin.setCustomAttributes({
        signedUpAt: user.created_at,
        cloudCustomer: 'true',
      });
    }
  });
};
