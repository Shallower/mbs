/**
 * triggter window.resize
 */
export function triggerWindowResize() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, true);
    event.eventType = 'message';
    window.dispatchEvent(event);
}
//# sourceMappingURL=triggerWindowResizeEvent.js.map