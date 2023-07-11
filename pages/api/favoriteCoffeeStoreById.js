import { table, findRecordByFilter, getMinifiedRecords } from '../../lib/airtable';

const favoriteCoffeeStoreById = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            const { id } = req.body;

            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    const record = records[0];

                    const calculateVote = parseInt(record.vote) + parseInt(1);

                    // update a record
                    const updateRecord = await table.update([
                        {
                            id: record.recordId,
                            fields: {
                                vote: calculateVote
                            }
                        }
                    ]);
                    if (updateRecord) {
                        const minifiedRecords = getMinifiedRecords(updateRecord);
                        res.json(minifiedRecords);
                    }
                } else {
                    res.json({ message: 'Coffee store id does not exist', id });
                }
            } else {
                res.json({ message: 'Id is missing' });
            }
        } catch (error) {
            res.json(500);
            res.json({ message: 'Error upvoting coffee store', error });
        }
    }
};

export default favoriteCoffeeStoreById;
