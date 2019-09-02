<template>
  <v-tab-item :key="tabKey">
    <v-card flat>
      <v-container>
        <v-row justify="center">
          <v-col :cols="12">
            <v-row justify="center">
              <v-col :cols="12" class="display-1 text-center">
                {{ $t('pages.settings.changelog.changesIn', [version]) }}
              </v-col>
            </v-row>

            <v-divider />

            <v-row justify="center" class="px-1 py-2">
              <v-col
                :cols="12"
                :md="4"
              >
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
              </v-col>

              <v-col
                :cols="12"
                :md="4"
              >
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
              </v-col>

              <v-col
                :cols="12"
                :md="4"
              >
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
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
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
