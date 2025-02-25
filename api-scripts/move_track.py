#!/bin/python3

import argparse
from utils.helpers import *

parser = argparse.ArgumentParser(
    prog='Move track',
    description='Changes the track position inside the current playlist'
)

parser.add_argument('-pi', '--playlist-id', required=True, help='playlist id')
parser.add_argument('-ti', '--track-id', required=True, help='track id')
parser.add_argument('-idx', '--index', required=True, help='new index')

args = parser.parse_args()

request_body = {
    'id': args.track_id,
    'index': args.index
}

print_request_result('put', f'/api/playlists/{args.playlist_id}/tracks/order', json=request_body)
