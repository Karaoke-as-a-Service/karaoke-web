import Component from '@ember/component';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export default Component.extend({
    tagName: "article",

    didInsertElement() {
        disableBodyScroll(this.element, {
            allowTouchMove: false,
        });
    },
    willDestroyElement() {
        enableBodyScroll(this.element);
    },
});
