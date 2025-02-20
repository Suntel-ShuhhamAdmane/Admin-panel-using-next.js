import mysql from "mysql2/promise"

let connection: mysql.Connection;
export const createConnection= async ()=>{
    // if not connection we will do new connection
if(!connection){
    connection=await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      name: process.env.DATABASE_NAME,
    })
}
return connection;
}