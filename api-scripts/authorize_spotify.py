#!/bin/python3

import argparse
import webbrowser
from utils.helpers import *

parser = argparse.ArgumentParser(
    prog='Authorize Spotify',
    description='Gives Spotify authorization for the current account'
)

args = parser.parse_args()

response = print_request_result('get', f'/api/auth/spotify', allow_redirects=False)
if response.is_redirect:
    redirection_url = response.headers['Location']
    print(f'Open in browser: {redirection_url}')
    webbrowser.open(redirection_url)