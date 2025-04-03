"use client";
import { Download } from "lucide-react";
import React, { useRef } from "react";
import ReactFlow, { MiniMap, Controls, Background,} from "reactflow";
import "reactflow/dist/style.css";
import DomToImage from "dom-to-image";
import jsPDF from "jspdf";


 const data = {
    "mindMapData": {
      "nodes": [
        {
          "id": "1",
          "data": {
            "label": "Learn Data Structures"
          },
          "position": {
            "x": 0,
            "y": 0
          },
          "style": {
            "background": "#6D28D9",
            "color": "#fff",
            "border": "2px solid #4C1D95",
            "borderRadius": "10px",
            "padding": "10px"
          }
        },
        {
          "id": "2",
          "data": {
            "label": "Arrays"
          },
          "position": {
            "x": -400,
            "y": 200
          },
          "style": {
            "background": "#F97316",
            "color": "#fff",
            "border": "2px solid #C2410C",
            "borderRadius": "8px",
            "padding": "8px"
          }
        },
        {
          "id": "3",
          "data": {
            "label": "Linked Lists"
          },
          "position": {
            "x": -200,
            "y": 200
          },
          "style": {
            "background": "#22C55E",
            "color": "#fff",
            "border": "2px solid #16A34A",
            "borderRadius": "8px",
            "padding": "8px"
          }
        },
        {
          "id": "4",
          "data": {
            "label": "Stacks"
          },
          "position": {
            "x": 0,
            "y": 200
          },
          "style": {
            "background": "#0EA5E9",
            "color": "#fff",
            "border": "2px solid #0284C7",
            "borderRadius": "8px",
            "padding": "8px"
          }
        },
        {
          "id": "5",
          "data": {
            "label": "Queues"
          },
          "position": {
            "x": 200,
            "y": 200
          },
          "style": {
            "background": "#EAB308",
            "color": "#fff",
            "border": "2px solid #CA8A04",
            "borderRadius": "8px",
            "padding": "8px"
          }
        },
        {
          "id": "6",
          "data": {
            "label": "Trees"
          },
          "position": {
            "x": 400,
            "y": 200
          },
          "style": {
            "background": "#DB2777",
            "color": "#fff",
            "border": "2px solid #BE185D",
            "borderRadius": "8px",
            "padding": "8px"
          }
        },
        {
          "id": "7",
          "data": {
            "label": "Graphs"
          },
          "position": {
            "x": 600,
            "y": 200
          },
          "style": {
            "background": "#A855F7",
            "color": "#fff",
            "border": "2px solid #7E22CE",
            "borderRadius": "8px",
            "padding": "8px"
          }
        },
        {
          "id": "8",
          "data": {
            "label": "Hash Tables"
          },
          "position": {
            "x": -300,
            "y": 400
          },
          "style": {
            "background": "#EC4899",
            "color": "#fff",
            "border": "2px solid #BE185D",
            "borderRadius": "8px",
            "padding": "8px"
          }
        },
        {
          "id": "9",
          "data": {
            "label": "Heap",
            "description": "Priority Queue"
          },
          "position": {
            "x": 300,
            "y": 400
          },
          "style": {
            "background": "#64748B",
            "color": "#fff",
            "border": "2px solid #475569",
            "borderRadius": "8px",
            "padding": "8px"
          }
        },
        {
          "id": "10",
          "data": {
            "label": "Time Complexity",
            "description": "Big O Notation"
          },
          "position": {
            "x": -600,
            "y": 200
          },
          "style": {
            "background": "#14B8A6",
            "color": "#fff",
            "border": "2px solid #0E7490",
            "borderRadius": "8px",
            "padding": "8px"
          }
        }
      ],
      "edges": [
        {
          "id": "e1-2",
          "source": "1",
          "target": "2",
          "style": {
            "stroke": "#F97316",
            "strokeWidth": 2
          }
        },
        {
          "id": "e1-3",
          "source": "1",
          "target": "3",
          "style": {
            "stroke": "#22C55E",
            "strokeWidth": 2
          }
        },
        {
          "id": "e1-4",
          "source": "1",
          "target": "4",
          "style": {
            "stroke": "#0EA5E9",
            "strokeWidth": 2
          }
        },
        {
          "id": "e1-5",
          "source": "1",
          "target": "5",
          "style": {
            "stroke": "#EAB308",
            "strokeWidth": 2
          }
        },
        {
          "id": "e1-6",
          "source": "1",
          "target": "6",
          "style": {
            "stroke": "#DB2777",
            "strokeWidth": 2
          }
        },
        {
          "id": "e1-7",
          "source": "1",
          "target": "7",
          "style": {
            "stroke": "#A855F7",
            "strokeWidth": 2
          }
        },
        {
          "id": "e2-8",
          "source": "2",
          "target": "8",
          "style": {
            "stroke": "#EC4899",
            "strokeWidth": 2
          }
        },
        {
          "id": "e5-9",
          "source": "5",
          "target": "9",
          "style": {
            "stroke": "#64748B",
            "strokeWidth": 2
          }
        },
        {
          "id": "e1-10",
          "source": "1",
          "target": "10",
          "style": {
            "stroke": "#14B8A6",
            "strokeWidth": 2
          }
        }
      ]
    }
  }
  const initialNodes = data?.mindMapData?.nodes || [];
  const initialEdges = data?.mindMapData?.edges || [];

export default function MindMap() {
    const nodes =initialNodes;
    const edges = initialEdges
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!reactFlowWrapper.current) return;
        const imgData = await DomToImage.toPng(reactFlowWrapper.current);
        const pdf = new jsPDF("landscape", "mm", "a4");
        const imgWidth = 280;
        const imgHeight = (imgWidth * reactFlowWrapper.current.clientHeight) / reactFlowWrapper.current.clientWidth
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("mindmap.pdf");
    };

    const saveAsImage = async () => {
        if (!reactFlowWrapper.current) return;
        try {
            const imgData = await DomToImage.toPng(reactFlowWrapper.current);
            console.log(imgData);
            const link = document.createElement("a");
            link.href = imgData;
            link.download = "mindMap.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error saving image:", error);
        }
    };

    return (
        <div className="bg-[#1E1C26] w-screen h-screen flex flex-col items-center justify-center">
            <div className="flex gap-4 mb-4">
                <button
                    onClick={downloadPDF}
                    className="bg-[1E1C26] border-gray-200 dark:border-gray-700  text-white px-4 py-2 rounded-md shadow-md flex items-center gap-2 cursor-pointer"
                >
                    <Download size={20} /> Download PDF
                </button>
                <button
                    onClick={saveAsImage}
                    className="bg-[1E1C26] text-white px-4 py-2 rounded-md shadow-md flex items-center gap-2 cursor-pointer"
                >
                    <Download size={20} /> Download Image
                </button>
            </div>

            <div ref={reactFlowWrapper} className="w-4/5 h-4/5 bg-white rounded-lg shadow-lg">
                <ReactFlow nodes={nodes} edges={edges}>
                    <MiniMap />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </div>
    );
}
