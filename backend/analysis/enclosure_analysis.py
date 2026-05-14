from schema.pcb_schema import PCBMetadata


class EnclosureAnalysis:

    def __init__(
        self,
        pcb_data: PCBMetadata
    ):

        self.pcb_data = pcb_data

    def wall_thickness_score(self):

        wall = (
            self.pcb_data
            .enclosure
            .wall_thickness # type: ignore
        )

        if wall < 1.2:

            return {
                "score": 20,
                "status": "poor",
                "message": (
                    "Wall thickness too thin "
                    "for reliable printing"
                )
            }

        elif wall < 2.0:

            return {
                "score": 70,
                "status": "acceptable",
                "message": (
                    "Wall thickness is printable "
                    "but could be stronger"
                )
            }

        else:

            return {
                "score": 100,
                "status": "excellent",
                "message": (
                    "Wall thickness is robust"
                )
            }

    def connector_accessibility_score(self):

        connectors = (
            self.pcb_data.connectors
        )

        if len(connectors) == 0:

            return {
                "score": 80,
                "status": "good",
                "message": (
                    "No external connectors"
                )
            }

        crowded = False

        for connector in connectors:

            if (
                connector.width < 8
                or
                connector.height < 4
            ):

                crowded = True

        if crowded:

            return {
                "score": 60,
                "status": "warning",
                "message": (
                    "Some connectors may "
                    "be difficult to access"
                )
            }

        return {
            "score": 100,
            "status": "excellent",
            "message": (
                "Connector accessibility "
                "looks good"
            )
        }

    def mounting_stability_score(self):

        holes = (
            self.pcb_data.mounting_holes
        )

        if len(holes) < 4:

            return {
                "score": 50,
                "status": "warning",
                "message": (
                    "PCB may not be securely "
                    "mounted"
                )
            }

        return {
            "score": 100,
            "status": "excellent",
            "message": (
                "PCB mounting appears stable"
            )
        }

    def volume_efficiency_score(self):

        board = self.pcb_data.board

        enclosure_area = (
            (board.width + 20)
            *
            (board.height + 20)
        )

        pcb_area = (
            board.width *
            board.height
        )

        efficiency = (
            pcb_area /
            enclosure_area
        )

        score = int(
            efficiency * 100
        )

        if score > 75:

            status = "excellent"

        elif score > 50:

            status = "good"

        else:

            status = "poor"

        return {
            "score": score,
            "status": status,
            "message": (
                f"Volume efficiency is "
                f"{score}%"
            )
        }

    def overall_score(
        self,
        metrics
    ):

        total = sum(
            metric["score"]
            for metric in metrics.values()
        )

        return int(
            total / len(metrics)
        )

    def generate_report(self):

        metrics = {

            "wall_thickness":
                self.wall_thickness_score(),

            "connector_accessibility":
                self.connector_accessibility_score(),

            "mounting_stability":
                self.mounting_stability_score(),

            "volume_efficiency":
                self.volume_efficiency_score()
        }

        overall = self.overall_score(
            metrics
        )

        recommendations = []

        if (
            metrics["wall_thickness"]["score"]
            < 70
        ):

            recommendations.append(
                "Increase wall thickness "
                "for better durability"
            )

        if (
            metrics[
                "connector_accessibility"
            ]["score"] < 70
        ):

            recommendations.append(
                "Increase connector cutout "
                "dimensions"
            )

        if (
            metrics[
                "mounting_stability"
            ]["score"] < 70
        ):

            recommendations.append(
                "Use at least four "
                "mounting standoffs"
            )

        return {
            "overall_score": overall,
            "metrics": metrics,
            "recommendations":
                recommendations
        }