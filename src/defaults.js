module.exports = function (options, defaults)
{
    options = options || {}
    for (let item in defaults)
    {
        if (typeof options[item] === 'undefined')
        {
            options[item] = defaults[item]
        }
    }
    return options
}