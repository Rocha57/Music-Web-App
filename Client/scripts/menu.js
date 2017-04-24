function upload(){
    this.window.location.href = 'uploadtrack.html';
}

function listTracks(){
    this.window.location.href = 'listtracks.html';
}

function deletePlaylist(row){
    var table = document.getElementById("playlists-table");
    var firstRow = table.rows[row+2].cells;
    var id = firstRow.item(0).innerHTML;
    $.ajax({
        url: sessionStorage.getItem('url')+'/users/'+sessionStorage.getItem('user')+'/playlists/'+id,
        data:"",
        method: 'delete',
        dataType: 'json',
        success: function(data){
            if (data == -1){
                alert('A error ocurred');
            }
            else{
                alert('Playlist successfully deleted');
                window.location.href = "menu.html";
            }
        }
    })
}

function deleteTrack(row){
    var table = document.getElementById("my-tracks-table");
    var firstRow = table.rows[row+2].cells;
    var id = firstRow.item(0).innerHTML;
    console.log(id);
    $.ajax({
        url: sessionStorage.getItem('url')+'/users/'+sessionStorage.getItem('user')+'/tracks/'+id,
        data:"",
        method: 'delete',
        dataType: 'json',
        success: function(data){
            alert('Track successfully deleted');
            window.location.href = "menu.html";
        }
    })
}

function editName(row) {
    var table = document.getElementById("playlists-table");
    var firstRow = table.rows[row + 2].cells;
    var id = firstRow.item(0).innerHTML;
    var name = prompt("Please insert the new name", firstRow.item(1).innerHTML);
    var request = $.ajax({
        url: sessionStorage.getItem('url') + '/users/' + sessionStorage.getItem('user') + '/playlists/' + id,
        data: {name: name},
        method: 'put',
        dataType: 'json',
    });

    window.location.href = "menu.html"

}

function seeTracks(row){
    var table = document.getElementById("playlists-table");
    var firstRow = table.rows[row+2].cells;
    var id = firstRow.item(0).innerHTML;
    console.log("seeTracks");
    var rows = document.getElementById('tracks').children[1];
    while(rows.childElementCount >1)
        rows.removeChild(rows.lastChild);
    $.ajax({
        url: sessionStorage.getItem('url')+'/users/'+sessionStorage.getItem('user')+'/playlists/'+id+'/tracks',
        data: "",
        method: 'get',
        dataType: 'json',
        success: function(data){
            $.each(data, function(i, item) {
                var $tr = $('<tr>').append(
                    $('<td>').text(item.id),
                    $('<td>').text(item.title),
                    $('<td>').text(item.artist),
                    $('<td>').text(item.album),
                    $('<td>').html($('<input></input>').attr({'type': 'button','class': 'btn btn-sm btn-danger', 'id': 'row', 'onclick' : 'removeFromPlaylist('+i+','+id+')'}).val("Remove"))
                ).appendTo('#tracks');
            });
        }
    })
}

function removeFromPlaylist(row, playlist_id){
    var table = document.getElementById("tracks");
    var firstRow = table.rows[row+2].cells;
    var id = firstRow.item(0).innerHTML;
    $.ajax({
        url: sessionStorage.getItem('url')+'/users/'+sessionStorage.getItem('user')+'/playlists/'+playlist_id+'/tracks/'+id,
        data: "",
        method: 'delete',
        dataType: 'json',
        success: function(data){
            alert('Track successfully removed from Playlist');
            window.location.href = "menu.html";
        }
    })
}

$(function(){
    // perform the AJAX request
    $.ajax({
        url: sessionStorage.getItem('url')+'/users/'+sessionStorage.getItem('user')+'/playlists',
        data: "",
        dataType: 'json',
        method: 'get',
        success: function(data) {
            $.each(data, function(i, item) {
                var $tr = $('<tr>').append(
                    $('<td>').text(item.id),
                    $('<td>').text(item.title),
                    $('<td>').text(item.date),
                    $('<td>').html($('<input></input>').attr({'type': 'button','class': 'btn btn-sm btn-success', 'id': 'row1', 'onclick' : 'seeTracks('+i+')'}).val("See Tracks")),
                    $('<td>').html($('<input></input>').attr({'type': 'button','class': 'btn btn-sm btn-primary', 'id': 'row2', 'onclick' : 'editName('+i+')'}).val("Name")),
                    $('<td>').html($('<input></input>').attr({'type': 'button','class': 'btn btn-sm btn-danger', 'id': 'row', 'onclick' : 'deletePlaylist('+i+')'}).val("Delete"))
                ).appendTo('#playlists-table');
            });
        }
    });

    $.ajax({
        url: sessionStorage.getItem('url')+'/users/'+sessionStorage.getItem('user')+'/tracks',
        data: "",
        dataType: 'json',
        method: 'get',
        success: function(data) {
            $.each(data, function(i, item) {
                var $tr = $('<tr>').append(
                    $('<td>').text(item.id),
                    $('<td>').text(item.title),
                    $('<td>').text(item.artist),
                    $('<td>').text(item.album),
                    $('<td>').text(item.release_year),
                    $('<td>').html($('<input></input>').attr({'type': 'button','class': 'btn btn-sm btn-primary', 'id': 'row2', 'onclick' : 'editTrack('+i+')'}).val("Edit")),
                    $('<td>').html($('<input></input>').attr({'type': 'button','class': 'btn btn-sm btn-danger', 'id': 'row', 'onclick' : 'deleteTrack('+i+')'}).val("Delete"))
                ).appendTo('#my-tracks-table');
            });
        }
    });

    $('#createPlaylist').submit(function(event){
        event.preventDefault();
        // gather the form data
        var formName = $(this).attr('name');
        var formData = $(this).serialize();
        var formMethod = $(this).attr('method');
        var processingScript = sessionStorage.getItem('url')+'/users/'+sessionStorage.getItem('user')+'/playlists';

        // perform the AJAX request
        var request = $.ajax({
            url: processingScript,
            method: formMethod,
            data: formData,
            dataType: "json"
        });

        // handle the responses
        request.done(function(data) {
            // update the user
            console.log(data)
            alert('Playlist successfully created');
            window.location.href = 'menu.html'
        })
        request.fail(function(jqXHR, textStatus) {
            console.log(textStatus);
            alert('Error')
        })
        request.always(function(data) {
            // clear the form
            $('form[name="' + formName + '"]').trigger('reset');
        });
    });

});