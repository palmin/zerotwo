<template>
  <v-tab-item :key="tabKey">
    <v-card flat>
      <v-layout wrap class="px-1 py-2">
        <v-flex xs12 sm12 md6>
          <div class="display-1">
            {{ $t('pages.settings.specialThanks') }}
          </div>

          <v-divider />

          <v-layout class="px-1 py-2" wrap>
            <template v-for="(item, index) in getSpecialThanks">
              <v-flex :key="`thanks-icon-${index}`" xs1>
                <v-icon>mdi-{{ item.icon }}</v-icon>
              </v-flex>

              <v-flex :key="`thanks-name-${index}`" xs4>
                {{ item.name }}
              </v-flex>

              <v-flex :key="`thanks-message-${index}`" xs7>
                {{ item.message[currentLanguage] || item.message.en }}
              </v-flex>
            </template>
          </v-layout>
        </v-flex>

        <v-flex xs12 sm12 md6>
          <div class="display-1">
            {{ $t('pages.settings.supporters') }}
          </div>

          <v-divider />

          <v-layout class="px-1 py-2" wrap>
            <template v-for="(item, index) in getSupporters">
              <v-flex :key="`support-icon-${index}`" xs1>
                <v-icon>mdi-{{ item.icon }}</v-icon>
              </v-flex>

              <v-flex :key="`support-name-${index}`" xs4>
                {{ item.name }}
              </v-flex>

              <v-flex :key="`support-message-${index}`" xs7>
                {{ item.message[currentLanguage] || item.message.en }}
              </v-flex>
            </template>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-card-actions>
        <v-layout justify-end>
          <v-flex xs6>
            <v-img
              class="pointer-on-hover"
              height="50"
              contain
              :src="require('@/assets/logos/Ko-fi-Support-Button.png')"
              @click="OpenKofiPage"
            />
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import specialThanks from '@/assets/support/specialThanks.json';
import supporters from '@/assets/support/supporters.json';

@Component
export default class SpecialThanksSettings extends Vue {
  @Prop(String)
  private tabKey!: string;

  private get currentLanguage(): string {
    return this.$i18n.locale;
  }

  private get getSpecialThanks() {
    return specialThanks;
  }

  private get getSupporters() {
    return supporters;
  }

  private OpenKofiPage(): void {
    window.open('https://ko-fi.com/nicoaiko', '_blank');
  }
}
</script>

<style lang="scss" scoped>
.pointer-on-hover:hover {
  cursor: pointer;
}
</style>
