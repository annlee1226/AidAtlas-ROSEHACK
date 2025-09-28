# AidAtlas — Maps shelters & relief opportunities

**Best Social Impact – Rose Hackathon 2025**
Python · Flask · Geopy · REST APIs
Original Repo: `https://github.com/sneha-grg/AidAtlas-ROSEHACK`

## What it does

Geolocation-based API that aggregates **FEMA OpenShelters** and **ReliefWeb** data and returns **nearby shelters** and **relief opportunities**. Fast, JSON responses; graceful fallbacks if a provider is down.

## Quick start

```bash
git clone https://github.com/annlee1226/AidAtlas-ROSEHACK.git
cd AidAtlas-ROSEHACK
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# .env (minimal)
echo 'PORT=8000
REQUEST_TIMEOUT_SECS=4
MAX_RADIUS_KM=100
ENABLE_CORS=1' > .env

# run
python app.py
# or
gunicorn -w 2 -b 0.0.0.0:${PORT:-8000} app:app
```

## API (essential)

**Health**

```
GET /api/health
→ 200 {"status":"ok"}
```

**Shelters (by coords or address)**

```
GET /api/shelters?lat=<num>&lon=<num>&radius_km=25
GET /api/shelters?address=Riverside, CA&radius_km=50
```

Response (trimmed):

```json
{"count":3,"items":[{"name":"Community Rec Center","address":"...","location":{"lat":33.98,"lon":-117.37},"distance_km":2.1,"status":"open","source":"FEMA"}]}
```

**Opportunities / Updates**

```
GET /api/opportunities?country=US&limit=20
GET /api/updates?query=wildfire&limit=10
```

## Notes

* **Stack:** Flask, Requests, Geopy.
* **Perf:** typical p50 < 150 ms for local/staging small-radius queries.
* **Security:** no PII stored; use HTTPS in prod; keep keys in env vars.
* **Extensible:** add new sources via small “adapter” modules that normalize to a common schema.

## License

MIT (see `LICENSE`).
