function createUser(user) {
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://codify-dfec.restdb.io/rest/accounts",
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "x-apikey": "5f2be350a189196e40cc97df",
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(user)
    });
}

$(document).ready(function () {
    function User(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.badges = [];
	}

    $('.password-visibility').click(function() {
        if ($('#login-password').attr('type') == 'password') {
            $(this).attr('src', 'images/icons/eye.svg');
            $('#login-password').attr('type', 'text');
        }
        else if ($('#login-password').attr('type') == 'text') {
            $(this).attr('src', 'images/icons/eye-slash.svg');
            $('#login-password').attr('type', 'password');
        }
    });
    
    $(document).on('click', '#sign-up-btn-sign-up', function() {
        if ($('#sign-up-email').val() != "" && $('#sign-up-username').val() != "" && $('#sign-up-password').val() != "") {
            // Clear all alert boxes before appending
            $('.alert').remove();
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "https://codify-dfec.restdb.io/rest/accounts",
                "method": "GET",
                "headers": {
                  "content-type": "application/json",
                  "x-apikey": "5f2be350a189196e40cc97df",
                  "cache-control": "no-cache"
                },
                "beforeSend": function() {
                    $('.loader').css('visibility', 'visible');
                }
            })
            .done(function(res) {
                $('.loader').css('visibility', 'hidden');
                let accountExists;

                $.each(res, function(key) {
                    if (res[key].email.toLowerCase() == $('#sign-up-email').val().toLowerCase() || res[key].username.toLowerCase() == $('#sign-up-username').val().toLowerCase()) {
                        accountExists = true;
                        return false;
                    }
                    accountExists = false;
                });
                if (accountExists) {
                    $('.ls-form').prepend('<div class="alert alert-danger">An account with that email or username already exists!<img class="close-alert" src="images/icons/cross.svg"></img></div>');
                    return false;
                }
                $('.ls-form').prepend('<div class="alert alert-success">Your account has been successfully created!<img class="close-alert" src="images/icons/cross.svg"></img></div>');
                let email = $('#sign-up-email').val();
                let username = $('#sign-up-username').val();
                let password = $('#sign-up-password').val();
                
                const newUser = new User(email, username, password);
                createUser(newUser);
                // Reset form if sign up successful
                $('.ls-form form').trigger('reset');
            });
        }
        else {
            ($('#sign-up-email').val() == "") ? $('#sign-up-email').css('border-color', 'red') : $('#sign-up-email').css('border-color', '');
            ($('#sign-up-username').val() == "") ? $('#sign-up-username').css('border-color', 'red') : $('#sign-up-username').css('border-color', '');
            ($('#sign-up-password').val() == "") ? $('#sign-up-password').css('border-color', 'red') : $('#sign-up-password').css('border-color', '');
        }
    });
    
    $('#login-btn-login').click(function() {
        // Clear all alert boxes before appending
        $('.alert').remove();
        if ($('#login-username').val() != "" && $('#login-password').val() != "") {
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "https://codify-dfec.restdb.io/rest/accounts",
                "method": "GET",
                "headers": {
                  "content-type": "application/json",
                  "x-apikey": "5f2be350a189196e40cc97df",
                  "cache-control": "no-cache"
                },
                "beforeSend": function() {
                    $('.loader').css('visibility', 'visible');
                }
            })
            .done(function(res) {
                $('.loader').css('visibility', 'hidden');
                let accountExists;

                $.each(res, function(key) {
                    if (res[key].username.toLowerCase() == $('#login-username').val().toLowerCase() && res[key].password == $('#login-password').val()) {
                        accountExists = true;
                        return false;
                    }
                    accountExists = false;
                });
                if (accountExists) {
                    $('.ls-form').prepend('<div class="alert alert-success">Successfully logged in (will add window location later)<img class="close-alert" src="images/icons/cross.svg"></img></div>');
                    return false;
                }
                $('.ls-form').prepend('<div class="alert alert-danger">Invalid username or password, please try again.<img class="close-alert" src="images/icons/cross.svg"></img></div>');
            });
        }
        else {
            ($('#login-username').val() == "") ? $('#login-username').css('border-color', 'red') : $('#login-username').css('border-color', '');
            ($('#login-password').val() == "") ? $('#login-password').css('border-color', 'red') : $('#login-password').css('border-color', '');
        }
    });

    $(document).on('click', '.close-alert', function() {
        $(this).parent().hide();
    })
});