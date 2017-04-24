var form = document.getElementById('create');

function uploadFile() {
    var fd = new FormData(form);
    var title = document.getElementById('title').value;
    var artist = document.getElementById('artist').value;
    var album = document.getElementById('album').value;
    var year = document.getElementById('year').value;
    var file = document.getElementById('file').files[0];

    if (file.name.indexOf(' ') >= 0){
        alert("Filename has White Spaces, remove them");
        this.window.location.href="uploadtrack.js";
        return;
    }

    fd.append('title', title);
    fd.append('artist', artist);
    fd.append('album', album);
    fd.append('year', year);
    fd.append("file", file);

    $.ajax({
        url: sessionStorage.getItem('url') + '/users/' + sessionStorage.getItem('user') + '/tracks',
        type: "POST",
        data: fd,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(data){
            alert(data);
            console.log(data);
        }
    });

    request.fail(function (jqXHR, textStatus) {
        console.log(textStatus);
    });
}