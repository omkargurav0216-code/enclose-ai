import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer
} from "recharts";


interface Props {
  score: number;
}


const OverallScoreChart = ({
  score
}: Props) => {

  const data = [
    {
      name: "Score",
      value: score
    }
  ];

  return (

    <div
      style={{
        width: "100%",
        height: 300
      }}
    >

      <h3>
        Overall Engineering Score
      </h3>

      <ResponsiveContainer>

        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
        >

          <RadialBar
            dataKey="value"
            cornerRadius={10}
          />

          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="28"
          >
            {score}/100
          </text>

        </RadialBarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default OverallScoreChart;