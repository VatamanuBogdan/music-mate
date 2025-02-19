from typing import Optional

from requests import Response
from .constants import *

import json
import requests


def perform_request(method: str, endpoint: str, auth: bool = True, **kwargs) -> Response:
    if auth:
        auth_headers = AuthenticationTokens.read().auth_headers()
        if 'headers' in kwargs:
            kwargs['headers'].update(auth_headers)
        else:
            kwargs['headers'] = auth_headers

    return requests.request(method, f'{SERVICE_URL}/{endpoint}', **kwargs)


def print_request_result(method: str, endpoint: str, auth: bool = True, **kwargs) -> Optional[Response]:
    try:
        response = perform_request(method, endpoint, auth, **kwargs)
        if response.ok:
            print_json_body(response)
            return response
        else:
            body = response.text
            if body is not None and body != '':
                print(f'Request failed with status {response.status_code} and body {body}')
            else:
                print(f'Request failed with status {response.status_code}')
    except Exception as e:
        print(f'Error occurred on request {e}')
    return None


def print_json_body(response: Response):
    print(json.dumps(response.json(), indent=2))


class AuthenticationTokens:
    def __init__(self, access: Optional[str], refresh: Optional[str]):
        self.access = access
        self.refresh = refresh

    def auth_headers(self) -> dict[str, str]:
        return {"Authorization": f'Bearer {self.access}'}

    @staticmethod
    def read() -> 'AuthenticationTokens':
        try:
            with open(AUTH_TOKENS_FILENAME, 'r') as file:
                tokens = json.load(file)
                return AuthenticationTokens(tokens['access'], tokens['refresh'])
        except FileNotFoundError:
            pass
        except Exception:
            print(f'Warning: {AUTH_TOKENS_FILENAME} is corrupted')
        return AuthenticationTokens(None, None)


    @staticmethod
    def update(tokens: 'AuthenticationTokens') -> bool:
        old_tokens = None
        try:
            with open(AUTH_TOKENS_FILENAME, 'r') as file:
                old_tokens = json.load(file)
        except Exception:
            pass

        new_tokens = {
            'access': tokens.access or old_tokens['access'],
            'refresh': tokens.refresh or old_tokens['refresh']
        }

        try:
            with open(AUTH_TOKENS_FILENAME, 'w') as file:
                file.write(json.dumps(new_tokens, indent=2))
            return True
        except Exception:
            return False

    @staticmethod
    def from_response(response: Response) -> 'AuthenticationTokens':
        return AuthenticationTokens(access=response.json()['data']['token']['value'],
                                    refresh=response.cookies['refresh-token'])
