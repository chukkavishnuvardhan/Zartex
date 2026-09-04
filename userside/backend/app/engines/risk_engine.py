from app.engines.flood_engine import load_campus_data


def calculate_building_risk(building, water_level):
    """
    Calculate dynamic flood risk score for one building.
    Score range: 0 to 100.
    """

    score = 0

    elevation = building["elevation"]
    population = building["population"]

    # ------------------------------------------------
    # FACTOR 1: Flood danger (maximum 40 points)
    # ------------------------------------------------

    if water_level >= elevation:
        score += 40

    elif water_level >= elevation - 1:
        score += 30

    elif water_level >= elevation - 2:
        score += 20

    else:
        score += 5


    # ------------------------------------------------
    # FACTOR 2: Elevation vulnerability (max 25)
    # Lower elevation = higher risk
    # ------------------------------------------------

    if elevation <= 3:
        score += 25

    elif elevation <= 5:
        score += 18

    elif elevation <= 7:
        score += 10

    else:
        score += 5


    # ------------------------------------------------
    # FACTOR 3: Population vulnerability (max 20)
    # ------------------------------------------------

    if population >= 200:
        score += 20

    elif population >= 150:
        score += 15

    elif population >= 100:
        score += 10

    else:
        score += 5


    # ------------------------------------------------
    # FACTOR 4: Flood proximity (max 15)
    # ------------------------------------------------

    distance_from_water = elevation - water_level

    if distance_from_water <= 0:
        score += 15

    elif distance_from_water <= 1:
        score += 10

    elif distance_from_water <= 2:
        score += 5


    # Ensure score stays between 0 and 100
    score = min(score, 100)


    # Determine risk level

    if score >= 80:
        risk_level = "CRITICAL"

    elif score >= 60:
        risk_level = "HIGH"

    elif score >= 35:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"


    return {
        "id": building["id"],
        "name": building["name"],
        "population": population,
        "elevation": elevation,
        "risk_score": score,
        "risk_level": risk_level
    }


def calculate_all_risks(water_level: float):
    """
    Calculate risk for every building in the campus.
    """

    campus = load_campus_data()

    risks = []

    for building in campus["buildings"]:

        risk = calculate_building_risk(
            building,
            water_level
        )

        risks.append(risk)


    # Sort highest risk first

    risks.sort(
        key=lambda x: x["risk_score"],
        reverse=True
    )


    return {
        "disaster_type": "FLOOD",
        "water_level": water_level,
        "risk_assessment": risks
    }