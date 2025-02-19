#!/bin/python3

import argparse
from utils.helpers import *

parser = argparse.ArgumentParser(prog='Refresh access', description='Refreshes the access token')

args = parser.parse_args()

refresh_token = AuthenticationTokens.read().refresh
print_request_result('get', '/api/auth/refresh',
                     headers={ 'Cookie': f'refresh-token={refresh_token}'})
