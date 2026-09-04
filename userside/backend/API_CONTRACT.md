# ResQTwin API Contract

## Base URL

http://127.0.0.1:8000

---

# 1. Flood Simulation

GET

/api/flood/simulate

Parameters:

water_level

Example:

http://127.0.0.1:8000/api/flood/simulate?water_level=4

Purpose:

Simulates flood conditions across the campus.

---

# 2. Risk Assessment

GET

/api/risk/assess

Parameters:

water_level

Example:

http://127.0.0.1:8000/api/risk/assess?water_level=4

Purpose:

Calculates risk scores for campus buildings.

---

# 3. Evacuation Routes

GET

/api/routes/all

Parameters:

water_level

Example:

http://127.0.0.1:8000/api/routes/all?water_level=4

Purpose:

Finds safe evacuation routes for all buildings.

---

# 4. Single Building Route

GET

/api/routes/find

Parameters:

building_id
water_level

Example:

http://127.0.0.1:8000/api/routes/find?building_id=B3&water_level=4

Purpose:

Finds the safest evacuation route for one building.

---

# 5. Shelter Allocation

GET

/api/shelters/allocate

Parameters:

water_level

Example:

http://127.0.0.1:8000/api/shelters/allocate?water_level=4

Purpose:

Allocates affected people to available shelters.

---

# 6. Rescue Team Allocation

GET

/api/rescue/allocate

Parameters:

water_level

Example:

http://127.0.0.1:8000/api/rescue/allocate?water_level=4

Purpose:

Assigns available rescue teams to high-risk buildings.

---

# 7. What-If Simulation

GET

/api/what-if/flood

Parameters:

current_water_level
simulated_water_level

Example:

http://127.0.0.1:8000/api/what-if/flood?current_water_level=4&simulated_water_level=6

Purpose:

Compares the current flood situation against a simulated future water level.

---