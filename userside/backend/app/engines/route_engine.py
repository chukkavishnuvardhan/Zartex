import networkx as nx

from app.engines.flood_engine import load_campus_data


def build_safe_graph(water_level):
    """
    Build a graph containing only safe roads.
    Flooded roads are excluded.
    """

    campus = load_campus_data()

    graph = nx.Graph()

    for road in campus["roads"]:

        # Block roads affected by flood water
        if water_level >= road["elevation"]:
            continue

        graph.add_edge(
            road["from"],
            road["to"],
            weight=road["distance"],
            road_id=road["id"]
        )

    return graph


def get_open_exits(water_level):
    """
    Get exits that are above the flood water level.
    """

    campus = load_campus_data()

    open_exits = []

    for exit_point in campus["exits"]:

        if water_level < exit_point["elevation"]:
            open_exits.append(exit_point["id"])

    return open_exits


def find_safest_route(start_building, water_level):
    """
    Find the shortest route among all safe available routes.
    """

    graph = build_safe_graph(water_level)

    open_exits = get_open_exits(water_level)

    possible_routes = []

    for exit_id in open_exits:

        try:
            path = nx.shortest_path(
                graph,
                source=start_building,
                target=exit_id,
                weight="weight"
            )

            distance = nx.shortest_path_length(
                graph,
                source=start_building,
                target=exit_id,
                weight="weight"
            )

            possible_routes.append({
                "exit": exit_id,
                "path": path,
                "distance": distance
            })

        except (nx.NetworkXNoPath, nx.NodeNotFound):
            continue

    if not possible_routes:

        return {
            "status": "NO_SAFE_ROUTE",
            "message": "No safe evacuation route is currently available.",
            "start": start_building
        }

    best_route = min(
        possible_routes,
        key=lambda route: route["distance"]
    )

    return {
        "status": "SAFE_ROUTE_FOUND",
        "start": start_building,
        "recommended_exit": best_route["exit"],
        "route": best_route["path"],
        "total_distance": best_route["distance"],
        "water_level": water_level
    }


def calculate_all_routes(water_level):
    """
    Calculate evacuation routes for all campus buildings.
    """

    campus = load_campus_data()

    routes = []

    for building in campus["buildings"]:

        route = find_safest_route(
            building["id"],
            water_level
        )

        routes.append(route)

    return {
        "disaster_type": "FLOOD",
        "water_level": water_level,
        "evacuation_routes": routes
    }