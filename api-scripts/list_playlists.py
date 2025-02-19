#!/bin/python3

import argparse
from utils.helpers import *

parser = argparse.ArgumentParser(prog='List playlists',
                                 description='Lists the playlists owned by the current user')
parser.add_argument('-p', '--page', required=False, help='page index')
parser.add_argument('-s', '--page-size', required=False, help='page size')

args = parser.parse_args()

query_params = {}
if args.page:
    query_params['page'] = args.page

if args.page_size:
    query_params['size'] = args.page_size

print_request_result('get', "/api/playlists", params=query_params)
