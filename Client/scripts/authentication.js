if (sessionStorage.getItem('user') == null){
    this.window.location.href = 'index.html'
}

function logout(){
    $.ajax({
        url: sessionStorage.getItem('url')+'/logout',
        method: 'get'
    })
    sessionStorage.clear();
    this.window.location.href = 'index.html';
}

function search(){
    var title = document.getElementById('search-title').value;
    var artist = document.getElementById('search-artist').value;
    $.ajax({
        url: sessionStorage.getItem('url')+'/search',
        data: {title: title, artist: artist},
        method: 'get',
        dataType: 'json',
        success: function(data){
            alert(data.toString());
            console.log(data);
        }
    })
}

$(function () {
    $('#output').text('Welcome back, '+sessionStorage.getItem('name'));
})