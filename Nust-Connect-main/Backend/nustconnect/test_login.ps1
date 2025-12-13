$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    email    = "student@nust.edu.pk"
    password = "password"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "Login Successful!"
    Write-Host "Token: $($response.token)"
}
catch {
    Write-Host "Login Failed!"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}
