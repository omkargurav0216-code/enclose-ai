from pathlib import Path

import cadquery as cq


EXPORT_DIR = Path("exports")

EXPORT_DIR.mkdir(
    exist_ok=True
)


class ExportManager:

    def export_stl(
        self,
        model,
        filename: str
    ):

        output_path = (
            EXPORT_DIR / filename
        )

        cq.exporters.export(
            model,
            str(output_path)
        )

        return str(output_path)

    def export_step(
        self,
        model,
        filename: str
    ):

        output_path = (
            EXPORT_DIR / filename
        )

        cq.exporters.export(
            model,
            str(output_path)
        )

        return str(output_path)