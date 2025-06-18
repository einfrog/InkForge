import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

function CharacterGraph({ data }) {
    const cyRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        console.log('CharacterGraph useEffect triggered with data:', data);

        if (!data) {
            console.log('No data provided to CharacterGraph');
            return;
        }

        if (!data.nodes || !data.links) {
            console.log('Data structure issue:', {
                hasNodes: !!data.nodes,
                hasLinks: !!data.links,
                data: data
            });
            return;
        }

        console.log('Processing graph data:', {
            nodesCount: data.nodes.length,
            linksCount: data.links.length,
            nodes: data.nodes,
            links: data.links
        });

        // Cleanup function
        const cleanup = () => {
            if (cyRef.current) {
                console.log('Destroying existing cytoscape instance');
                try {
                    cyRef.current.destroy();
                } catch (error) {
                    console.warn('Error destroying cytoscape instance:', error);
                }
                cyRef.current = null;
            }
        };

        // Clean up any existing instance
        cleanup();

        // Check if the container exists and is mounted
        if (!containerRef.current) {
            console.error('Cytoscape container ref not available');
            return;
        }

        // Small delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            try {
                // Create the Cytoscape instance
                console.log('Creating new cytoscape instance');
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
                        name: 'cose',
                        animate: false // Disable animation to reduce issues
                    },
                    style: [
                        {
                            selector: 'node',
                            style: {
                                'label': 'data(label)',
                                'background-color': '#007bff',
                                'color': '#fff',
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
                console.log('Cytoscape instance created successfully');
            } catch (error) {
                console.error('Error creating cytoscape instance:', error);
            }
        }, 100);

        // Cleanup function for useEffect
        return () => {
            clearTimeout(timeoutId);
            cleanup();
        };
    }, [data]);

    return (
        <div>
            <p>CharacterGraph component rendered</p>
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '600px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9'
                }}
            />
        </div>
    );
}

export default CharacterGraph;