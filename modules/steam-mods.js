'use strict';

// makes errors able to be sent to JSON.stringify, in case you want that.. I ended up not using it
//require('./error-stringify');

const bent = require('bent');       // makes the http super easy

class SteamMods{
    constructor(options){
        this.steam_api = (options && options.steam_api) || 'https://api.steampowered.com';
        this.steam_svc_path = (options && options.steam_svc_path) || '/IPublishedFileService/QueryFiles/v1/';

        this.api_key = options && options.api_key; // definitely needed! go get your own! its free... https://steamcommunity.com/dev/apikey 
        this.app_id = (options && options.app_id) || 346110; // defaults to Ark: Survival Evolved
        this.num_per_page = (options && options.num_per_page) || 100; // steam doesn't allow more than 100 anyway
        this.full_desc = (options && options.full_desc) || false; // short desc is basically just truncated to reduce response body length (cannot omit fields lol..)

    }

    async getSteamMods(){
        const me = this;
        let cont=true;
        let expected = 0;
        let got = [];
        let page = 1;
        let urlParms = new URLSearchParams({
            key:me.api_key,
            appid:me.app_id,
            numperpage:me.num_per_page,
            page:page,
            return_tags:true,
            return_short_description:!me.full_desc,
            filetype:0 // mods.  https://partner.steamgames.com/doc/api/ISteamRemoteStorage#EWorkshopFileType
        });
        const getreq = bent(me.steam_api,'GET','json',200);
        while(cont){
            console.log(`Getting Mods - Page[${page}] Received[${got.length}/${expected}]`);
            urlParms.set('page',page);
            await getreq(`${me.steam_svc_path}?${urlParms.toString()}`)
                .then(t => {
                    if (t && 
                        t.response && 
                        t.response.total){
                            if (t.response.publishedfiledetails){
                                expected = expected || t.response.total;
                                page++;
                                for(const x of t.response.publishedfiledetails){
                                    got.push(x);
                                }
                                if (got.length>=expected)
                                    cont = false;
                            }
                            else{
                                console.warn('Unexpected end of mod pages >>>',t);
                                cont = false;
                            }
                        }
                        else{
                            console.error('Unexpected Response >>>',t);
                            cont = false;
                        }
                })
                .catch(err => {
                    console.error(err);
                    cont = false;
                });
        }
        return new Promise(resolve => resolve(got));
    }
}

module.exports = SteamMods;