from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime


class EmergencyRequest(BaseModel):
    name: str = Field(..., min_length=1)

    emergency_type: Literal[
        "TRAPPED_IN_FLOOD",
        "MEDICAL_EMERGENCY",
        "NEED_FOOD",
        "NEED_DRINKING_WATER",
        "NEED_SHELTER",
        "MISSING_PERSON",
        "FIRE_EMERGENCY",
        "GENERAL_SOS"
    ]

    priority: Literal[
        "CRITICAL",
        "HIGH",
        "MEDIUM",
        "LOW"
    ]

    latitude: float
    longitude: float

    people_affected: int = Field(..., ge=1)

    description: str = Field(..., min_length=1)

    timestamp: datetime