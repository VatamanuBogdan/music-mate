#!/bin/python3

import argparse
from utils.helpers import *

parser = argparse.ArgumentParser(prog='Create playlist',
                                 description='Creates a new playlist for current user')
parser.add_argument('-t', '--title', required=True, help='playlist title')
parser.add_argument('-d', '--description', required=True, help='playlist description')

args = parser.parse_args()

request_body = {
    "name": args.title,
    "description": args.description
}

print_request_result('post', f'/api/playlists', json=request_body)
