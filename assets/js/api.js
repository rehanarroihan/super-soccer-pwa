var base_url = "https://api.football-data.org/";

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function getStandings() {
    if ("caches" in window) {
      caches.match(base_url + "v2/competitions/2014/standings").then(function(response) {
        if (response) {
          response.json().then(function(data) {
            var standingList = "";
            data.standings[0].table.forEach(function(standing) {
                standingList += `
                    <tr>
                        <td>${standing.position}</td>
                        <td><a href="./club.html?id=${standing.team.id}">${standing.team.name}</a></td>
                        <td>${standing.playedGames}</td>
                        <td>${standing.won}</td>
                        <td>${standing.lost}</td>
                        <td>${standing.points}</td>
                    </tr>
                `;
            });
            document.getElementById("standings").innerHTML = standingList;
          });
        }
      });
    }
  
    fetch(base_url + "v2/competitions/2014/standings", {
        headers:{
            'X-Auth-Token': 'f33297fb19be41cab363ea9c1ab9ee79'
          }
    })
    .then(status)
    .then(json)
    .then(function(data) {
        var standingList = "";
        data.standings[0].table.forEach(function(standing) {
            standingList += `
                <tr>
                    <td>${standing.position}</td>
                    <td><a href="./club.html?id=${standing.team.id}">${standing.team.name}</a></td>
                    <td>${standing.playedGames}</td>
                    <td>${standing.won}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.points}</td>
                </tr>
            `;
        });
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("standings").innerHTML = standingList;
    })
    .catch(error);
}

