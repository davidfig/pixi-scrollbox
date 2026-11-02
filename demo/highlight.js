import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import code from './code.js?raw'

hljs.registerLanguage('javascript', javascript)

export function highlight() {
    const element = document.getElementById('code')
    element.textContent = code
    hljs.highlightElement(element)
}
