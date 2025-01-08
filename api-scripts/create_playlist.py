#!/bin/python3

from utils.helpers import *

playlist_name = input("Playlist name: ")

print_request_result('post', f'/api/playlists/{playlist_name}')
