var dbPromised = idb.open("super-soccer", 1, function(upgradeDb) {
  var clubsObjectStore = upgradeDb.createObjectStore("clubs", {
    keyPath: "id"
  });
  clubsObjectStore.createIndex("name", "name", {
    unique: false
  });
});

function setFavorite(club) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("clubs", "readwrite");
      var store = tx.objectStore("clubs");
      store.add(club);
      return tx.complete;
    })
    .then(function() {
      console.log("Club added to favorite.");
    });
}

function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("clubs", "readonly");
        var store = tx.objectStore("clubs");
        return store.getAll();
      })
      .then(function(clubs) {
        resolve(clubs);
      });
  });
}

function getAllByTitle(title) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("articles", "readonly");
      var store = tx.objectStore("articles");
      var titleIndex = store.index("post_title");
      var range = IDBKeyRange.bound(title, title + "\uffff");
      return titleIndex.getAll(range);
    })
    .then(function(articles) {
      console.log(articles);
    });
}

function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("articles", "readonly");
        var store = tx.objectStore("articles");
        return store.get(id);
      })
      .then(function(article) {
        resolve(article);
      });
  });
}
