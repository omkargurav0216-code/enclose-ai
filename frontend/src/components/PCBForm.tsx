import { useEffect, useState } from "react";
import axios from "axios";

import api from "../api/client";

interface Connector {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  face: "front" | "back" | "left" | "right";
}

interface AnalysisReport {
  overall_score: number;
  metrics: Record<string, unknown>;
  recommendations: string[];
}

interface ImportedData {
  board?: {
    width: number;
    height: number;
    thickness: number;
  };

  connectors?: Connector[];
}

interface PCBFormProps {
  onModelGenerated: (
    stlUrl: string,
    analysis: AnalysisReport
  ) => void;

  importedData?: ImportedData | null;
}

const inputStyles = `
  w-full
  bg-slate-950
  border
  border-slate-700
  rounded-lg
  px-3
  py-2
  text-white
  focus:outline-none
  focus:border-accent
  transition
`;

const sectionStyles = `
  bg-slate-900
  border
  border-slate-800
  rounded-2xl
  p-6
`;

const secondaryButtonStyles = `
  bg-slate-800
  hover:bg-slate-700
  transition
  px-4
  py-2
  rounded-lg
  font-medium
`;

const primaryButtonStyles = `
  bg-accent
  hover:opacity-90
  transition
  px-4
  py-3
  rounded-lg
  font-medium
`;

