var mongoose = require('mongoose');

if (mongoose.connection.readyState == 0){
    mongoose.connect('mongodb://localhost:27017/test', function (err) {
        if(err)
            console.log('erreur de connection a la base de données');
        else
            console.log('connecté a la base de données');
    });
}

module.exports = mongoose;