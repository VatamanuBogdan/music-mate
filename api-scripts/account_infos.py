#!/bin/python3

import argparse
from utils.helpers import *

parser = argparse.ArgumentParser(prog='Account Infos',
                                 description='Shows information about current user')

parser.parse_args()

print_request_result('get', "/api/auth/account")
