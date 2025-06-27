import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
//register cose-bilkent layout algorithm with cytoscape (spreads nodes neutrally)
cytoscape.use(coseBilkent);

function CharacterGraph({ data }) {
    // useRef creates a persistent reference to the cytoscape instance, so it's not recreated on every render
    const cyRef = useRef(null);
    const containerRef = useRef(null);
    const [graphDescription, setGraphDescription] = useState("Loading graph description...");

    useEffect(() => {
        // Update the accessibility description whenever data changes
        if (data && data.nodes && data.links) {
            setGraphDescription(generateGraphDescription());
        } else {
            setGraphDescription("No graph data available yet.");
        }

        // Cleanup function to properly destroy cytoscape instances
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

        // Clean up any existing instance before creating a new one
        cleanup();

        if (!containerRef.current || !data?.nodes || !data?.links) return;

        try {
            //cytoscape instance is created with the container reference and graph data
            cyRef.current = cytoscape({
                container: containerRef.current,
                //transform the data into cytoscape format
                elements: [
                    ...data.nodes.map(node => ({
                        //convert nodes
                        data: { id: `${node.id}`, label: node.name }
                    })),
                    ...data.links.map(link => ({
                        //convert links
                        data: {
                            source: `${link.source}`,
                            target: `${link.target}`,
                            label: link.type    //relationship type
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
                            'background-color': '#589283',
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
            cy.fit(null, 50);

            // Constrain panning to prevent users from getting lost
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

            // Constrain node dragging to prevent nodes from being dragged too far
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

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    // Generate a text description of the graph for accessibility
    const generateGraphDescription = () => {
        if (!data?.nodes || !data?.links) return "Graph data is loading or not available.";

        const nodeCount = data.nodes.length;
        const linkCount = data.links.length;
        let description = `Character relationship graph with ${nodeCount} characters and ${linkCount} relationships. `;
        // List all character names
        const characterNames = data.nodes.map(node => node.name).join(', ');
        description += `Characters: ${characterNames}. `;

        // Describe relationships in human-readable format
        if (data.links.length > 0) {
            description += "Relationships: ";
            const relationships = data.links.map(link => {
                // Find the actual node names from IDs
                const sourceNode = data.nodes.find(n => n.id === link.source);
                const targetNode = data.nodes.find(n => n.id === link.target);
                return `${sourceNode?.name || link.source} ${link.type} ${targetNode?.name || link.target}`;
            }).join('; ');
            description += relationships + ".";
        }

        return description;
    };

    return (
        <div style={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column' }}>
            <h2 id="graph-title">
                Character Relationship Graph
            </h2>

            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '600px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9',
                }}
                role="region"
                aria-labelledby="graph-title"
                title="Interactive Character Relationship Graph"
            >
                {/* This is the Cytoscape container */}
                <div
                    ref={containerRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        outline: 'none'
                    }}
                    tabIndex="0"
                />

                {/* Overlay Button */}
                <button
                    onClick={() => cyRef.current?.fit(null, 50)}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        zIndex: 1000,
                        padding: '6px 12px',
                        backgroundColor: '#263b43',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    aria-label="Reset graph view to fit all characters"
                >
                    Reset View
                </button>
            </div>

            <p
                id="graph-description"
                style={{
                    marginTop: '8px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    color: '#333',
                    whiteSpace: 'pre-wrap',
                }}
                aria-live="polite"
            >
                {graphDescription}
            </p>
        </div>
    );


}

export default CharacterGraph;
