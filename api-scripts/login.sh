#!/bin/sh

read -p "Email: " email
read -p "Password: " -s password

curl_output=$(
    curl ${MUSIMATE_SERVICE_URL}/api/auth/login \
          -H 'Content-Type: application/json' \
          -d "{ \"email\": \"${email}\", 
                \"password\": \"${password}\"  
              }"
)

auth_token=$(echo ${curl_output} | jq '.authToken.value')
echo "Authentification token: ${auth_token}"