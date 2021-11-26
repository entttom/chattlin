<template>
  <woot-reports
    key="label-reports"
    type="label"
    getter-key="labels/getLabels"
    action-key="labels/get"
    :download-button-label="$t('LABEL_REPORTS.DOWNLOAD_LABEL_REPORTS')"
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
