$(function(){

    sessionStorage.setItem('url', 'http://Custom-env.vag7emtin6.eu-west-1.elasticbeanstalk.com/v1');

    $('#login').submit(function(event){
        event.preventDefault();
        // gather the form data
        var formName = $(this).attr('name');
        var formData = $(this).serialize();
        var formMethod = $(this).attr('method');
        var processingScript = sessionStorage.getItem('url')+'/';

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
            console.log(data);
            alert('Welcome '+data.name);
            sessionStorage.setItem('user',data.id);
            sessionStorage.setItem('name',data.name);
            window.location.href = 'menu.html'
        });
        request.fail(function(jqXHR, textStatus) {
            console.log(textStatus);
            alert('User/Password combination does not exist')
        });
        request.always(function(data) {
            // clear the form
            $('form[name="' + formName + '"]').trigger('reset');
        });
    });

    // handle registration
    $('#register').submit(function(event){
        event.preventDefault();
        // gather the form data
        var formName = $(this).attr('name');
        var formData = $(this).serialize();
        var formMethod = $(this).attr('method');
        var processingScript = sessionStorage.getItem('url')+'/users';

        // perform the AJAX request
        var request = $.ajax({
            url: processingScript,
            method: formMethod,
            data: formData,
            dataType: "json"
        });

        // handle the responses
        request.done(function(data) {
            alert('Thank you for registering, '+data.name+'\nYou can now login');
            $('#login').delay(100).fadeIn(100);
            $('#register').fadeOut(100);
            $('#register-form-link').removeClass('active');
            $('#login-form-link').addClass('active');
            e.preventDefault();
        })
        request.fail(function(jqXHR, textStatus) {
            console.log(textStatus);
            alert('A error has ocurred. Try again later')
        })
        request.always(function(data) {
            // clear the form
            $('form[name="' + formName + '"]').trigger('reset');
        });
    });


    $('#login-form-link').click(function(e) {
        $('#login').delay(100).fadeIn(100);
        $('#register').fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
        $('#register').delay(100).fadeIn(100);
        $('#login').fadeOut(100);
        $("#login-form-link").removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

});