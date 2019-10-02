import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | panel', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:panel');
    assert.ok(route);
  });
});
