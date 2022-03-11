import { useCallback, useState, createRef } from "react";
import ReactDOM from "react-dom";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.name === "Empty vote" ? "white" : fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={payload.name === "Empty vote" ? "white" : fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={payload.name === "Empty vote" ? "white" : fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={payload.name === "Empty vote" ? "white" : fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fontSize={11}
        fontStretch={0}
        fill="#999"
      >{`${payload.name}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={12}
        textAnchor={textAnchor}
        fontSize={11}
        fill="#666"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};
const renderActiveShapeSM = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} fontSize="12px" textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} dy={8} fontSize="12px" textAnchor="middle" fill={fill}>
        Rate {(percent * 100).toFixed(2)}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.name === "Empty vote" ? "white" : fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={payload.name === "Empty vote" ? "white" : fill}
      />
    </g>
  );
};

const COLORS = ['#fcbfff', '#96abe8', '#94f794', '#f7ab96', '#f9aed8', '#a3f989', '#80bcfc', '#ef75e5', '#adffce', '#bae86a', '#e1c6ff', '#766be5', '#fc88f4', '#8bf4ab', '#a1ed6a', '#86f9cf', '#dcccff', '#fcbff1', '#f9b298', '#98cef2', '#f799fc', '#aceef9', '#f38cff', '#abfcbd', '#8eb7ed', '#6996db', '#ed89e3', '#f2a2aa'];

export const VotingChart = ({ data }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  var pieData = data.length > 0 ? data : [{ name: "Empty vote", value: 100 }]
  data.map((item: any) => {
    item.value === undefined && (pieData = [{ name: "Empty vote", value: 100 }])
  })

  var ccxLG = document.getElementById("parentContainerLG")?.clientWidth / 2
  var ccxSM = document.getElementById("parentContainerSM")?.clientWidth / 2

  return (
    <>
      <div id="parentContainerLG" className="hidden md:grid">
        <PieChart width={480} height={280}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={pieData}
            cx={ccxLG}
            cy={125}
            innerRadius={0}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {data.map((_entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
      <div id="parentContainerSM" className="grid md:hidden">
        <PieChart width={768} height={280}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShapeSM}
            data={pieData}
            cx={ccxSM}
            cy={125}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {data.map((_entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </>
  );
}