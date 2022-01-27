# SteamMods
 Simple nodejs solution to dump Steam Workshop mod infos to tab delimited file. So you can sort and view the aggregate info more easily. Or import to a db if you like. 
 The actual Steam Web API portion is contained in a separated module to make it easier for reuse in other purposes. 

## Packages Used
- [bent](https://www.npmjs.com/package/bent) _(makes the web calls super easy)_
- fs / path _(native stuff)_

## Setup
- _You will need to have [NodeJS](https://nodejs.org/) installed of course!_
- Get a [Steam API Key](https://steamcommunity.com/dev/apikey)
- Put your API Key in the config (either in mod-dump.js or add a config.json)  
_example config.json_  
```JSON
{
    "api_key":"YOUR_API_KEY",
    "app_id":346110,
    "full_desc":false,
    "date_locale":"en-us",
    "use_utc_iso":false,
    "delimiter":"\t",
    "out_file_name":"steammods.tsv"
}
```  

_Only the 'api_key' must be set, the rest are defaults. Ark's appid is 346110._  

## Usage
Run 'mod-dump.js' and wait for it to finish.
```bat
K:\GitHub\SteamMods>node mod-dump.js
Getting Mods - Page[1] Received[0/0]
Getting Mods - Page[2] Received[100/11615]
Getting Mods - Page[3] Received[200/11615]
Getting Mods - Page[4] Received[300/11615]
...
...
...
Getting Mods - Page[115] Received[11400/11615]
Getting Mods - Page[116] Received[11500/11615]
Getting Mods - Page[117] Received[11600/11615]
Received [11615] Mod Infos from Steam.
Skipping Invalid Mod [{"result":9,"publishedfileid":"1254141687","language":0}]
Skipping Invalid Mod [{"result":9,"publishedfileid":"2147560794","language":0}]
Skipping Invalid Mod [{"result":9,"publishedfileid":"2250776941","language":0}]
Writing [11612] to file: K:\GitHub\SteamMods\steammods.tsv
```  

_There will usually be a few invalid mod results from Steam._  

The mod info will be output in tab separated format.  
You can edit the values in mod-dump.js to change columns, delimiter, etc. 
