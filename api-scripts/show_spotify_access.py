#!/bin/python3

import argparse
from utils.helpers import *

parser = argparse.ArgumentParser(prog='Show Spotify access', description='Fetches Spotify Access Token')

args = parser.parse_args()

refresh_token = AuthenticationTokens.read().refresh
response = print_request_result('get', '/api/auth/spotify/access')
