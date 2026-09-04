from engines.flood_engine import simulate_flood
import json


result = simulate_flood(4)

print(json.dumps(result, indent=4))
