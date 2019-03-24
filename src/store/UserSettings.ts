import { getter, Module, mutation, VuexModule } from 'vuex-class-component';

/**
 * @description This is a testing module to get to know Vuex in Typescript better.
 */
@Module()
export class UserSettings extends VuexModule {
  private counter: number = 0;

  @mutation
  public increaseCounter() {
    this.counter += 1;
  }

  @getter
  public get count(): number {
    return this.counter;
  }
}

export const userSettingsModule = UserSettings.ExtractVuexModule(UserSettings);
