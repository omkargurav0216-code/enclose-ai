import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend
} from "recharts";


interface Props {
  efficiency: number;
}


const VolumeEfficiencyChart = ({
  efficiency
}: Props) => {

  const data = [
    {
      name: "Used Volume",
      value: efficiency
    },
    {
      name: "Unused Volume",
      value: 100 - efficiency
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
        Volume Efficiency
      </h3>

      <ResponsiveContainer>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >

            {data.map(
              (_, index) => (
                <Cell
                  key={index}
                />
              )
            )}

          </Pie>

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
};

export default VolumeEfficiencyChart;