$(document).ready(function () {
    $('#password-visibility').click(function() {
        if ($('#login-password').attr('type') == 'password') {
            $(this).attr('src', '../images/icons/eye.svg');
            $('#login-password').attr('type', 'text');
        }
        else if ($('#login-password').attr('type') == 'text') {
            $(this).attr('src', '../images/icons/eye-slash.svg');
            $('#login-password').attr('type', 'password');
        }
	});
});