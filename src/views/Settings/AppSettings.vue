<template>
  <v-tab-item :key="tabKey">
    <v-card flat>
      <v-container fluid fill-height grid-list-xl>
        <v-layout>
          <v-flex xs5>
            <v-select
              :items="languages"
              item-text="original"
              :value="_locale"
              :label="$t('pages.settings.appSettings.chooseLanguage')"
              @change="setLanguage"
            >
              <template v-slot:selection="data">
                {{ data.item.original }} ({{ data.item.english }})
              </template>
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title>{{ data.item.original }}</v-list-item-title>
                  <v-list-item-subtitle>{{ data.item.english }}</v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-select>
          </v-flex>

          <v-flex xs5 offset-xs2 justify-center align-center>
            <v-switch v-model="darkMode" :label="$t('pages.settings.appSettings.darkMode')" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { map } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { appStore } from '@/store';

@Component
export default class AppSettings extends Vue {
  private _locale: string = '';

  @Prop(String)
  private tabKey!: string;

  private get languages(): any {
    const { messages } = this.$i18n;
    const languages = map(messages, (value, key) => {
      const locale = key;
      const original = value.originalReading;
      const english = value.englishReading;

      return {
        value: locale,
        original,
        english,
      };
    });

    return languages;
  }

  private get darkMode(): boolean {
    return appStore.darkMode;
  }

  private set darkMode(state: boolean) {
    appStore.setDarkMode(state);
  }

  /**
   * @method created is being called before mount
   * @protected
   */
  protected created(): void {
    this._locale = appStore.language as string;
  }

  /**
   * @method setLanguage
   * @private
   * @param {string} newLanguage contains the locale value of the new language
   */
  private setLanguage(newLanguage: string): void {
    appStore.setLanguage(newLanguage);
    this._locale = newLanguage;
  }
}
</script>
