declare global {
interface HTMLFilterNodeElement extends HTMLElement {
    focusNode: FocusNode;
    /**
     * The filtered clownface multi-pointer provided to descendant elements.
     */
    filtered: MultiPointer | undefined;
    /**
     * Callback function used to filter the current focus node pointer.
     */
    filter: FilterCallback | undefined;
    updateFiltered(): void;
}


interface HTMLFocusNodeElement extends HTMLElement {
    /**
     * The clownface multi-pointer representing the current focus node(s) provided to child elements.
     */
    focusNode: MultiPointer | undefined;
}


interface HTMLRdfDatasetElement extends HTMLElement {
    graphs: Map<HTMLElement, { dataset: DatasetCore, graph: NamedNode | undefined }>;
    env: Environment;
    value: DatasetCore | undefined;
    provider: DatasetProvider;
    updateGraph(host: HTMLElement, dataset: DatasetCore, graph: NamedNode | undefined): void;
    removeGraph(host: HTMLElement): void;
    updateDataset(): void;
}


interface HTMLRdfEnvironmentElement extends HTMLElement {
    rdf: Environment;
}


interface HTMLRdfGraphElement extends HTMLElement {
    value: DatasetCore | undefined;
    graph: NamedNode | undefined;
    datasetProvider: DatasetProvider | undefined;
}


interface HTMLResourceLabelElement extends HTMLElement {
    /**
     * The RDF predicate used to look up the label property.
     */
    predicate: NamedNode;
    focusNode: FocusNode;
}


interface HTMLResourceLinkElement extends HTMLElement {
    /**
     * Optional property path or predicate whose resolved node value will be used as the link `href`.
     * If omitted, the focus node's own URI is used as the link target.
     */
    property: NamedNode | undefined;
    focusNode: FocusNode;
}


interface HTMLResourceValueElement extends HTMLElement {
    focusNode: FocusNode;
}


interface HTMLTargetNodeElement extends HTMLElement {
    rdf: Environment;
    graph: Dataset;
    /**
     * Sort predicate or property URI used to order targeted nodes.
     */
    orderBy: SortPredicate | undefined;
    /**
     * Sort direction ('asc' for ascending, 'desc' for descending).
     */
    orderDir: 'asc' | 'desc';
    /**
     * Target nodes that are objects of the specified predicate URI.
     */
    targetObjectsOf: NamedNode | undefined;
    /**
     * Target nodes that are subjects of the specified predicate URI.
     */
    targetSubjectsOf: NamedNode | undefined;
    /**
     * Target nodes that are instances of the specified class URI (via `rdf:type`).
     */
    targetClass: NamedNode | undefined;
    /**
     * Target node URI to select directly.
     */
    targetNode: NamedNode | undefined;
    /**
     * The resolved clownface focus node(s) provided in context.
     */
    focusNode: MultiPointer | undefined;
    setFocusNode(): void;
    findFocusNode(): void;
}


interface HTMLTraverseGraphElement extends HTMLElement {
    focusNode: FocusNode;
    /**
     * Optional custom template function for rendering each individual resolved graph pointer.
     */
    renderObjectNode: (node: GraphPointer) => unknown | undefined;
    /**
     * Optional custom template function for rendering all resolved multi-pointer nodes together.
     */
    renderObjectNodes: (nodes: MultiPointer) => unknown | undefined;
    /**
     * The SHACL property path or predicate URI used to traverse from the focus node.
     */
    propertyPath: ShaclPropertyPath | undefined;
    /**
     * The clownface multi-pointer representing the object nodes resolved along the property path.
     */
    objectNode: MultiPointer | undefined;
    setObjectNode(): void;
}


interface HTMLElementTagNameMap {
    "filter-node": HTMLFilterNodeElement;
    "focus-node": HTMLFocusNodeElement;
    "rdf-dataset": HTMLRdfDatasetElement;
    "rdf-environment": HTMLRdfEnvironmentElement;
    "rdf-graph": HTMLRdfGraphElement;
    "resource-label": HTMLResourceLabelElement;
    "resource-link": HTMLResourceLinkElement;
    "resource-value": HTMLResourceValueElement;
    "target-node": HTMLTargetNodeElement;
    "traverse-graph": HTMLTraverseGraphElement;
}

}

type _HTMLFilterNodeElement = HTMLFilterNodeElement;
type _HTMLFocusNodeElement = HTMLFocusNodeElement;
type _HTMLRdfDatasetElement = HTMLRdfDatasetElement;
type _HTMLRdfEnvironmentElement = HTMLRdfEnvironmentElement;
type _HTMLRdfGraphElement = HTMLRdfGraphElement;
type _HTMLResourceLabelElement = HTMLResourceLabelElement;
type _HTMLResourceLinkElement = HTMLResourceLinkElement;
type _HTMLResourceValueElement = HTMLResourceValueElement;
type _HTMLTargetNodeElement = HTMLTargetNodeElement;
type _HTMLTraverseGraphElement = HTMLTraverseGraphElement;

export type { _HTMLFilterNodeElement as HTMLFilterNodeElement, _HTMLFocusNodeElement as HTMLFocusNodeElement, _HTMLRdfDatasetElement as HTMLRdfDatasetElement, _HTMLRdfEnvironmentElement as HTMLRdfEnvironmentElement, _HTMLRdfGraphElement as HTMLRdfGraphElement, _HTMLResourceLabelElement as HTMLResourceLabelElement, _HTMLResourceLinkElement as HTMLResourceLinkElement, _HTMLResourceValueElement as HTMLResourceValueElement, _HTMLTargetNodeElement as HTMLTargetNodeElement, _HTMLTraverseGraphElement as HTMLTraverseGraphElement };
