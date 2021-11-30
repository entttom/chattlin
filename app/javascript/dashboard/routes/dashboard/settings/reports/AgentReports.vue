<template>
  <maass-reports
    key="agent-reports"
    type="agent"
    getter-key="agents/getAgents"
    action-key="agents/get"
    :download-button-label="$t('REPORT.DOWNLOAD_AGENT_REPORTS')"
  />
</template>

<script>
import MaassReports from './components/MaassReports';

export default {
  components: {
    MaassReports,
  },
};
</script>
