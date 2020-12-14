const getMongoURI = dbName => {
    return `mongodb+srv://sample_user:kevin123@cluster0-oqjxe.mongodb.net/${dbName}?retryWrites=true&w=majority`;
};

module.exports = {
    getMongoURI
};
