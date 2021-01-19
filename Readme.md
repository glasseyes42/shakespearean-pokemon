# shakespearean-pokemon
---

A simple API presenting one endpoint which will give back the description of a named pokemon but written in the style of shakespeare.

### Requirements
#### Development
* NodeJS (14)
#### Optional
* Docker

### Setup/running/testing
Having cloned the repo, from the root of the project:
* install the dependencies: `npm ci`
* tests can be started via `npm test`
* the server can be started with `node index.js`

The server listens by default on port `4567`

A dockerfile is also included, once built the image is configured to expose the default application port of `4567`.
* Convenience scripts provided: `npm run docker:build` & `npm run docker:run`.

### Notes
* Testing is making use of mocked api's.
* Whilst the pokeapi does not seem to have any limitations, the translation API has strict usage limitations.
  * Optional api key for translation api can be provided in the config by setting the `translateToken` property.
* Upstream API's
  * https://pokeapi.co/
  * https://api.funtranslations.com/translate/ (specifically the shakespeare endpoint).
* When fetching the original description for a pokemon, this service makes use of the latest/last entry from a variety of descriptions from various versions
  * Pick others?
  * Option to specify game version?
* Given API limitations for translation, likely best to cache these results for future use.

## API
#### GET /pokemon/:name
* Expects valid pokemon name as parameter, will return `404` if not.
* Returns server error if upstream API reports an issue.
* Returns `429 Too many requests` if upstream API (particularly translation api) returns as such.

Successful response: `200`
```json
{
  "name": "<pokemon name>",
  "description": "<translated description of pokemon>"
}
```
