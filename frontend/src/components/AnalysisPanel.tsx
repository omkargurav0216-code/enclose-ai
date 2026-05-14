import OverallScoreChart from "./charts/OverallScoreChart";

import MetricsRadarChart from "./charts/MetricsRadarChart";

import VolumeEfficiencyChart from "./charts/VolumeEfficiencyChart";


interface AnalysisPanelProps {
  analysis: any;
}


const AnalysisPanel = ({
  analysis
}: AnalysisPanelProps) => {

  if (!analysis) {
    return null;
  }

  const volumeEfficiency =
    analysis.metrics
      .volume_efficiency
      .score;

  return (

    <div
      style={{
        marginTop: "2rem"
      }}
    >

      <h2>
        Optimization Report
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem"
        }}
      >

        <div
          style={{
            border: "1px solid #ccc",
            padding: "1rem"
          }}
        >

          <OverallScoreChart
            score={
              analysis.overall_score
            }
          />

        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "1rem"
          }}
        >

          <VolumeEfficiencyChart
            efficiency={
              volumeEfficiency
            }
          />

        </div>

      </div>

      <div
        style={{
          marginTop: "2rem",
          border: "1px solid #ccc",
          padding: "1rem"
        }}
      >

        <MetricsRadarChart
          metrics={
            analysis.metrics
          }
        />

      </div>

      <div
        style={{
          marginTop: "2rem"
        }}
      >

        <h3>
          Recommendations
        </h3>

        {analysis.recommendations
          .length === 0 ? (

          <div
            style={{
              padding: "1rem",
              border:
                "1px solid green"
            }}
          >

            Design looks good.

          </div>

        ) : (

          analysis.recommendations.map(
            (
              recommendation: string,
              index: number
            ) => (

              <div
                key={index}
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  border:
                    "1px solid orange"
                }}
              >

                {recommendation}

              </div>
            )
          )

        )}

      </div>

    </div>
  );
};

export default AnalysisPanel;