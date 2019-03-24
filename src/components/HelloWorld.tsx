import { Component, Vue } from 'vue-property-decorator';
import { userStore } from '../store';

@Component
export default class HelloWorld extends Vue {
  public render() {
    return (
      <div class="hello">
        <h1>Counter: {this.counter}</h1>
        <button onClick={this.increase}>Increase</button>
      </div>
    );
  }

  get counter() {
    return userStore.count;
  }

  private increase() {
    userStore.increaseCounter();
  }
}
