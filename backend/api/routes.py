from uuid import uuid4
from pathlib import Path

from fastapi import (
    APIRouter,
    HTTPException,
    Query
)

from fastapi.responses import (
    FileResponse
)

from schema.pcb_schema import (
    PCBMetadata
)

from cad.enclosure_generator import (
    EnclosureGenerator
)

from analysis.enclosure_analysis import (
    EnclosureAnalysis
)

from exporters.export_manager import (
    ExportManager
)

router = APIRouter()


@router.get("/health")
def health_check():

    return {
        "status": "ok",
        "service": "EnclosureAI Backend"
    }


@router.post("/generate")
def generate_enclosure(
    payload: PCBMetadata,
    format: str = Query(
        default="stl"
    )
):

    try:

        generator = (
            EnclosureGenerator(payload)
        )

        model = (
            generator
            .generate_complete_enclosure()
        )

        exporter = (
            ExportManager()
        )

        if format == "step":

            extension = "step"

            filename = (
                f"{uuid4()}.step"
            )

            exporter.export_step(
                model,
                filename
            )

        else:

            extension = "stl"

            filename = (
                f"{uuid4()}.stl"
            )

            exporter.export_stl(
                model,
                filename
            )

        analysis = (
            EnclosureAnalysis(payload)
        )

        report = (
            analysis
            .generate_report()
        )

        return {

            "message":
                (
                    "Enclosure generated "
                    "successfully"
                ),

            "file_type":
                extension,

            "file_name":
                filename,

            "download_url":
                (
                    f"/download/{filename}"
                ),

            "analysis":
                report
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get(
    "/download/{filename}"
)
def download_file(
    filename: str
):

    file_path = (
        Path("exports")
        / filename
    )

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type=(
            "application/octet-stream"
        )
    )