const PCBForm = ({
  onModelGenerated,
  importedData
}: PCBFormProps) => {

  const [formData, setFormData] =
    useState({
      width: 80,
      height: 50,
      thickness: 1.6
    });

  const [connectors, setConnectors] =
    useState<Connector[]>([]);

  const [response, setResponse] =
    useState("");

  const [downloadUrl, setDownloadUrl] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [exportFormat, setExportFormat] =
    useState("stl");

  useEffect(() => {

    if (!importedData) {
      return;
    }

    setFormData((prev) => {

      const next = {
        width:
          importedData.board?.width ?? 80,

        height:
          importedData.board?.height ?? 50,

        thickness:
          importedData.board?.thickness ?? 1.6
      };

      const unchanged =
        prev.width === next.width &&
        prev.height === next.height &&
        prev.thickness === next.thickness;

      return unchanged
        ? prev
        : next;
    });

    if (importedData.connectors) {

      setConnectors((prev) => {

        const prevJson =
          JSON.stringify(prev);

        const nextJson =
          JSON.stringify(
            importedData.connectors
          );

        return prevJson === nextJson
          ? prev
          : importedData.connectors;
      });
    }

  }, [importedData]);

  const addConnector = () => {

    setConnectors([
      ...connectors,
      {
        name: "USB-C",
        x: 40,
        y: 0,
        width: 12,
        height: 6,
        face: "front"
      }
    ]);
  };

  const removeConnector = (
    index: number
  ) => {

    const updated =
      connectors.filter(
        (_, i) => i !== index
      );

    setConnectors(updated);
  };

  const updateConnector = (
    index: number,
    field: keyof Connector,
    value: string | number
  ) => {

    const updated =
      [...connectors];

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    setConnectors(updated);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setLoading(true);

    setError("");
    setResponse("");
    setDownloadUrl("");

    try {

      const edgeOffset = 5;

      const payload = {

        board: {
          width: Number(formData.width),
          height: Number(formData.height),
          thickness: Number(formData.thickness)
        },

        mounting_holes: [
          {
            x: edgeOffset,
            y: edgeOffset,
            diameter: 3
          },
          {
            x:
              Number(formData.width)
              - edgeOffset,

            y: edgeOffset,
            diameter: 3
          },
          {
            x: edgeOffset,
            y:
              Number(formData.height)
              - edgeOffset,

            diameter: 3
          },
          {
            x:
              Number(formData.width)
              - edgeOffset,

            y:
              Number(formData.height)
              - edgeOffset,

            diameter: 3
          }
        ],

        connectors,

        enclosure: {
          wall_thickness: 2,
          lid_type: "screw"
        }
      };

      const result = await api.post(
        `/generate?format=${exportFormat}`,
        payload
      );

      setResponse(
        result.data.message
      );

      const fullUrl =
        `http://127.0.0.1:8000${result.data.download_url}`;

      setDownloadUrl(fullUrl);

      onModelGenerated(
        fullUrl,
        result.data.analysis
      );

    } catch (err: unknown) {

      if (axios.isAxiosError(err)) {

        const detail =
          err.response?.data?.detail;

        if (Array.isArray(detail)) {

          const messages =
            detail.map(
              (d) =>
                `${d.loc.join(" → ")}: ${d.msg}`
            );

          setError(
            messages.join("\n")
          );

        } else {

          setError(
            detail || "Request failed"
          );
        }

      } else {

        setError(
          "Unexpected error"
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="space-y-6">

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* PCB PARAMETERS */}

        <section className={sectionStyles}>

          <h2 className="text-2xl font-semibold mb-6">
            PCB Parameters
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <div>

              <label className="text-sm text-slate-300">
                Width (mm)
              </label>

              <input
                type="number"
                className={inputStyles}
                value={formData.width}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    width: Number(
                      e.target.value
                    )
                  })
                }
              />

            </div>

            <div>

              <label className="text-sm text-slate-300">
                Height (mm)
              </label>

              <input
                type="number"
                className={inputStyles}
                value={formData.height}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    height: Number(
                      e.target.value
                    )
                  })
                }
              />

            </div>

            <div>

              <label className="text-sm text-slate-300">
                Thickness (mm)
              </label>

              <input
                type="number"
                step="0.1"
                className={inputStyles}
                value={formData.thickness}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    thickness: Number(
                      e.target.value
                    )
                  })
                }
              />

            </div>

          </div>

        </section>

        {/* CONNECTORS */}

        <section className={sectionStyles}>

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-semibold">
              Connectors
            </h2>

            <button
              type="button"
              className={secondaryButtonStyles}
              onClick={addConnector}
            >
              Add Connector
            </button>

          </div>

          <div className="space-y-6">

            {connectors.map(
              (connector, index) => (

                <div
                  key={index}
                  className="
                    bg-slate-950
                    border
                    border-slate-800
                    rounded-xl
                    p-5
                  "
                >

                  <div className="flex items-center justify-between mb-4">

                    <h3 className="text-lg font-medium">
                      Connector {index + 1}
                    </h3>

                    <button
                      type="button"
                      className="
                        bg-red-500
                        hover:opacity-90
                        transition
                        px-3
                        py-2
                        rounded-lg
                        text-sm
                        font-medium
                      "
                      onClick={() =>
                        removeConnector(index)
                      }
                    >
                      Remove
                    </button>

                  </div>

                  <div className="grid md:grid-cols-2 gap-4">

                    <input
                      type="text"
                      placeholder="Name"
                      className={inputStyles}
                      value={connector.name}
                      onChange={(e) =>
                        updateConnector(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                    />

                    <select
                      className={inputStyles}
                      value={connector.face}
                      onChange={(e) =>
                        updateConnector(
                          index,
                          "face",
                          e.target.value
                        )
                      }
                    >
                      <option value="front">
                        Front
                      </option>

                      <option value="back">
                        Back
                      </option>

                      <option value="left">
                        Left
                      </option>

                      <option value="right">
                        Right
                      </option>
                    </select>

                    <input
                      type="number"
                      placeholder="X Position"
                      className={inputStyles}
                      value={connector.x}
                      onChange={(e) =>
                        updateConnector(
                          index,
                          "x",
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />

                    <input
                      type="number"
                      placeholder="Y Position"
                      className={inputStyles}
                      value={connector.y}
                      onChange={(e) =>
                        updateConnector(
                          index,
                          "y",
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />

                    <input
                      type="number"
                      placeholder="Width"
                      className={inputStyles}
                      value={connector.width}
                      onChange={(e) =>
                        updateConnector(
                          index,
                          "width",
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />

                    <input
                      type="number"
                      placeholder="Height"
                      className={inputStyles}
                      value={connector.height}
                      onChange={(e) =>
                        updateConnector(
                          index,
                          "height",
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </section>

        {/* EXPORT */}

        <section className={sectionStyles}>

          <h2 className="text-2xl font-semibold mb-6">
            Export
          </h2>

          <div className="space-y-6">

            <select
              className={inputStyles}
              value={exportFormat}
              onChange={(e) =>
                setExportFormat(
                  e.target.value
                )
              }
            >
              <option value="stl">
                STL
              </option>

              <option value="step">
                STEP
              </option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full
                ${primaryButtonStyles}
                disabled:opacity-50
                disabled:cursor-not-allowed
              `}
            >

              {loading
                ? `Generating ${exportFormat.toUpperCase()}...`
                : `Generate ${exportFormat.toUpperCase()}`}

            </button>

          </div>

        </section>

      </form>

      {/* SUCCESS */}

      {response && (

        <div className={sectionStyles}>

          <p className="text-green-400 mb-4">
            {response}
          </p>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className={primaryButtonStyles}
          >
            Download {exportFormat.toUpperCase()}
          </a>

        </div>

      )}

      {/* ERROR */}

      {error && (

        <div
          className="
            border
            border-red-500
            bg-red-950/30
            rounded-xl
            p-4
          "
        >

          <pre className="text-red-400 whitespace-pre-wrap">
            {error}
          </pre>

        </div>

      )}

    </div>
  );
};

export default PCBForm;