import posthog from 'posthog-js';

export const MAAS_SET_USER = 'MAAS_SET_USER';
export const MAAS_RESET = 'MAAS_RESET';

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

export const initializeMaasEvents = () => {
  window.bus.$on(MAAS_RESET, () => {
    if (window.$maas) {
      window.$maas.reset();
    }
  });
  window.bus.$on(MAAS_SET_USER, ({ user }) => {
    if (window.$maas) {
      window.$maas.setUser(user.email, {
        avatar_url: user.avatar_url,
        email: user.email,
        identifier_hash: user.hmac_identifier,
        name: user.name,
      });
      window.$maas.setCustomAttributes({
        signedUpAt: user.created_at,
        cloudCustomer: 'true',
      });
    }
  });
};
