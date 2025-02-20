#!/bin/python3

import argparse
from utils.helpers import *

parser = argparse.ArgumentParser(
    prog='Remove track',
    description='Removes the track contained in a playlist that is owned by the current user'
)

parser.add_argument('-pi', '--playlist-id', required=True, help='playlist id')
parser.add_argument('-ti', '--track-id', required=True, help='track id')

args = parser.parse_args()

print_request_result('delete', f'/api/playlists/{args.playlist_id}/tracks/{args.track_id}')
