import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
cytoscape.use(coseBilkent);

function CharacterGraph({ data }) {
    const cyRef = useRef(null);
    const containerRef = useRef(null);
    const [graphDescription, setGraphDescription] = useState("Loading graph description..."); // State for the main description

    // State for live region updates (if graph changes dynamically after initial load)
    const [liveMessage, setLiveMessage] = useState("");

    useEffect(() => {
        // Generate and set the description as soon as data is available
        if (data && data.nodes && data.links) {
            setGraphDescription(generateGraphDescription());
        } else {
            setGraphDescription("No graph data available yet.");
        }

        const cleanup = () => {
            if (cyRef.current) {
                try {
                    cyRef.current.removeAllListeners();
                    cyRef.current.destroy();
                } catch (error) {
                    console.warn('Error cleaning up cytoscape instance:', error);
                }
                cyRef.current = null;
            }
        };

        cleanup();

        if (!containerRef.current || !data || !data.nodes || !data.links) {
            return;
        }

        try {
            cyRef.current = cytoscape({
                container: containerRef.current,
                elements: [
                    ...data.nodes.map(node => ({
                        data: { id: `${node.id}`, label: node.name }
                    })),
                    ...data.links.map(link => ({
                        data: {
                            source: `${link.source}`,
                            target: `${link.target}`,
                            label: link.type
                        }
                    }))
                ],
                layout: {
                    name: 'cose-bilkent',
                    animate: false,
                    randomize: true,
                    nodeRepulsion: 8000,
                    idealEdgeLength: 150,
                    edgeElasticity: 0.1,
                    gravity: 0.1,
                    numIter: 3000
                },
                minZoom: 0.5,
                maxZoom: 2,
                style: [
                    {
                        selector: 'node',
                        style: {
                            'label': 'data(label)',
                            'background-color': '#007bff',
                            'color': 'black',
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'width': 40,
                            'height': 40
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'label': 'data(label)',
                            'line-color': '#aaa',
                            'target-arrow-color': '#aaa',
                            'target-arrow-shape': 'triangle',
                            'curve-style': 'bezier',
                            'font-size': 12
                        }
                    }
                ]
            });

            const cy = cyRef.current;

            // Fit graph with padding
            cy.fit(null, 50);

            // Prevent user from panning too far away
            const panBounds = 1000;
            cy.on('pan', () => {
                const pan = cy.pan();
                const clampedPan = {
                    x: Math.max(-panBounds, Math.min(panBounds, pan.x)),
                    y: Math.max(-panBounds, Math.min(panBounds, pan.y))
                };
                if (pan.x !== clampedPan.x || pan.y !== clampedPan.y) {
                    cy.pan(clampedPan);
                }
            });

            // Prevent nodes from being dragged too far
            const dragBounds = 1000;
            cy.nodes().on('position', (event) => {
                const node = event.target;
                const pos = node.position();
                const clampedPos = {
                    x: Math.max(-dragBounds, Math.min(dragBounds, pos.x)),
                    y: Math.max(-dragBounds, Math.min(dragBounds, pos.y))
                };
                if (pos.x !== clampedPos.x || pos.y !== clampedPos.y) {
                    node.position(clampedPos);
                }
            });

        } catch (error) {
            console.error('Error creating cytoscape instance:', error);
            setGraphDescription("Failed to load graph. " + error.message);
        }

        return cleanup;
    }, [data]);

    // Generate accessible description
    const generateGraphDescription = () => {
        if (!data || !data.nodes || !data.links) return "Graph data is loading or not available.";

        const nodeCount = data.nodes.length;
        const linkCount = data.links.length;

        let description = `Character relationship graph with ${nodeCount} characters and ${linkCount} relationships. `;

        // List characters
        const characterNames = data.nodes.map(node => node.name).join(', ');
        description += `Characters: ${characterNames}. `;

        // Describe relationships
        if (data.links.length > 0) {
            description += "Relationships: ";
            const relationships = data.links.map(link => {
                const sourceNode = data.nodes.find(n => n.id === link.source);
                const targetNode = data.nodes.find(n => n.id === link.target);
                return `${sourceNode?.name || link.source} ${link.type} ${targetNode?.name || link.target}`;
            }).join('; ');
            description += relationships + ".";
        }

        return description;
    };

    return (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            {/* Primary description: Place it visually hidden but still in the DOM flow.
                This allows screen readers to read it as part of the normal page traversal.
                It should also be the target of aria-labelledby/aria-describedby.
            */}
            <div
                id="graph-description"
                // Using a utility class that hides visually but is still read by SRs.
                // Ensure this class is properly defined in your CSS to not use `display: none` or `visibility: hidden`.
                // A common implementation for "sr-only" or "visually-hidden" is as provided previously.
                className="sr-only"
                role="region" // Indicate it's a distinct region for accessibility
                aria-live="polite" // Still useful for dynamic updates if you implement them later
                aria-atomic="true" // Ensure the whole message is read
            >
                {graphDescription}
                {/* Optionally, if you have additional live updates that need to be announced
                    separately from the main description, you can add them here.
                    For now, it's combined for simplicity of initial read.
                */}
                {liveMessage}
            </div>

            {/* Alternative text-based representation for screen readers (highly recommended fallback) */}
            {/* This provides a structured, navigable alternative for complex graphs */}
            <div className="sr-only-alt-content" aria-hidden="false"> {/* Make sure this class is visually hidden but read */}
                <h3>Character Relationships Summary (Text Format)</h3>
                <p>{graphDescription}</p> {/* Re-use the generated description */}
                {data && data.nodes && (
                    <div>
                        <h4>Characters ({data.nodes.length})</h4>
                        <ul>
                            {data.nodes.map(node => (
                                <li key={node.id}>{node.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {data && data.links && data.links.length > 0 && (
                    <div>
                        <h4>Relationships ({data.links.length})</h4>
                        <ul>
                            {data.links.map((link, index) => {
                                const sourceNode = data.nodes?.find(n => n.id === link.source);
                                const targetNode = data.nodes?.find(n => n.id === link.target);
                                return (
                                    <li key={index}>
                                        {sourceNode?.name || link.source} {link.type} {targetNode?.name || link.target}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>

            <button
                onClick={() => cyRef.current?.fit(null, 50)}
                style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: 10,
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
                aria-label="Reset graph view to fit all characters"
            >
                Reset View
            </button>
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9',
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}
                role="img"
                aria-labelledby="graph-title" // Use a clearer label for the graph itself
                aria-describedby="graph-description" // This links to the main description
                tabIndex="0"
                title="Interactive Character Relationship Graph" // A simple title for hover/initial context
            />
            {/* Add a visually hidden heading that can serve as the label */}
            <h2 id="graph-title" className="sr-only">Character Relationship Graph</h2>
        </div>
    );
}

export default CharacterGraph;