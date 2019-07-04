# atlas-auth

This should expose some auth controllers and express routes to handle user authentication flow.

This package is intended to be used in an express application, to just import the routes and attach them to the router.

## Public API

| Exported Variable | Description |
|-|-|
| authRouter | Express router with routes configured, just to be imported and used as Express router. |

## Create Keys

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 10000 -nodes
```
