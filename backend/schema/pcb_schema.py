from pydantic import BaseModel, Field
from typing import List, Optional


class MountingHole(BaseModel):
    x: float
    y: float
    diameter: float = Field(default=3.0, gt=0)


class Connector(BaseModel):
    name: str
    x: float
    y: float
    width: float
    height: float
    face: str = "front"


class EnclosurePreferences(BaseModel):
    wall_thickness: float = Field(default=2.0, gt=0)
    lid_type: str = "screw"


class Board(BaseModel):
    width: float = Field(..., gt=0)
    height: float = Field(..., gt=0)
    thickness: float = Field(..., gt=0)


class PCBMetadata(BaseModel):
    board: Board
    mounting_holes: List[MountingHole] = []
    connectors: List[Connector] = []
    enclosure: Optional[
        EnclosurePreferences
    ] = EnclosurePreferences()