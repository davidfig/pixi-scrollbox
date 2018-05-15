const forkMe = require('fork-me-github')

module.exports = function highlight()
{
    var client = new XMLHttpRequest()
    client.open('GET', 'code.js')
    client.onreadystatechange = function()
    {
        var code = document.getElementById('code')
        code.innerHTML = client.responseText
        require('highlight.js').highlightBlock(code)
    }
    client.send()

    forkMe()
}

// for eslint
/* globals window, XMLHttpRequest, document */