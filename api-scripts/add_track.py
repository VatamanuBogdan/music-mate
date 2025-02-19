#!/bin/python3

import argparse
from enum import Enum
from urllib.parse import urlparse, parse_qs
from utils.helpers import *

class Platform(Enum):
    YOUTUBE = 'YOUTUBE'
    SPOTIFY = 'SPOTIFY'

platform_hosts = {
    'www.youtube.com': Platform.YOUTUBE,
    'youtube.com': Platform.YOUTUBE,
    'www.spotify.com': Platform.SPOTIFY,
    'spotify.com': Platform.SPOTIFY
}

parser = argparse.ArgumentParser(prog='Add track',
                                 description='Add a tracks to a specified playlist')
parser.add_argument('-i', '--playlist-id', required=True,
                    help='id of the playlist in which the track will be added')
parser.add_argument('-u', '--url', required=True, help='track URL')

args = parser.parse_args()

parsed_url = urlparse(args.url)

hostname = parsed_url.hostname
try:
    platform = platform_hosts[hostname]
except Exception:
    print(f'Error: Unknown platform hostname {hostname}')
    exit(-1)

value = None
if platform == Platform.YOUTUBE:
    try:
        parsed_query = parse_qs(parsed_url.query)
        value = parsed_query['v'][0]
    except Exception:
        print('Error: Invalid url, the youtube video id could not be found')
        exit(-1)
else:
    value = args.url

request_body = {
    'platform': platform.value,
    'value': value
}

print_request_result('post', f'/api/playlists/tracks/{args.playlist_id}',
                     json=request_body)
