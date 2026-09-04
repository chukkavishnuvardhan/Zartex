\# DisasterConnect API Documentation



\## Project Overview



DisasterConnect is a community-focused disaster management application.



This backend provides online intelligence services that can be integrated with the DisasterConnect Android application.



Main features:



\- AI-powered disaster assistance

\- Emergency help requests

\- Flood risk analysis

\- Disaster resources and shelters

\- Safety guidelines



\---



\# Base URL



When running locally:



http://127.0.0.1:8000



Swagger API Documentation:



http://127.0.0.1:8000/docs



For Android Emulator, use:



http://10.0.2.2:8000



\---



\# Core APIs



The Android application should use the following APIs.



| Method | Endpoint | Purpose |

|---|---|---|

| POST | /ai-assistant | AI disaster assistance |

| POST | /emergency | Send emergency request |

| GET | /emergency | Get emergency requests |

| POST | /flood-risk | Analyze flood risk |

| GET | /resources | Get nearby disaster resources |

| GET | /safety-guidelines | Get disaster safety guidelines |



\---



\# 1. AI Disaster Assistant



\## Endpoint



POST /ai-assistant



\## Purpose



Send a disaster-related question to the DisasterConnect AI assistant.



The backend communicates with Featherless AI and the Qwen model.



The API key is securely stored in the backend and is never exposed to the Android application.



\## Request



```json

{

&#x20; "message": "Flood water is entering my house. What should I do?"

}

