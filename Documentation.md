kill port after Webstorm crashes: npx kill-port 5173

API request bodies:
Login:
Path:
```json
{
  "email": "string",
  "password": "string"
}
```

POST Register:
Path:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "biography": "string"
}
```

POST Projects:
Path:
```json
{
  "project_name": "string",
  "category": "string",
  "genre": "string",
  "description": "string",
  "visibility": "public/private"
}
```

POST Characters:
Path:
```json
{
  "name": "string",
  "role": "string",
  "personality": "string",
  "biography": "string",
  "description": "string"
}
```