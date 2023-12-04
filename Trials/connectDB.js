let db,coll;
export async function connectDB(client){
    db= client.db("db_amazon")
    coll = db.collection("reviews2")
}


export function getDB(){
    return db
}
export  function getColl(){
    return coll
}