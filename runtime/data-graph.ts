import factory from '@zazuko/env/web.js'

document.querySelectorAll('[data-graph]').forEach(el => {
    const graphName = el.getAttribute('data-graph')
    if (graphName && window.graphs?.[graphName]) {
        const dataset = factory.dataset(window.graphs[graphName]({ factory }))
        el.graph = factory.clownface({ dataset })
    }
})
