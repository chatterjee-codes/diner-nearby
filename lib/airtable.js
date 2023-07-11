const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(
    process.env.AIRTABLE_BASE_KEY
);
const table = base('restaurants-nearby');

const getMinifiedRecord = (record) => {
    return {
        recordId: record.id,
        ...record.fields
    };
};

const getMinifiedRecords = (records) => records.map((record) => getMinifiedRecord(record));

const findRecordByFilter = async (id) => {
    const findCoffeeStoreRecords = await table
        .select({
            filterByFormula: `id='${id}'`
        })
        .firstPage();

    return getMinifiedRecords(findCoffeeStoreRecords);
};

export { table, getMinifiedRecords, findRecordByFilter };
