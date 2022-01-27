'use strict';

const fs = require('fs');
const path = require('path');

const SteamMods = require('./modules/steam-mods');
/*
const config = require('./config.json');
*/
const config = {
    api_key: 'YOUR_STEAM_API_KEY_HERE', // https://steamcommunity.com/dev/apikey 
    app_id: 346110, // Ark: Survival Evolved
    full_desc: false, // true will return 'file_description' instead of 'short_description' 
    use_utc_iso: false, // uses ISO date format instead
    date_locale:'en-us',
    delimiter:'\t', // tab delimited output
    out_file_name:'steammods.tsv',
    out_file_path:'' // will default to current dir
}

const steamMods = new SteamMods(config);

const dateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
};

// steam's field names => outfile column names
// in order shown 
// comment out lines to remove from output file
const columns = {
    publishedfileid:'ModID',
    title:'Name',
    time_created:'Created',
    time_updated:'Updated',
    creator:'CreatorSteamID',
    subscriptions:'Subs',
    lifetime_subscriptions:'SubsLifetime',
    favorited:'Favorited',
    lifetime_favorited:'FavoritedLifetime',
    views:'Views',
    //file_size:'Size',
    //tags:'Tags',
    //short_description:'ShortDesc',
    //file_description:'FullDesc',
    //num_comments_public:'NumComments',
}
const dateCols = ['time_created','time_updated'];

function formatSteamDate(steam_dt){
    try{
        if (config.use_utc_iso){
            return new Date(steam_dt*1000).toISOString();
        }
        else{
            return new Date(steam_dt*1000).toLocaleString(config.date_locale,dateOptions);
        }
    }
    catch(err){
        console.warn('Bad Date >>>',steam_dt,err);
        return steam_dt;
    }
}
/// to output tags as comma delimited list
function formatSteamTags(x){
    if (!x)
        return '';
    return  (x && Array.isArray(x) && x.map(x => x.tag || (x && JSON.stringify(x)) || '').toString()) || 
            (x && x.tag) || (typeof x==='string' && x) || 
            (x && !Array.isArray(x) && typeof x==='object' && JSON.stringify(x)) || x.tag || '';
}

steamMods.getSteamMods()
    .then(mods => {
        console.log(`Received [${mods.length}] Mod Infos from Steam.`);
        const colKeys = Object.keys(columns);
        const colVals = Object.values(columns);
        let content = colVals.join(config.delimiter);
        let lines = 0;
        for(const x of mods){
            if (!x.time_created || !x.time_updated || !x.publishedfileid){ // not a valid mod then
                console.log(`Skipping Invalid Mod [${JSON.stringify(x)}]`);
                continue;
            }
            var vals = [];
            for(const key of colKeys){
                var v = (typeof x[key]!=='undefined' && x[key]) || '';
                if (dateCols.includes(key))
                    v = formatSteamDate(v);
                else if (key=='tags')
                    v = formatSteamTags(v);
                vals.push(v);
            }
            content += `\n${vals.join(config.delimiter)}`;
            lines++;
        }
        var outfilepath = path.join(config.out_file_path || __dirname,config.out_file_name);
        console.log(`Writing [${lines}] to file: ${outfilepath}`);
        var outFile = fs.createWriteStream(outfilepath);
        outFile.write(content,(err) => {
            if (err)
                console.error(err);
            outFile.close();
        });
    })
    .catch(err => {
        console.error(err);
    });