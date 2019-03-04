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
      location.reload();
    });
}

function removeFavorite(club_id) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("clubs", "readwrite");
      var store = tx.objectStore("clubs");
      store.delete(club_id);
      return tx.complete;
    })
    .then(function() {
      console.log("Club removed from favorite.");
      location.reload();
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

function getFavById(club_id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("clubs", "readonly");
        var store = tx.objectStore("clubs");
        return store.get(club_id);
      })
      .then(function(club) {
        resolve(club);
      });
  });
}
