#!/bin/python3

from utils.helpers import *

first_name = input("First name: ")
second_name = input("Second name: ")
password = input("Password: ")
email = input("Email: ")
birth_date = input("Birthdate (yyyy-MM-dd): ")

register_data = {
    "firstName": first_name,
    "secondName": second_name,
    "password": password,
    "email": email,
    "birthDate": birth_date
}

print_request_result("post",
                     "/api/auth/register",
                     False,
                     json = register_data)