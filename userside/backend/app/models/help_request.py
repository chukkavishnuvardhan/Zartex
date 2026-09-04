from pydantic import BaseModel
from typing import Optional


class HelpRequest(BaseModel):
    name: str
    location: str
    emergencyType: str
    peopleCount: int
    description: str


class HelpRequestResponse(HelpRequest):
    id: int
    status: str