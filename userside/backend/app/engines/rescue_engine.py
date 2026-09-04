import math

from app.engines.flood_engine import load_campus_data
from app.engines.risk_engine import calculate_all_risks


def calculate_distance(x1, y1, x2, y2):
    """
    Calculate straight-line distance between two points.
    """

    return math.sqrt(
        (x2 - x1) ** 2 +
        (y2 - y1) ** 2
    )


def get_available_rescue_teams():
    """
    Return currently available rescue teams.
    """

    campus = load_campus_data()

    available_teams = []

    for team in campus["rescue_teams"]:

        if team["available"]:

            available_teams.append(team)

    return available_teams


def allocate_rescue_teams(water_level):
    """
    Assign the nearest available rescue team
    to high-risk flood-affected buildings.
    """

    campus = load_campus_data()

    risk_data = calculate_all_risks(water_level)

    risk_assessment = risk_data["risk_assessment"]

    building_map = {
        building["id"]: building
        for building in campus["buildings"]
    }

    available_teams = get_available_rescue_teams()

    allocations = []

    # Prioritize highest risk buildings
    priority_buildings = sorted(
        risk_assessment,
        key=lambda building: building["risk_score"],
        reverse=True
    )

    used_teams = set()

    for risk_building in priority_buildings:

        # Only dispatch to medium, high, and critical risk zones
        if risk_building["risk_level"] not in [
            "MEDIUM",
            "HIGH",
            "CRITICAL"
        ]:
            continue

        building = building_map[risk_building["id"]]

        nearest_team = None
        shortest_distance = float("inf")

        for team in available_teams:

            # Do not reuse an already assigned team
            if team["id"] in used_teams:
                continue

            distance = calculate_distance(
                building["x"],
                building["y"],
                team["x"],
                team["y"]
            )

            if distance < shortest_distance:

                shortest_distance = distance
                nearest_team = team

        if nearest_team:

            used_teams.add(nearest_team["id"])

            allocations.append({
                "building_id": building["id"],
                "building_name": building["name"],
                "risk_level": risk_building["risk_level"],
                "risk_score": risk_building["risk_score"],
                "rescue_team_id": nearest_team["id"],
                "rescue_team_name": nearest_team["name"],
                "estimated_distance": round(
                    shortest_distance,
                    2
                ),
                "team_capacity": nearest_team["capacity"]
            })

    return {
        "disaster_type": "FLOOD",
        "water_level": water_level,
        "available_teams": len(available_teams),
        "teams_allocated": len(allocations),
        "allocations": allocations
    }