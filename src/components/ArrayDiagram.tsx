const GROUP_COLORS = [
  { fill: 'hsl(0, 70%, 90%)', stroke: 'hsl(0, 70%, 60%)' },
  { fill: 'hsl(45, 70%, 90%)', stroke: 'hsl(45, 70%, 60%)' },
  { fill: 'hsl(120, 70%, 90%)', stroke: 'hsl(120, 70%, 60%)' },
  { fill: 'hsl(200, 70%, 90%)', stroke: 'hsl(200, 70%, 60%)' },
  { fill: 'hsl(270, 70%, 90%)', stroke: 'hsl(270, 70%, 60%)' },
  { fill: 'hsl(320, 70%, 90%)', stroke: 'hsl(320, 70%, 60%)' },
];

interface ArrayDiagramProps {
  numGroups: number;
  groupSize: number;
  missingSlot?: 'product' | 'multiplier' | 'multiplicand' | 'none';
  objectEmoji?: string;
  animated?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export default function ArrayDiagram({
  numGroups,
  groupSize,
  missingSlot = 'none',
  objectEmoji = '⭐',
  animated = false,
  size = 'medium',
  showLabel = true,
}: ArrayDiagramProps) {
  const circleRadius = size === 'large' ? 48 : size === 'medium' ? 38 : 28;
  const dotSize = size === 'large' ? 18 : size === 'medium' ? 14 : 10;
  const groupsPerRow = Math.min(numGroups, 5);
  const numRows = Math.ceil(numGroups / groupsPerRow);
  const svgWidth = groupsPerRow * (circleRadius * 2 + 20) + 20;
  const svgHeight = numRows * (circleRadius * 2 + 40) + (showLabel ? 40 : 10);
  const total = numGroups * groupSize;

  return (
    <div className="group-diagram-container">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '100%', height: 'auto', maxHeight: 300 }}
      >
        {Array(numGroups)
          .fill(0)
          .map((_, gi) => {
            const row = Math.floor(gi / groupsPerRow);
            const col = gi % groupsPerRow;
            const rowGroupCount = Math.min(numGroups - row * groupsPerRow, groupsPerRow);
            const rowOffset = (groupsPerRow - rowGroupCount) * (circleRadius + 10);
            const cx = col * (circleRadius * 2 + 20) + circleRadius + 10 + rowOffset;
            const cy = row * (circleRadius * 2 + 40) + circleRadius + 20;
            const color = GROUP_COLORS[gi % GROUP_COLORS.length];

            return (
              <g
                key={gi}
                style={animated ? { animation: `groupCirclePop 0.4s ease ${gi * 0.12}s both` } : {}}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={circleRadius}
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth="2.5"
                />
                {Array(groupSize)
                  .fill(0)
                  .map((_, di) => {
                    const angle = (di / groupSize) * 2 * Math.PI - Math.PI / 2;
                    const r = groupSize === 1 ? 0 : circleRadius * 0.55;
                    const dx = cx + r * Math.cos(angle);
                    const dy = cy + r * Math.sin(angle);
                    return (
                      <text
                        key={di}
                        x={dx}
                        y={dy + dotSize / 3}
                        textAnchor="middle"
                        fontSize={dotSize}
                        style={
                          animated
                            ? { animation: `dotCountUp 0.3s ease ${(gi * groupSize + di) * 0.08}s both` }
                            : {}
                        }
                      >
                        {objectEmoji}
                      </text>
                    );
                  })}
                <text x={cx} y={cy + circleRadius + 16} textAnchor="middle" fontSize="13" fill="#555" fontWeight="500">
                  {missingSlot === 'multiplier' ? '?' : groupSize}
                </text>
              </g>
            );
          })}
        {showLabel && (
          <text x={svgWidth / 2} y={svgHeight - 6} textAnchor="middle" fontSize="15" fill="#333" fontWeight="bold">
            {`${missingSlot === 'multiplicand' ? '?' : numGroups} × ${missingSlot === 'multiplier' ? '?' : groupSize} = ${missingSlot === 'product' ? '?' : total}`}
          </text>
        )}
      </svg>
    </div>
  );
}
