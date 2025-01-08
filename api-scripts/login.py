#!/bin/python3

from utils.helpers import *
from getpass import getpass

email = input("Email: ")
password = getpass("Password: ")

login_data = {
    "email": email,
    "password": password
}

print_request_result("post",
                     "/api/auth/login",
                     False,
                     json = login_data)
