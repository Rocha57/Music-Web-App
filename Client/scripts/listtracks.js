$(function() {
    $('#output').text('Welcome back, ' + sessionStorage.getItem('name'));
    // perform the AJAX request
    $.ajax({
        url: sessionStorage.getItem('url')+'/tracks',
        data: "",
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $.each(data, function (i, item) {
                var $tr = $('<tr>').append(
                    $('<td>').text(item.id),
                    $('<td>').text(item.title),
                    $('<td>').text(item.artist),
                    $('<td>').text(item.album),
                    $('<td>').text(item.release_year),
                    $('<td>').html($('<select></select>')),
                    $('<td>').html($('<input></input>').attr({
                        'type': 'button',
                        'class': 'btn btn-sm btn-success',
                        'id': 'row1',
                        'onclick': 'addToPlaylist(' + i + ')'
                    }).val("Add"))
                ).appendTo('#tracks-table')
            });
        }
    });
});