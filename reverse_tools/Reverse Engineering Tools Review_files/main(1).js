$("document").ready( function () {
    
    $('.navbar [data-toggle="dropdown"]').bootstrapDropdownHover({});

    var findBootstrapEnvironment = function() {
        var envs = ['xs', 'sm', 'md', 'lg'];

        var $el = $('<div>');
        $el.appendTo($('body'));

        for (var i = envs.length - 1; i >= 0; i--) {
            var env = envs[i];

            $el.addClass('hidden-'+env);
            if ($el.is(':hidden')) {
                $el.remove();
                return env
            }
        }
    };

    $('#newsletter').on('hidden.bs.modal', function () {
        Cookies.set("Newsletter", "1", { expires: 365 });
    })

    $('#newsletter-form').on('beforeSubmit', function(event, jqXHR, settings) {
        var form = $(this);
        if(form.find('.has-error').length) {
            return false;
        }

        $.ajax({
            url: form.attr('action'),
            type: 'post',
            data: form.serialize(),
            success: function(data) {

                var alert_class = data['result'] == 0 ? "alert alert-info" : "alert alert-warning";

                $("#newsletter-info").text(data['message']).attr('class', alert_class);

                if (data['result'] <= 2)
                {
                    $("[name='newsletter-subscribe-button']").hide();

                    $("#newsletter-form-close").attr('class', 'btn btn-info').text(data['close']);
                }
            }
        });

        return false;
    });

    $('#newsletter-inline-form').on('beforeSubmit', function(event, jqXHR, settings) {
        var form = $(this);
        if(form.find('.has-error').length) {
            return false;
        }

        $.ajax({
            url: form.attr('action'),
            type: 'post',
            data: form.serialize(),
            success: function(data) {

                var alert_class = data['result'] == 0 ? "text-success" : "";

                $("#newsletter-inline-info").text(data['message']).attr('class', alert_class);
            }
        });

        return false;
    });

    (function() {

        var newsletter_cookie = Cookies.get('Newsletter');

        if (newsletter_cookie !== undefined) return;

        var bootstrap_env = findBootstrapEnvironment();

        if (bootstrap_env == "xs" || bootstrap_env == "sm") {
            setTimeout(function(){ $('#newsletter').modal('show') }, 4000);
        }
        else
        {
            var current_scroll = 0;
            var last_mouse_y = null;

            $(document).scroll(function () { current_scroll = $(this).scrollTop(); }).mousemove(function (e) {
                var speed = last_mouse_y - e.pageY;
                var success_val = e.pageY - speed;

                if (success_val < last_mouse_y && success_val <= current_scroll) {

                    $('#newsletter').modal('show');
                    $(document).off("mousemove");
                }

                last_mouse_y = e.pageY;
            });
        }

    })();

});
