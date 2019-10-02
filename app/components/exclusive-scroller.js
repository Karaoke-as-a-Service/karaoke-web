import Component from '@ember/component';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export default Component.extend({
    tagName: "article",

    didInsertElement() {
        disableBodyScroll(this.element);
    },
    willDestroyElement() {
        enableBodyScroll(this.element);
    },
});
