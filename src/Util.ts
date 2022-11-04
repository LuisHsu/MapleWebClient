import Setting from "./Setting";

export namespace Fetch {
    export function Json(url: string) {
        return fetch(url).then(response => response.json());
    }
}

export namespace LocaleString {

    let data:any = {};

    function get(domain: string){
        return (key: string) => {
            if(data[domain]){
                return Promise.resolve(data[domain][key])
            }else{
                return Fetch.Json(`${Setting.DataPath}String/${domain}.json`)
                    .then(json => {
                        data[domain] = json;
                        return data[domain][key];
                    });
            }
        }
    }

    export const Eqp = get("Eqp");
}