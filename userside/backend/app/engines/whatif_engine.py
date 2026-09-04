from app.engines.flood_engine import simulate_flood
from app.engines.risk_engine import calculate_all_risks


def generate_recommendations(current, simulated):
    recommendations = []

    current_summary = current["summary"]
    simulated_summary = simulated["summary"]

    affected_difference = (
        simulated_summary["affected_population"]
        - current_summary["affected_population"]
    )

    blocked_roads_difference = (
        simulated_summary["blocked_roads"]
        - current_summary["blocked_roads"]
    )

    blocked_exits_difference = (
        simulated_summary["blocked_exits"]
        - current_summary["blocked_exits"]
    )

    if affected_difference > 0:
        recommendations.append(
            f"Evacuate {affected_difference} additional people."
        )

    if blocked_roads_difference > 0:
        recommendations.append(
            f"Prepare alternate routes for {blocked_roads_difference} newly blocked roads."
        )

    if blocked_exits_difference > 0:
        recommendations.append(
            f"Activate alternate evacuation exits because {blocked_exits_difference} additional exits are blocked."
        )

    simulated_risks = simulated["risk_assessment"]

    critical_zones = [
        zone["name"]
        for zone in simulated_risks
        if zone["risk_level"] == "CRITICAL"
    ]

    if critical_zones:
        recommendations.append(
            "Immediately deploy rescue teams to: "
            + ", ".join(critical_zones)
        )

    if not recommendations:
        recommendations.append(
            "Current evacuation strategy remains safe."
        )

    return recommendations


def simulate_what_if(current_water_level, simulated_water_level):

    current_flood = simulate_flood(current_water_level)

    simulated_flood = simulate_flood(simulated_water_level)

    current_risk = calculate_all_risks(current_water_level)

    simulated_risk = calculate_all_risks(simulated_water_level)

    current_state = {
        "water_level": current_water_level,
        "summary": current_flood["summary"],
        "risk_assessment": current_risk["risk_assessment"]
    }

    simulated_state = {
        "water_level": simulated_water_level,
        "summary": simulated_flood["summary"],
        "risk_assessment": simulated_risk["risk_assessment"]
    }

    recommendations = generate_recommendations(
        current_state,
        simulated_state
    )

    return {
        "disaster_type": "FLOOD",
        "simulation_type": "WHAT_IF",
        "scenario": {
            "question": (
                f"What if water rises from "
                f"{current_water_level}m to "
                f"{simulated_water_level}m?"
            )
        },
        "current_state": current_state,
        "simulated_state": simulated_state,
        "impact": {
            "additional_affected_people": (
                simulated_state["summary"]["affected_population"]
                - current_state["summary"]["affected_population"]
            ),
            "additional_blocked_roads": (
                simulated_state["summary"]["blocked_roads"]
                - current_state["summary"]["blocked_roads"]
            ),
            "additional_blocked_exits": (
                simulated_state["summary"]["blocked_exits"]
                - current_state["summary"]["blocked_exits"]
            )
        },
        "recommendations": recommendations
    }