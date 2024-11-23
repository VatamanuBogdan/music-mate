#!/bin/sh

read -p "First name: " first_name
read -p "Second name: " second_name
read -p "Password: " password
read -p "Email: " email
read -p "Birthdate (yyyy-MM-dd): " birth_date

curl ${MUSIMATE_SERVICE_URL}/api/auth/register \
    -H 'Content-Type: application/json' \
    -d \
    "{ 
        \"firstName\": \"${first_name}\",
        \"secondName\": \"${second_name}\",
        \"password\": \"${password}\",
        \"email\": \"${email}\",
        \"birthDate\": \"${birth_date}\"
    }" | jq .