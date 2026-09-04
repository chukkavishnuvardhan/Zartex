import json
from pathlib import Path
from app.models.flood_risk import FloodRiskRequest
import os
from dotenv import load_dotenv
from openai import OpenAI
from app.models.emergency import EmergencyRequest

from app.models.chat import ChatRequest
from fastapi import FastAPI, HTTPException
from app.models.help_request import HelpRequest, HelpRequestResponse

from app.engines.flood_engine import simulate_flood
from app.engines.risk_engine import calculate_all_risks
from app.engines.route_engine import (
    find_safest_route,
    calculate_all_routes
)
from app.engines.shelter_engine import allocate_people_to_shelters
from app.engines.rescue_engine import allocate_rescue_teams
from app.engines.whatif_engine import simulate_what_if
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()

FEATHERLESS_API_KEY = os.getenv("FEATHERLESS_API_KEY")

client = OpenAI(
    base_url="https://api.featherless.ai/v1",
    api_key=FEATHERLESS_API_KEY
)
app = FastAPI(
    title="DisasterConnect API",
    description="""
Community-first disaster assistance backend.

This API provides:

* AI-powered emergency guidance using Featherless AI
* Emergency SOS request management
* Flood risk analysis
* Emergency resources and shelters
* Disaster safety guidelines

Designed for integration with the DisasterConnect Android application.
""",
    version="1.0.0",
    openapi_tags=[
        {
            "name": "AI Assistant",
            "description": "AI-powered disaster guidance using Featherless AI."
        },
        {
            "name": "Emergency",
            "description": "Create and view emergency help requests."
        },
        {
            "name": "Flood Intelligence",
            "description": "Analyze flood risk and simulate flood impact."
        },
        {
            "name": "Resources",
            "description": "Access emergency shelters, hospitals, food and water resources."
        },
        {
            "name": "Safety",
            "description": "Disaster preparedness and emergency safety guidelines."
        }
    ]
)
app.add_middleware(
    CORSMiddleware,
  allow_origins=[
        "http://localhost:5174",
    "http://localhost:5173",
        "http://127.0.0.1:5174",
    "http://127.0.0.1:5173",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
help_requests = []
emergency_requests = []


@app.get("/")
def home():
    return {
        "message": "Welcome to DisasterConnect API",
        "status": "running"
    }


@app.get("/api/flood/simulate")
def flood_simulation(water_level: float = 4):
    return simulate_flood(water_level)


@app.get("/api/risk/assess")
def risk_assessment(water_level: float = 4):
    return calculate_all_risks(water_level)


@app.get("/api/routes/all")
def all_evacuation_routes(water_level: float = 4):
    return calculate_all_routes(water_level)


@app.get("/api/routes/find")
def evacuation_route(
    building_id: str,
    water_level: float = 4
):
    return find_safest_route(
        building_id,
        water_level
    )
@app.get("/api/shelters/allocate")
def shelter_allocation(water_level: float = 4):
    return allocate_people_to_shelters(water_level)

@app.get("/api/rescue/allocate")
def rescue_allocation(water_level: float = 4):
    return allocate_rescue_teams(water_level)

@app.get("/api/what-if/flood")
def what_if_flood(
    current_water_level: float = 4,
    simulated_water_level: float = 6
):
    return simulate_what_if(
        current_water_level,
        simulated_water_level
    )
@app.post("/api/help-requests")
def create_help_request(request: HelpRequest):
    new_request = {
        "id": len(help_requests) + 1,
        "name": request.name,
        "location": request.location,
        "emergencyType": request.emergencyType,
        "peopleCount": request.peopleCount,
        "description": request.description,
        "status": "pending"
    }

    help_requests.append(new_request)

    return new_request
@app.get("/api/help-requests")
def get_help_requests():
    return help_requests
@app.post("/api/ai/chat")
def disaster_ai_chat(request: ChatRequest):

    response = client.chat.completions.create(
        model="Qwen/Qwen2.5-7B-Instruct",
        messages=[
            {
                "role": "system",
                "content": """
You are DisasterConnect AI, an emergency disaster assistance assistant.

Your role is to provide clear, calm, practical disaster safety guidance.

Rules:
- Prioritize immediate safety.
- Keep responses concise and easy to understand.
- Do not create panic.
- Encourage contacting local emergency services for life-threatening situations.
- Give practical steps for floods, earthquakes, fires, and other disasters.
"""
            },
            {
                "role": "user",
                "content": request.message
            }
        ],
        temperature=0.3,
        max_tokens=300
    )

    return {
        "response": response.choices[0].message.content
    }
@app.post("/emergency")
def create_emergency(request: EmergencyRequest):

    emergency_data = {
        "id": len(emergency_requests) + 1,
        "name": request.name,
        "emergency_type": request.emergency_type,
        "priority": request.priority,
        "latitude": request.latitude,
        "longitude": request.longitude,
        "people_affected": request.people_affected,
        "description": request.description,
        "timestamp": request.timestamp.isoformat(),
        "status": "RECEIVED"
    }

    emergency_requests.append(emergency_data)

    return {
        "status": "success",
        "message": "Emergency request received",
        "priority": request.priority,
        "emergency_id": emergency_data["id"]
    }
@app.get("/emergency")
def get_emergencies():
    return {
        "total": len(emergency_requests),
        "emergencies": emergency_requests
    }
@app.post("/flood-risk")
def analyze_flood_risk(request: FloodRiskRequest):

    rainfall = request.rainfall
    water_level = request.water_level

    # Calculate risk score
    risk_score = min(
        100,
        int((rainfall / 200) * 40 + (water_level / 10) * 60)
    )

    # Determine risk level
    if risk_score >= 80:
        risk_level = "CRITICAL"
        recommendation = "Evacuate immediately if authorities advise. Move to higher ground and avoid flood water."

    elif risk_score >= 60:
        risk_level = "HIGH"
        recommendation = "Prepare for evacuation and move vulnerable people to safer locations."

    elif risk_score >= 30:
        risk_level = "MODERATE"
        recommendation = "Monitor conditions closely and prepare emergency supplies."

    else:
        risk_level = "LOW"
        recommendation = "Stay alert and monitor local weather and water conditions."

    return {
        "area": request.area,
        "rainfall": rainfall,
        "water_level": water_level,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "risk_explanation": f"The area has {rainfall} mm rainfall and a water level of {water_level} meters.",
        "recommended_action": recommendation,
        "emergency_precautions": [
            "Avoid walking or driving through flood water.",
            "Keep emergency contacts accessible.",
            "Move important documents and electronics to higher places.",
            "Follow official emergency instructions."
        ]
    }
@app.get("/resources")
def get_resources():

    file_path = Path("app/data/resources.json")

    with open(file_path, "r") as file:
        data = json.load(file)

    return data
@app.get("/safety-guidelines")
def get_safety_guidelines():

    file_path = Path("app/data/safety_guidelines.json")

    with open(file_path, "r") as file:
        data = json.load(file)

    return data
@app.post(
    "/ai-assistant",
    summary="Disaster AI Assistant",
    description="Send a disaster-related question and receive safety-focused guidance from DisasterConnect AI."
)
def ai_assistant(request: ChatRequest):

    try:
        response = client.chat.completions.create(
            model="Qwen/Qwen2.5-7B-Instruct",
            messages=[
                {
                    "role": "system",
                    "content": """
You are DisasterConnect AI, an emergency disaster assistance assistant.

Your primary purpose is to help people during disasters and emergencies.

Priority order:
1. Protect human life and immediate safety.
2. Give clear actions the user should take immediately.
3. Keep instructions short and easy to understand.
4. Avoid dangerous or risky advice.
5. Stay calm and do not create panic.

Response rules:
- Use numbered steps when giving instructions.
- Keep responses concise.
- Focus on practical actions.
- For life-threatening situations, advise contacting local emergency services.
- Never encourage users to enter dangerous areas.

You can provide guidance for:
- Floods
- Fires
- Earthquakes
- Cyclones
- Landslides
- Medical emergencies
- Emergency preparedness
- Evacuation

You are not a replacement for professional emergency responders.
"""
                },
                {
                    "role": "user",
                    "content": request.message
                }
            ],
            temperature=0.3,
            max_tokens=300
        )

        return {
            "status": "success",
            "response": response.choices[0].message.content
        }

    except Exception as e:

        print("AI Assistant Error:", str(e))

        raise HTTPException(
            status_code=503,
            detail="AI service is temporarily unavailable. Please try again."
        )