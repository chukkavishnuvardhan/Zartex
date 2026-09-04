from app.engines.flood_engine import load_campus_data


def get_safe_shelters(water_level):
    """
    Return shelters that are above the current flood level.
    """

    campus = load_campus_data()

    safe_shelters = []

    for shelter in campus["shelters"]:

        if shelter["elevation"] > water_level:

            available_capacity = (
                shelter["capacity"] -
                shelter["occupied"]
            )

            safe_shelters.append({
                "id": shelter["id"],
                "name": shelter["name"],
                "capacity": shelter["capacity"],
                "occupied": shelter["occupied"],
                "available_capacity": available_capacity,
                "elevation": shelter["elevation"]
            })

    return safe_shelters


def allocate_people_to_shelters(water_level):
    """
    Allocate affected people to available safe shelters.
    """

    campus = load_campus_data()

    safe_shelters = get_safe_shelters(water_level)

    # Get affected buildings
    affected_buildings = []

    for building in campus["buildings"]:

        if building["elevation"] <= water_level:

            affected_buildings.append(building)

    # Sort buildings by lowest elevation first
    affected_buildings.sort(
        key=lambda building: building["elevation"]
    )

    allocations = []

    total_people_to_allocate = sum(
        building["population"]
        for building in affected_buildings
    )

    remaining_people = total_people_to_allocate

    # Allocate people to shelters
    for shelter in safe_shelters:

        if remaining_people <= 0:
            break

        allocated_people = min(
            shelter["available_capacity"],
            remaining_people
        )

        allocations.append({
            "shelter_id": shelter["id"],
            "shelter_name": shelter["name"],
            "allocated_people": allocated_people,
            "available_capacity": shelter["available_capacity"],
            "remaining_capacity": (
                shelter["available_capacity"] -
                allocated_people
            )
        })

        remaining_people -= allocated_people


    return {
        "disaster_type": "FLOOD",
        "water_level": water_level,
        "total_people_to_allocate": total_people_to_allocate,
        "total_allocated": (
            total_people_to_allocate -
            remaining_people
        ),
        "unallocated_people": remaining_people,
        "safe_shelters": safe_shelters,
        "allocations": allocations
    }
