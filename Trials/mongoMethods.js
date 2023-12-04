import {exec} from 'child_process'

export async function showDBS(client){
    const dbLs = await client.db().admin().listDatabases();
    dbLs.databases.forEach(db=>console.log(`${db.name}`))
}

export async function mongoImport(command){
    try{
        const {stdout,stderr} = await exec(command)
        stdout.on('data', (data) => {
            console.log(`Received chunk ${data}`);
          })
        // console.error(`stderr:${stderr}`)
    }catch(err){
        console.error(`Error:${err}`)
    }
}
