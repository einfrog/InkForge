import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
cytoscape.use(coseBilkent);

function CharacterGraph({ data }) {
    const cyRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!data || !data.nodes || !data.links) {
            return;
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

        if (!containerRef.current) {
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
        }

        return cleanup;
    }, [data]);

    return (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
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
            />
        </div>
    );

}

export default CharacterGraph;
