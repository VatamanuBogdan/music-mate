#!/bin/python3

import argparse
from utils.helpers import *

parser = argparse.ArgumentParser(prog='Sign Up')
parser.add_argument('-f', '--first-name', required=True, help='user first name')
parser.add_argument('-l', '--last-name', required=True, help='user last name')
parser.add_argument('-e', '--email', required=True, help='user email')
parser.add_argument('-p', '--password', required=True, help='user password')
parser.add_argument('-b', '--birthday', required=True, help='user birthday (yyyy-MM-dd)')

args = parser.parse_args()

request_body = {
    "firstName": args.first_name,
    "secondName": args.last_name,
    "email": args.email,
    "password": args.password,
    "birthDate": args.birthday
}

print_request_result("post","/api/auth/signup",False, json = request_body)
