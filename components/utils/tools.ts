export function generatedURL(baseUrl: string, filters: any = {}) {
    const url = new URL(baseUrl);
    Object.keys(filters).forEach((key) => url.searchParams.append(key, filters[key]));
    return url;
}
