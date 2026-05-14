import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts";


interface Props {
  metrics: any;
}


const MetricsRadarChart = ({
  metrics
}: Props) => {

  const data = Object.entries(metrics)
    .map(
      ([key, value]: any) => ({
        metric:
          key.replaceAll("_", " "),
        score:
          value.score
      })
    );

  return (

    <div
      style={{
        width: "100%",
        height: 400
      }}
    >

      <h3>
        Engineering Metric Breakdown
      </h3>

      <ResponsiveContainer>

        <RadarChart data={data}>

          <PolarGrid />

          <PolarAngleAxis
            dataKey="metric"
          />

          <PolarRadiusAxis
            domain={[0, 100]}
          />

          <Radar
            dataKey="score"
            fillOpacity={0.6}
          />

        </RadarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default MetricsRadarChart;