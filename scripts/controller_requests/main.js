const unitEdit = function(e) {
    const el = e.target;

    if (el.__vue__._isVue) {
        el.__vue__.$options.propsData.unit
    }
}
