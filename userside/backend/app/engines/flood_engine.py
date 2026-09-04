import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "campus.json"


def load_campus_data():
    """Load campus digital twin data."""

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def get_flood_status(elevation, water_level):
    """
    Determine whether a location is flooded.

    If water level is greater than or equal to elevation,
    the location is considered flooded.
    """

    if water_level >= elevation:
        return "FLOODED"

    return "SAFE"


def simulate_flood(water_level: float):
    """
    Run flood simulation for the entire campus.
    """

    campus = load_campus_data()

    flooded_buildings = []
    safe_buildings = []

    blocked_roads = []
    open_roads = []

    blocked_exits = []
    open_exits = []

    affected_population = 0

    # Check buildings
    for building in campus["buildings"]:

        status = get_flood_status(
            building["elevation"],
            water_level
        )

        building_result = {
            "id": building["id"],
            "name": building["name"],
            "population": building["population"],
            "elevation": building["elevation"],
            "status": status
        }

        if status == "FLOODED":
            flooded_buildings.append(building_result)
            affected_population += building["population"]

        else:
            safe_buildings.append(building_result)

    # Check roads
    for road in campus["roads"]:

        status = get_flood_status(
            road["elevation"],
            water_level
        )

        road_result = {
            "id": road["id"],
            "from": road["from"],
            "to": road["to"],
            "distance": road["distance"],
            "elevation": road["elevation"],
            "status": status
        }

        if status == "FLOODED":
            blocked_roads.append(road_result)

        else:
            open_roads.append(road_result)

    # Check exits
    for exit_point in campus["exits"]:

        status = get_flood_status(
            exit_point["elevation"],
            water_level
        )

        exit_result = {
            "id": exit_point["id"],
            "name": exit_point["name"],
            "capacity": exit_point["capacity"],
            "elevation": exit_point["elevation"],
            "status": status
        }

        if status == "FLOODED":
            blocked_exits.append(exit_result)

        else:
            open_exits.append(exit_result)

    # Calculate severity
    total_population = sum(
        building["population"]
        for building in campus["buildings"]
    )

    affected_percentage = round(
        (affected_population / total_population) * 100,
        2
    )

    if affected_percentage == 0:
        severity = "LOW"

    elif affected_percentage < 30:
        severity = "MODERATE"

    elif affected_percentage < 60:
        severity = "HIGH"

    else:
        severity = "CRITICAL"

    # Final simulation result
    result = {
        "disaster_type": "FLOOD",
        "water_level": water_level,
        "severity": severity,

        "summary": {
            "total_population": total_population,
            "affected_population": affected_population,
            "affected_percentage": affected_percentage,
            "flooded_buildings": len(flooded_buildings),
            "blocked_roads": len(blocked_roads),
            "blocked_exits": len(blocked_exits)
        },

        "buildings": {
            "flooded": flooded_buildings,
            "safe": safe_buildings
        },

        "roads": {
            "blocked": blocked_roads,
            "open": open_roads
        },

        "exits": {
            "blocked": blocked_exits,
            "open": open_exits
        }
    }

    return result