module.exports = function (dataOrNull, errMsg) {
    if (dataOrNull) return { ok: true, data: dataOrNull }
    else return { ok: false, error: { msg: errMsg } }
}
