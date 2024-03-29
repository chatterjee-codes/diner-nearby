import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

import Banner from '../components/banner';
import Card from '../components/card';
import { fetchCoffeeStores } from '../lib/coffee-stores';

import useTrackLocation from '../hooks/use-track-location';

import { ACTION_TYPES, StoreContext } from '../store/store-context';

export async function getStaticProps(context) {
    const coffeeStores = await fetchCoffeeStores();

    return {
        props: {
            coffeeStores
        } // will be passed to the page component as props
    };
}

export default function Home(props) {
    // console.log('props', props);

    const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();

    // const [coffeeStores, setCoffeeStores] = useState('');
    const [coffeeStoresError, setCoffeeStoresError] = useState(null);

    const { dispatch, state } = useContext(StoreContext);

    const { coffeeStores, latLong } = state;

    // console.log({ latLong, locationErrorMsg });

    useEffect(() => {
        const fetchData = async () => {
            if (latLong) {
                try {
                    const fetchedCoffeeStores = await fetch(
                        `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30&radius=10000`
                    );
                    const coffeeStores = await fetchedCoffeeStores.json();
                    // console.log({ fetchedCoffeeStores });
                    // set coffee store
                    // setCoffeeStores(fetchedCoffeeStores);
                    dispatch({
                        type: ACTION_TYPES.SET_COFFEE_STORES,
                        payload: { coffeeStores }
                    });
                    setCoffeeStoresError('');
                } catch (error) {
                    // set error
                    setCoffeeStoresError(error.message);
                }
            }
        };

        fetchData();
    }, [latLong]);

    const handleOnBannerBtnClick = () => {
        handleTrackLocation();
    };
    return (
        <div className={styles.container}>
            <Head>
                <title>Diner Connoiseur</title>
                <link rel='icon' href='/favicon.ico' />
                <meta name='description' content='allows you to discover diners nearby'></meta>
            </Head>

            <main className={styles.main}>
                <Banner
                    buttonText={isFindingLocation ? 'Locating...' : 'View diners nearby'}
                    handleOnClick={handleOnBannerBtnClick}
                />
                {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
                {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
                {/* <div className={styles.heroImage}>
                    <Image
                        src='/static/hero-image.png'
                        alt='hero-banner'
                        width={700}
                        height={400}
                    />
                </div> */}

                {coffeeStores.length > 0 && (
                    <div className={styles.sectionWrapper}>
                        <h2 className={styles.heading2}>Near me</h2>
                        <div className={styles.cardLayout}>
                            {coffeeStores.map((coffeeStore) => {
                                return (
                                    <Card
                                        key={coffeeStore.id}
                                        name={coffeeStore.name}
                                        imgUrl={
                                            coffeeStore.imgUrl ||
                                            'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                                        }
                                        href={`/coffee-store/${coffeeStore.id}`}
                                        className={styles.card}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
                {props.coffeeStores.length > 0 && (
                    <div className={styles.sectionWrapper}>
                        <h2 className={styles.heading2}>Guwahati Diners</h2>
                        <div className={styles.cardLayout}>
                            {props.coffeeStores.map((coffeeStore) => {
                                return (
                                    <Card
                                        key={coffeeStore.id}
                                        name={coffeeStore.name}
                                        imgUrl={
                                            coffeeStore.imgUrl ||
                                            'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                                        }
                                        href={`/coffee-store/${coffeeStore.id}`}
                                        className={styles.card}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
