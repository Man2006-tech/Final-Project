$baseUrl = "http://localhost:8081/api/auth"
$email = "testuser@example.com"
$password = "password123"

# Register
$registerBody = @{
    name     = "Test User"
    email    = $email
    password = $password
    role     = "STUDENT"
} | ConvertTo-Json

Write-Host "Registering user..."
try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "Registration successful:"
    $registerResponse | ConvertTo-Json -Depth 5
}
catch {
    Write-Host "Registration failed (user might already exist):"
    $_.Exception.Message
}

# Login
$loginBody = @{
    email    = $email
    password = $password
} | ConvertTo-Json

Write-Host "`nLogging in..."
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Login successful. Response:"
    $loginResponse | ConvertTo-Json -Depth 5
}
catch {
    Write-Host "Login failed:"
    $_.Exception.Message
}
