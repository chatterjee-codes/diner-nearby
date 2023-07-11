import { table, getMinifiedRecords, findRecordByFilter } from '../../lib/airtable';

const createCoffeeStore = async (req, res) => {
    if (req.method === 'POST') {
        const { id, name, address, neighbourhood, vote, imgUrl } = req.body;
        try {
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    res.json(records);
                } else {
                    // create a record
                    if (name) {
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    neighbourhood,
                                    vote,
                                    imgUrl
                                }
                            }
                        ]);
                        const records = getMinifiedRecords(createRecords);
                        res.json({ message: 'created a record', records });
                    } else {
                        res.status(400);
                        res.json({ message: 'name is missing' });
                    }
                }
            } else {
                res.status(400);
                res.json({ message: 'id is missing' });
            }
        } catch (error) {
            console.error('Error creating or finding store', error);
            res.status(500);
            res.json({ message: 'Error creating or finding store', error });
        }
    }
};

export default createCoffeeStore;
