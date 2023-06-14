import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStoresPhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'coffee shop',
        page: 1,
        perPage: 30
    });
    const unsplashResults = photos.response.results;
    return unsplashResults.map((result) => result.urls['small']);
};

export const fetchCoffeeStores = async () => {
    const photos = await getListOfCoffeeStoresPhotos();
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.FOURSQUARE_API_KEY
        }
    };

    const response = await fetch(
        getUrlForCoffeeStores('28.60092681316636%2C77.2271165236623', 'coffee', 6),
        options
    );
    const data = await response.json();
    return data.results.map((result, index) => {
        const neighborhood = result.location.neighborhood;
        const address = result.location.address;
        // console.log(result);
        return {
            id: result.fsq_id,
            name: result.name,
            address: address ? address : '',
            neighborhood: neighborhood && neighborhood.length > 0 ? neighborhood[0] : '',
            imgUrl: photos.length > 0 ? photos[index] : null
        };
    });
};
