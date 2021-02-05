const lineHeight = function (tinymce) {
    tinymce.PluginManager.add('lineheight', function (t) {
        t.on('init', function () {
            t.formatter.register({
                lineheight: {
                    inline: 'span',
                    styles: {
                        'line-height': '%value',
                    },
                },
            });
        });
        t.ui.registry.addMenuButton('lineheight', {
            icon: 'lineheight',
            tooltip: 'Line Height',
        });
    });
    tinymce.PluginManager.requireLangPack('lineheight', 'de');
};
export default lineHeight;
//# sourceMappingURL=lineHeight.js.map