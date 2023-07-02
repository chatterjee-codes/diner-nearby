/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

import cls from 'classnames';

import { fetchCoffeeStores } from '../../lib/coffee-stores';

import { StoreContext } from '../../store/store-context';

import { isEmpty } from '../../utils/isEmpty.util';

import styles from '../../styles/coffee-store.module.css';

export async function getStaticProps(staticProps) {
    const params = staticProps.params;
    const coffeeStores = await fetchCoffeeStores();
    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id;
    });
    // console.log('params', params);
    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}
        }
    };
}

export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores();
    const paths = coffeeStores.map((coffeeStore) => {
        return {
            params: {
                id: coffeeStore.id.toString()
            }
        };
    });
    return {
        paths,
        fallback: true
    };
}

const CoffeeStore = (initialProps) => {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    // console.log('router', router);
    const id = router.query.id;

    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

    const {
        state: { coffeeStores }
    } = useContext(StoreContext);

    useEffect(() => {
        if (initialProps.coffeeStore && isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.length > 0) {
                const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
                    return coffeeStore.id.toString() === id;
                });
                setCoffeeStore(findCoffeeStoreById);
            }
        }
    }, [id]);

    const { name, address, neighborhood, imgUrl } = coffeeStore;

    const handleUpvoteButton = () => {
        console.log('handleupvotebutton');
    };

    return (
        <div className={styles.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href='/'>← Back to Home</Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <p className={styles.name}>{name}</p>
                    </div>
                    <Image
                        src={
                            imgUrl ||
                            'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                        }
                        width={600}
                        height={360}
                        className={styles.storeImg}
                        alt={name}
                    />
                </div>

                <div className={cls('glass', styles.col2)}>
                    {address && (
                        <div className={styles.iconWrapper}>
                            <Image
                                src='/static/icons/places.svg'
                                width='24'
                                height='24'
                                alt='address'
                            />
                            <p className={styles.text}>{address}</p>
                        </div>
                    )}
                    {neighborhood && (
                        <div className={styles.iconWrapper}>
                            <Image
                                src='/static/icons/nearMe.svg'
                                width='24'
                                height='24'
                                alt='neighborhood'
                            />
                            {<p className={styles.text}>{neighborhood}</p>}
                        </div>
                    )}

                    <div className={styles.iconWrapper}>
                        <Image src='/static/icons/star.svg' width='24' height='24' alt='star' />
                        <p className={styles.text}>1</p>
                    </div>

                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
                        Up Vote!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoffeeStore;
