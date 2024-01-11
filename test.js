const readDB = require('./controllers/readDB');
const writeDB = require('./controllers/writeDB');

(async function(){

    try {
        
        let users = await readDB('./db/users.json');
        
        console.log(users);

        users = users.filter(user => user.email !== "namenotfound477@gmail.com");

        console.log(users)
        
    } catch (error) {
        console.log(error)
    }
})();