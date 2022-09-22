export namespace Fetch {
    export function Json(url: string) {
        return fetch(url).then(response => response.json());
    }
}