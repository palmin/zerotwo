<template>
  <v-tab-item key="specialThanks">
    <v-card flat>
      <v-container fluid>
        <v-layout align-center justify-center row wrap>
          <v-flex xs12>
            <h5 class="headline font-weight-light font-italic">{{ $t('system.settings.menu.specialThanks') }}</h5>
            <v-divider></v-divider>
          </v-flex>
          <template v-for="contributor in contributors">
            <v-flex xs2 :key="`${contributor.name}_icon`">
              <v-icon dark>{{ contributor.icon }}</v-icon>
            </v-flex>
            <v-flex xs5 :key="`${contributor.name}_name`">
              <v-subheader>{{ contributor.name }}</v-subheader>
            </v-flex>
            <v-flex xs5 :key="`${contributor.name}_thanks`">
              <v-subheader>{{ contributor.thanks }}</v-subheader>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
    </v-card>
  </v-tab-item>
</template>

<script>
export default {
  data: () => ({
    contributors: [{
      name: '晨风Mornwind',
      thanks: 'for providing the Simplified Chinese localization.',
      icon: 'fas fa-language',
    }, {
      name: 'Rafeh',
      thanks: 'for providing the Arabic localization.',
      icon: 'fas fa-language',
    }, {
      name: 'Munkei',
      thanks: 'for providing the Arabic localization.',
      icon: 'fas fa-language',
    }],
  }),
};
</script>

