from requests import Response
from .values import *

import json
import requests

def print_json_body(response: Response):
    print(json.dumps(response.json(), indent=2))


def perform_request(method: str, endpoint: str, auth: bool = True, **kwargs) -> Response:
    if auth:
        if 'headers' in kwargs:
            kwargs['headers'].update(AUTHENTICATION_HEADERS)
        else:
            kwargs['headers'] = AUTHENTICATION_HEADERS

    return requests.request(method, f'{SERVICE_HOST}/{endpoint}', **kwargs)


def print_request_result(method: str, endpoint: str, auth: bool = True, **kwargs):
    response = perform_request(method, endpoint, auth, **kwargs)

    if response.ok:
        print_json_body(response)
    else:
        body = response.text
        if body is not None and body != '':
            print(f'Request failed with status {response.status_code} and body {body}')
        else:
            print(f'Request failed with status {response.status_code}')
