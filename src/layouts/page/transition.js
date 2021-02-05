export function getTransitionName({ route, openCache, cacheTabs, enableTransition, def, }) {
    const isInCache = cacheTabs.includes(route.name);
    const transitionName = 'fade-slide';
    let name = transitionName;
    if (openCache) {
        name = isInCache && route.meta.loaded && enableTransition ? transitionName : null;
    }
    return name || route.meta.transitionName || def;
}
//# sourceMappingURL=transition.js.map