function getClubs() {
    if ("caches" in window) {
        caches.match(base_url + "v2/competitions/2014/teams").then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    var clubList = "";
                    data.teams.forEach(function(team) {
                        var crestUrl = team.crestUrl.replace(/^http:\/\//i, 'https://');
                        clubList += `
                            <div class="card horizontal waves-effect waves-block waves-light">
                                <a href="./club.html?id=${team.id}">
                                    <div class="card-image waves-effect waves-block waves-light">
                                        <img style="width: 170px;height: 224px;object-fit:contain;" alt="${team.name} Logo" src="${crestUrl}">
                                    </div>
                                </a>
                                <div class="card-stacked">
                                    <div class="card-content">
                                        <h5>${team.name}</h5>
                                        <h6>${team.founded}</h6>
                                        <p>${team.venue}</p>
                                    </div>
                                    <div class="card-action">
                                        <a href="./club.html?id=${team.id}"><i class="fa fa-info-circle"></i> Club Detail</a>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    document.getElementById("clubs").innerHTML = clubList;
                });
            }
        });
    } 
    
    fetch(base_url + "v2/competitions/2014/teams", {
            headers:{
                'X-Auth-Token': 'f33297fb19be41cab363ea9c1ab9ee79'
            }
        })
        .then(status)
        .then(json)
        .then(function(data) {
            var clubList = "";
            data.teams.forEach(function(team) {
                var crestUrl = team.crestUrl.replace(/^http:\/\//i, 'https://');
                clubList += `
                    <div class="card horizontal">
                        <a href="./club.html?id=${team.id}">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img style="width: 170px;height: 224px;object-fit:contain;" alt="${team.name} Logo" src="${crestUrl}">
                            </div>
                        </a>
                        <div class="card-stacked">
                            <div class="card-content">
                                <h5>${team.name}</h5>
                                <h6>${team.founded}</h6>
                                <p>${team.venue}</p>
                            </div>
                            <div class="card-action">
                                <a href="./club.html?id=${team.id}"><i class="fa fa-info-circle"></i> Club Detail</a>
                            </div>
                        </div>
                    </div>
                `;
            });
            document.getElementById("clubs").innerHTML = clubList;
        })
        .catch(error);
}

function getClubById() {
    return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
  
    if ("caches" in window) {
      caches.match(base_url + "v2/teams/" + idParam).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            var crestUrl = data.crestUrl.replace(/^http:\/\//i, 'https://');
            var clubDetailHTML = `
                <div class="card horizontal waves-effect waves-block waves-light">
                    <a href="./club.html?id=${data.id}">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img style="width: 170px;height: 224px;object-fit:contain;" alt="${data.name} Logo" src="${crestUrl}">
                        </div>
                    </a>
                    <div class="card-stacked">
                        <div class="card-content">
                            <h5>${data.name}</h5>
                            <h6>${data.founded}</h6>
                            <p>${data.venue}</p>
                        </div>
                        <div class="card-action" id="action-here">
                            ${setOrRemoveFav(data.id)}
                        </div>
                    </div>
                </div>
            `;
            var playerList = "";
            data.squad.forEach(function(player) {
                playerList += `
                    <div class="card">
                        <div class="card-content">
                            <p>${player.shirtNumber}. ${player.name}</p>
                            <span>${player.position}</span>
                        </div>
                    </div>
                `;
            });
            document.getElementById("body-content").innerHTML = clubDetailHTML;
            document.getElementById("player-list").innerHTML = playerList;
            resolve(data);
          });
        }
      });
    }
  
    fetch(base_url + "v2/teams/" + idParam, {
            headers:{
                'X-Auth-Token': 'f33297fb19be41cab363ea9c1ab9ee79'
            }
        })
        .then(status)
        .then(json)
        .then(function(data) {
            var crestUrl = data.crestUrl.replace(/^http:\/\//i, 'https://');
            var clubDetailHTML = `
                <div class="card horizontal waves-effect waves-block waves-light">
                    <a href="./club.html?id=${data.id}">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img style="width: 170px;height: 224px;object-fit:contain;" alt="${data.name} Logo" src="${crestUrl}">
                        </div>
                    </a>
                    <div class="card-stacked">
                        <div class="card-content">
                            <h5>${data.name}</h5>
                            <h6>${data.founded}</h6>
                            <p>${data.venue}</p>
                        </div>
                        <div class="card-action" id="action-here">
                            ${setOrRemoveFav(data.id)}
                        </div>
                    </div>
                </div>
            `;
            var playerList = "";
            data.squad.forEach(function(player) {
                playerList += `
                    <div class="card">
                        <div class="card-content">
                            <p>${player.shirtNumber}. ${player.name}</p>
                            <span>${player.position}</span>
                        </div>
                    </div>
                `;
            });
            document.getElementById("body-content").innerHTML = clubDetailHTML;
            document.getElementById("player-list").innerHTML = playerList;
            resolve(data);  
        });
    });
}

function setOrRemoveFav(club_id) {
    getFavById(club_id).then(function(res) {
        console.log(res);
        var action = "";
        if(res == undefined) {
            action = '<a onclick="saveToFav()" href="javascript:void(0)"><i class="fa fa-star"></i> Add to Favorite</a>';
        } else {
            action = '<a onclick="removeFav()" href="javascript:void(0)"><i class="fa fa-star-half-alt"></i> Remove From Favorite</a>';
        }
        document.getElementById("action-here").innerHTML = action;
    });
}

function getFavoriteClub() {
    getAll().then(function(favClubs) {
        var favList = "";
        document.getElementById("favClubTitle").innerHTML = `Favorite Club <span class="new badge" data-badge-caption="Club(s)">${favClubs.length}</span>`;

        favClubs.forEach(function(favClub) {
            var crestUrl = favClub.crestUrl.replace(/^http:\/\//i, 'https://');
            favList += `
                <div class="card horizontal">
                    <a href="./club.html?id=${favClub.id}">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img style="width: 170px;height: 224px;object-fit:contain;" alt="${favClub.name} Logo" src="${crestUrl}">
                        </div>
                    </a>
                    <div class="card-stacked">
                        <div class="card-content">
                            <h5>${favClub.name}</h5>
                            <h6>${favClub.founded}</h6>
                            <p>${favClub.venue}</p>
                        </div>
                        <div class="card-action">
                            <a href="./club.html?id=${favClub.id}"><i class="fa fa-info-circle"></i> Club Detail</a>
                        </div>
                    </div>
                </div>
            `;
        });
        document.getElementById("favo").innerHTML = favList;
    });
  }