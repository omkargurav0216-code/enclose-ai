interface JSONUploadProps {

  onJSONLoaded: (
    data: unknown
  ) => void;
}


const JSONUpload = ({
  onJSONLoaded
}: JSONUploadProps) => {

  const handleFileUpload = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = (
      event
    ) => {

      try {

        const json =
          JSON.parse(
            String(
              event.target?.result
            )
          );

        onJSONLoaded(json);

      } catch {

        alert(
          "Invalid JSON file"
        );
      }
    };

    reader.readAsText(file);
  };

  return (

    <div>

      <h2
        className="
          text-xl
          font-semibold
          mb-4
        "
      >
        Import PCB Metadata
      </h2>

      <label
        className="
          flex
          items-center
          justify-center
          border
          border-dashed
          border-slate-600
          rounded-xl
          p-8
          cursor-pointer
          hover:border-accent
          transition
        "
      >

        <input
          type="file"
          accept=".json"
          onChange={
            handleFileUpload
          }
          className="hidden"
        />

        <span
          className="
            text-slate-400
          "
        >
          Upload JSON File
        </span>

      </label>

    </div>
  );
};

export default JSONUpload;