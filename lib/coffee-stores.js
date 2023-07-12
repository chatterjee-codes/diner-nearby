import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
});

const getUrlForCoffeeStores = (latLong, query, limit, radius) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}&radius=${radius}`;
};

const getListOfCoffeeStoresPhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'restaurant',
        page: 1,
        perPage: 30
    });
    const unsplashResults = photos.response.results;
    return unsplashResults.map((result) => result.urls['small']);
};

export const fetchCoffeeStores = async (
    latLong = '26.172131156450246,91.76059294912854',
    limit = 15,
    radius = 100000
) => {
    const photos = await getListOfCoffeeStoresPhotos();
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
        }
    };

    const response = await fetch(
        getUrlForCoffeeStores(latLong, 'restaurant', limit, radius),
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
