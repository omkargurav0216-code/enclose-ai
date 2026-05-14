import { useState } from "react";

import { motion } from "framer-motion";

import PCBForm from "./components/PCBForm";

import STLViewer from "./components/STLViewer";

import AnalysisPanel from "./components/AnalysisPanel";

import JSONUpload from "./components/JSONUpload";


interface ImportedData {

  board?: {
    width: number;
    height: number;
    thickness: number;
  };

  connectors?: {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    face: string;
  }[];
}


function App() {

  const [stlUrl, setStlUrl] =
    useState("");

  const [analysis, setAnalysis] =
    useState<Record<
      string,
      unknown
    > | null>(null);

  const [
    importedData,
    setImportedData
  ] =
    useState<
      ImportedData | null
    >(null);

  return (

    <div
      className="
        min-h-screen
        bg-background
        text-white
      "
    >

      <header
        className="
          border-b
          border-border
          px-8
          py-6
        "
      >

        <h1
          className="
            text-4xl
            font-bold
            tracking-tight
          "
        >
          EnclosureAI
        </h1>

        <p
          className="
            text-slate-400
            mt-2
          "
        >
          AI-Assisted Procedural
          Electronics Enclosure
          Generator
        </p>

      </header>

      <main
        className="
          p-6
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >

        <motion.div

          initial={{
            opacity: 0,
            x: -20
          }}

          animate={{
            opacity: 1,
            x: 0
          }}

          className="
            xl:col-span-1
            space-y-6
          "
        >

          <div
            className="
              bg-panel
              border
              border-border
              rounded-2xl
              p-6
              shadow-xl
            "
          >

            <JSONUpload
              onJSONLoaded={
                setImportedData
              }
            />

          </div>

          <div
            className="
              bg-panel
              border
              border-border
              rounded-2xl
              p-6
              shadow-xl
            "
          >

            <PCBForm
              importedData={
                importedData
              }

              onModelGenerated={
                (
                  url,
                  analysisData
                ) => {

                  setStlUrl(url);

                  setAnalysis(
                    analysisData
                  );
                }
              }
            />

          </div>

        </motion.div>

        <motion.div

          initial={{
            opacity: 0,
            y: 20
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          className="
            xl:col-span-2
            space-y-6
          "
        >

          <div
            className="
              bg-panel
              border
              border-border
              rounded-2xl
              overflow-hidden
              shadow-xl
            "
          >

            {stlUrl.endsWith(
              ".stl"
            ) ? (

              <STLViewer
                stlUrl={stlUrl}
              />

            ) : (

              <div
                className="
                  h-[600px]
                  flex
                  items-center
                  justify-center
                  text-slate-500
                "
              >

                Generate an STL
                enclosure to preview
                the model.

              </div>
            )}

          </div>

          <div
            className="
              bg-panel
              border
              border-border
              rounded-2xl
              p-6
              shadow-xl
            "
          >

            <AnalysisPanel
              analysis={
                analysis
              }
            />

          </div>

        </motion.div>

      </main>

    </div>
  );
}

export default App;