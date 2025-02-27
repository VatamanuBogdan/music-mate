#!/bin/python3

import argparse
from utils.helpers import *

parser = argparse.ArgumentParser(prog='Refresh access', description='Refreshes the access token')

args = parser.parse_args()

refresh_token = AuthenticationTokens.read().refresh
response = print_request_result('get', '/api/auth/refresh',
                                headers={ 'Cookie': f'refresh-token={refresh_token}'})
new_access_token = AuthenticationTokens.extract_access_token(response)

old_tokens = AuthenticationTokens.read()
new_tokens = AuthenticationTokens(new_access_token, old_tokens.refresh)
AuthenticationTokens.update(new_tokens)
