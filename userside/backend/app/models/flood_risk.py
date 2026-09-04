from pydantic import BaseModel, Field


class FloodRiskRequest(BaseModel):
    rainfall: float = Field(..., ge=0)
    water_level: float = Field(..., ge=0)
    area: str = Field(..., min_length=1)