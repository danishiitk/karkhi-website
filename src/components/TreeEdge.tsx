import { BaseEdge, EdgeProps } from '@xyflow/react';

export default function TreeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) {
  // Family tree style orthogonal routing:
  // 1. Go down vertically from the father
  // 2. Go horizontally to align with the son
  // 3. Go down vertically to the son
  
  // Calculate the midpoint vertically
  const midY = sourceY + (targetY - sourceY) / 2;
  
  // Create the exact SVG path
  const edgePath = `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;

  return (
    <>
      <BaseEdge 
        id={id} 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          stroke: '#2d6a4f', 
          strokeWidth: 2,
          opacity: 0.6,
          strokeLinejoin: 'round', // Makes the 90 degree corners slightly softer
        }} 
      />
      {/* Invisible thicker path for easier hovering/clicking if needed */}
      <BaseEdge 
        id={`${id}-interaction`} 
        path={edgePath} 
        style={{ stroke: 'transparent', strokeWidth: 20 }} 
      />
    </>
  );
}
