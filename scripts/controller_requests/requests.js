const requests = (function() {
    const _this = this;

    this.registry = function(unit_info) {
        if (!_this.hideActions.checkUnit(unit_info)) {
            return false;
        }

        
    }

    this.hideActions = {
        checkUnit: function(unit_info) {
            if (unit_info.unitGuid == undefined
                    || unit_info.unitStatus == undefined
                    || unit_info.bookFrom == undefined
                    || unit_info.bookTo == undefined
                    || unit_info.number == undefined) {
                return false;
            } else {
                return true;
            }
        }
    }

    return {
        registry: registry
    }
})();