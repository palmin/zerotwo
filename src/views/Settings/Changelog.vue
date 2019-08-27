<template>
  <v-tab-item :key="tabKey">
    <v-card flat>
      <div class="display-1">
        {{ $t('pages.settings.changelog.changesIn', [version]) }}
      </div>

      <v-divider />

      <v-layout class="px-1 py-2">
        <v-flex xs4>
          <div class="headline">
            <v-icon large color="blue darken-1">
              mdi-rocket
            </v-icon>
            {{ $t('pages.settings.changelog.new') }}
          </div>

          <v-list>
            <v-list-item v-for="(item, index) in englishNew" :key="`new-${index}`">
              <v-list-item-content>{{ item[currentLanguage] || item.en }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>

        <v-flex xs4>
          <div class="headline">
            <v-icon large color="warning">
              mdi-bandage
            </v-icon>
            {{ $t('pages.settings.changelog.fix') }}
          </div>

          <v-list>
            <v-list-item v-for="(item, index) in englishFix" :key="`fix-${index}`">
              <v-list-item-content>{{ item[currentLanguage] || item.en }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>

        <v-flex xs4>
          <div class="headline">
            <v-icon large color="error">
              mdi-delete
            </v-icon>
            {{ $t('pages.settings.changelog.remove') }}
          </div>

          <v-list>
            <v-list-item v-for="(item, index) in englishRemove" :key="`remove-${index}`">
              <v-list-item-content>{{ item[currentLanguage] || item.en }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>
      </v-layout>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import latestChangelog from '@/assets/changelogs/latest.json';

@Component
export default class ChangelogSettings extends Vue {
  @Prop(String)
  private tabKey!: string;

  private get version(): string {
    return latestChangelog.version;
  }

  private get currentLanguage(): string {
    return this.$i18n.locale;
  }

  private get englishNew() {
    return latestChangelog.NEW;
  }

  private get englishFix() {
    return latestChangelog.FIX;
  }

  private get englishRemove() {
    return latestChangelog.REMOVE;
  }
}
</script>
