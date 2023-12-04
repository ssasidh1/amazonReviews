
import {MongoClient} from 'mongodb'
import {AggBestSellingCategories,AggBestSellCategoriesByYear} from './aggregation.js'
import { showSchema } from './showSchema.js'
import {  connectDB } from './connectDB.js'
async function main(){
    const uri = "mongodb://localhost:27017"
    const client = new MongoClient(uri)
    const filePath = "../../NewDataset.csv"
    const command = "mongoimport --db=db_amazon --collection reviews2 --type csv --file D:/DB_proj/NewDataset.csv --headerline"
    try{
        await client.connect();

        // await showDBS(client);
        // await mongoImport(command)
        await connectDB(client)
        // await AggBestSellingCategories()
        // await showSchema();
        await AggBestSellCategoriesByYear();
    }
    catch(e){
        console.error(e)
    }
    finally{
        await client.close();
    }
}

main().catch(console.error)

