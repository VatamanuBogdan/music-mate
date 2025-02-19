#!/bin/python3

import argparse

from utils.helpers import *

parser = argparse.ArgumentParser(prog='Sign In')
parser.add_argument('-e', '--email', required=True, help='user email')
parser.add_argument('-p', '--password', required=True, help='user password')

args = parser.parse_args()

request_body = {
    "email": args.email,
    "password": args.password
}

response = print_request_result("post","/api/auth/signin", False, json = request_body)
new_auth_tokens = AuthenticationTokens.from_response(response)
AuthenticationTokens.update(new_auth_tokens)
