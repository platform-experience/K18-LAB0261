function ideaBannerCtrl() {
    /* widget controller */
    var c = this;
    c.getPictureStyle = function() {
        return {
            "background-image": 'url(' + c.options.background_image + ')',
            "background-position": c.options.align_image + ''
        };

    };
}