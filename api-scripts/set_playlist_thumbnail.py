#!/bin/python3

import argparse
from utils.helpers import *

parser = argparse.ArgumentParser(prog='Set playlist thumbnail',
                                 description='Sets the thumbnail for specified playlist')
parser.add_argument('-i', '--playlist-id', required=True,
                    help='id of the playlist for which the thumbnail will be changed')
parser.add_argument('-p', '--path', required=True, help='thumbnail path')

args = parser.parse_args()

with open(args.path, 'rb') as file:
    print_request_result('put', '/api/playlists/thumbnails',
                         params={"id": args.playlist_id}, data=file)
