#!/bin/python3

import argparse
from utils.helpers import *

parser = argparse.ArgumentParser(
    prog='List tracks',
    description='Lists the tracks contained in a playlist that is owned by the current user'
)

parser.add_argument('-i', '--playlist-id', required=True, help='playlist id')
parser.add_argument('-p', '--page', required=False, help='page index')
parser.add_argument('-s', '--page-size', required=False, help='page size')

args = parser.parse_args()

query_params = {
    'playlistId': args.playlist_id
}
if args.page:
    query_params['page'] = args.page

if args.page_size:
    query_params['size'] = args.page_size

print_request_result('get', "/api/playlists/tracks", params=query_params)
