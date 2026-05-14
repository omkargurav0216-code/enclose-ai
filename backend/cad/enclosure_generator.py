import cadquery as cq

from schema.pcb_schema import (
    PCBMetadata,
    MountingHole,
    Connector
)


class EnclosureGenerator:

    def __init__(self, pcb_data: PCBMetadata):

        self.pcb_data = pcb_data

        self.padding = 10.0
        self.base_height = 25.0
        self.pcb_clearance = 5.0

    def generate_shell(self):

        board = self.pcb_data.board
        enclosure = self.pcb_data.enclosure

        wall = enclosure.wall_thickness # type: ignore

        outer_width = (
            board.width +
            (self.padding * 2)
        )

        outer_height = (
            board.height +
            (self.padding * 2)
        )

        inner_width = outer_width - (wall * 2)

        inner_height = outer_height - (wall * 2)

        outer_box = (
            cq.Workplane("XY")
            .box(
                outer_width,
                outer_height,
                self.base_height
            )
            .translate(
                (0, 0, self.base_height / 2)
            )
        )

        inner_box = (
            cq.Workplane("XY")
            .box(
                inner_width,
                inner_height,
                self.base_height - wall
            )
            .translate(
                (
                    0,
                    0,
                    wall +
                    (
                        (self.base_height - wall)
                        / 2
                    )
                )
            )
        )

        shell = outer_box.cut(inner_box)

        return shell

    def create_standoff(
        self,
        hole: MountingHole
    ):

        standoff_height = (
            self.pcb_clearance
        )

        outer_radius = (
            hole.diameter + 4
        ) / 2

        x = (
            hole.x -
            (self.pcb_data.board.width / 2)
        )

        y = (
            hole.y -
            (self.pcb_data.board.height / 2)
        )

        standoff = (

            cq.Workplane("XY")

            .center(x, y)

            .circle(outer_radius)

            .extrude(standoff_height)

            .faces(">Z")

            .workplane()

            .hole(
                hole.diameter,
                depth=standoff_height
            )
        )

        return standoff

    def create_connector_cutout(
        self,
        connector: Connector
    ):

        board = self.pcb_data.board

        enclosure = self.pcb_data.enclosure

        wall = enclosure.wall_thickness # type: ignore

        outer_width = (
            board.width +
            (self.padding * 2)
        )

        outer_height = (
            board.height +
            (self.padding * 2)
        )

        x = (
            connector.x -
            (board.width / 2)
        )

        y = (
            connector.y -
            (board.height / 2)
        )

        cutout_depth = wall + 2

        z_center = (
            self.pcb_clearance + 5
        )

        if connector.face == "front":

            return (
                cq.Workplane("XY")
                .center(
                    x,
                    -outer_height / 2
                )
                .box(
                    connector.width,
                    cutout_depth,
                    connector.height
                )
                .translate(
                    (
                        0,
                        0,
                        z_center
                    )
                )
            )

        elif connector.face == "back":

            return (
                cq.Workplane("XY")
                .center(
                    x,
                    outer_height / 2
                )
                .box(
                    connector.width,
                    cutout_depth,
                    connector.height
                )
                .translate(
                    (
                        0,
                        0,
                        z_center
                    )
                )
            )

        elif connector.face == "left":

            return (
                cq.Workplane("XY")
                .center(
                    -outer_width / 2,
                    y
                )
                .box(
                    cutout_depth,
                    connector.width,
                    connector.height
                )
                .translate(
                    (
                        0,
                        0,
                        z_center
                    )
                )
            )

        elif connector.face == "right":

            return (
                cq.Workplane("XY")
                .center(
                    outer_width / 2,
                    y
                )
                .box(
                    cutout_depth,
                    connector.width,
                    connector.height
                )
                .translate(
                    (
                        0,
                        0,
                        z_center
                    )
                )
            )

        else:

            raise ValueError(
                f"Unsupported connector face: "
                f"{connector.face}"
            )

    def validate_mounting_holes(self):

        board = self.pcb_data.board

        margin = 3.0

        for hole in self.pcb_data.mounting_holes:

            if hole.x < margin:
                raise ValueError(
                    "Mounting hole too close to left edge"
                )

            if hole.y < margin:
                raise ValueError(
                    "Mounting hole too close to bottom edge"
                )

            if hole.x > (board.width - margin):
                raise ValueError(
                    "Mounting hole too close to right edge"
                )

            if hole.y > (board.height - margin):
                raise ValueError(
                    "Mounting hole too close to top edge"
                )

    def generate_complete_enclosure(self):

        self.validate_mounting_holes()

        enclosure = self.generate_shell()

        for connector in self.pcb_data.connectors:

            cutout = (
                self.create_connector_cutout(
                    connector
                )
            )

            enclosure = enclosure.cut(
                cutout
            )

        for hole in self.pcb_data.mounting_holes:

            standoff = self.create_standoff(
                hole
            )

            enclosure = enclosure.union(
                standoff
            )

        return enclosure