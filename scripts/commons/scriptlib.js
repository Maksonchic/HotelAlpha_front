const scriptlib = {
    notify: function(message) {
        console.log(message);
    },
    createElegantRequestBody: function(req) {
        let res = "";
        Object.keys(req).forEach(el => {
            res += ((res.length != 0 ? '&' : '') + `${el}=${req[el]}`);
        });
        return res;
    }
};

// exports.scriptlib = new scriptlib();