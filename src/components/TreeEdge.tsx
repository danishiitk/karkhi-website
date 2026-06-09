import { type EdgeProps, getBezierPath } from "@xyflow/react";

/**
 * Custom family-tree bracket edge.
 *
 * Each edge independently draws:
 *   sourceX,sourceY  →  down to midY  →  across to targetX  →  down to targetY
 *
 * Because every sibling edge shares the same sourceY (the father's bottom)
 * and the same midY, all the vertical stems from the father overlap into
 * one line, and the horizontal segments overlap into one bar.  The result
 * is the classic bracket / comb pattern.
 */
export default function TreeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
}: EdgeProps) {
  // The horizontal bar sits exactly halfway between father bottom and child top
  const midY = sourceY + (targetY - sourceY) / 2;

  const path = [
    `M ${sourceX} ${sourceY}`,    // start at father's bottom center
    `L ${sourceX} ${midY}`,       // vertical stem down to the bar
    `L ${targetX} ${midY}`,       // horizontal bar across to child's column
    `L ${targetX} ${targetY}`,    // vertical drop down to child's top
  ].join(" ");

  return (
    <path
      id={id}
      d={path}
      fill="none"
      stroke={style?.stroke ?? "#94a3b8"}
      strokeWidth={style?.strokeWidth ?? 1.5}
      style={{ pointerEvents: "none" }}
    />
  );
}
